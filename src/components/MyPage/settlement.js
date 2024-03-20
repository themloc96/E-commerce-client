import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../../contexts/AuthProvider';
import Dropdown from '../Input/Dropdown';
import { getOrdersByBusinessIdFn } from '../../apis/order.api';
import {
  getSettlementFeeFn,
  getSettlementMaterialFn,
} from '../../apis/after-service.api';
import { formatNumber } from '../../utils/helpers';
import LoadingBox from '../Loading/LoadingBox';

export default function Settlement() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo, currentUser } = state;

  let startMonth = 0;
  let endMonth = 0;
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const firstMonth = thisMonth.toString().padStart(2, '0');
  const [orderData, setOrderData] = useState([]);
  const [yearOptionState, setYearOptionState] = useState(thisYear);
  const [monthOptionState, setMonthOptionState] = useState(firstMonth);
  const yearOptions = [];
  const monthOptions = [];

  if (currentUser) {
    const createYear = new Date(currentUser.createdAt).getFullYear();
    const lastYear = thisYear - createYear;

    const createMonth = new Date(currentUser.createdAt).getMonth() + 1;
    if (
      createYear === yearOptionState &&
      yearOptionState === thisYear &&
      createYear === thisYear
    ) {
      startMonth = createMonth;
      endMonth = thisMonth;
    } else if (
      createYear === yearOptionState &&
      yearOptionState !== thisYear &&
      createYear !== thisYear
    ) {
      startMonth = createMonth;
      endMonth = 12;
    } else if (
      createYear !== yearOptionState &&
      yearOptionState === thisYear &&
      createYear !== thisYear
    ) {
      startMonth = 1;
      endMonth = thisMonth;
    } else {
      startMonth = 1;
      endMonth = 12;
    }

    for (let i = 0; i <= lastYear; i += 1) {
      const year = createYear + i;
      const option = { value: year, label: year };
      yearOptions.push(option);
    }
    for (let i = startMonth; i <= endMonth; i += 1) {
      const month = i.toString().padStart(2, '0');
      const option = { value: month, label: month };
      monthOptions.push(option);
    }
  }
  const setQueryParams = ({ year, month }) => {
    navigate({
      hash,
      search: `?year=${year}&month=${month}`,
    });
  };

  const { data, isFetching, isLoading } = useQuery(
    ['getOrdersByBusinessId', businessInfo?.id],
    () =>
      getOrdersByBusinessIdFn({
        businessId: businessInfo?.id || null,
        size: 999999,
      }),
    {
      enabled: businessInfo !== null,
      onError: error => {
        console.log('getOrdersByBusinessIdFn failed');
        console.log(error);
      },
      onSuccess: _data => {
        const nowDate = `${yearOptionState}-${monthOptionState
          .toString()
          .padStart(2, '0')}`;
        const filtered = _data?.data?.list.filter(item =>
          item.createdAt.includes(nowDate),
        );
        setOrderData(filtered);
      },
    },
  );

  const {
    data: materialData,
    isFetching: isMaterialFetching,
    isLoading: isMaterialLoading,
  } = useQuery(
    [
      'v1/after-service/settlement/material',
      businessInfo?.id,
      yearOptionState,
      monthOptionState,
    ],
    () =>
      getSettlementMaterialFn({
        // myBusinessId: 1 || null,
        myBusinessId: businessInfo?.id || null,
        nowYear: yearOptionState || null,
        nowMonth: monthOptionState || null,
      }),
    {
      enabled: businessInfo?.id !== null,
    },
  );

  const {
    data: businessData,
    isFetching: isBusinessFetching,
    isLoading: isBusinessLoading,
  } = useQuery(
    [
      'v1/after-service/settlement/fee',
      businessInfo?.id,
      yearOptionState,
      monthOptionState,
    ],
    () =>
      getSettlementFeeFn({
        myBusinessId: businessInfo?.id || null,
        // myBusinessId: 1 || null,
        nowYear: yearOptionState || null,
        nowMonth: monthOptionState || null,
      }),
    {
      enabled: businessInfo?.id !== null,
    },
  );

  useEffect(() => {
    const nowDate = `${yearOptionState}-${monthOptionState
      .toString()
      .padStart(2, '0')}`;
    const filtered = data?.data?.list.filter(item =>
      item.createdAt.includes(nowDate),
    );
    setOrderData(filtered);
  }, [yearOptionState, monthOptionState]);

  // 마일리지 포함 총액
  const sumPrice = useMemo(() => {
    if (!orderData) {
      return 0;
    }
    if (orderData?.length <= 0) {
      return 0;
    }

    // orderDetails 기준으로 flatMap
    const detail = orderData
      .filter(item => item.orderConfirmDate !== null)
      .filter(item => item.orderStatus !== 'OC')
      .flatMap(item => item.orderDetails);

    // 마일리지 총합
    const mileageSum = orderData
      .filter(item => item.orderConfirmDate !== null)
      .filter(item => item.orderStatus !== 'OC')
      .reduce((prev, current) => {
        return prev + current.mileagePointUsage;
      }, 0);

    // 금액 총합
    const sum = detail?.reduce((prev, current) => {
      const total = Math.round(
        (current.unitPrice * 1.1 +
          (current.productOptions[0]?.price ?? 0) * 1.1) *
          (current.quantity ?? 1),
      );
      return prev + total;
    }, 0);

    return sum - mileageSum;
  }, [orderData]);

  const businessSumPrice = useMemo(() => {
    const sum = businessData?.list.reduce((prev, current) => {
      return (
        prev +
        (current.travelFee + current.surchargeTotalFee) +
        (current.travelFee + current.surchargeTotalFee) * 0.1
      );
    }, 0);
    return sum;
  }, [businessData]);

  const materialSumPrice = useMemo(() => {
    const sum = materialData?.list.reduce((prev, current) => {
      return prev + (current.totalPrice + current.vat);
    }, 0);
    return sum;
  }, [materialData]);

  const handleClick = () => {
    navigate(
      `/order/details?year=${yearOptionState}&month=${monthOptionState}`,
    );
  };

  const handleClickBusinessTrip = () => {
    navigate(
      `/calculation/travel-expense?year=${yearOptionState}&month=${monthOptionState}`,
    );
  };

  const handleClickMaterials = () => {
    navigate(
      `/calculation/service-material?year=${yearOptionState}&month=${monthOptionState}`,
    );
  };

  return (
    <div className="settlement-container">
      <div className="select-wrap">
        <div>
          <Dropdown
            placeHolderText={thisYear}
            options={yearOptions}
            onOptionChange={option => {
              setYearOptionState(option.value);
              setQueryParams({ year: option.value, month: monthOptionState });
            }}
            valueOfSelect={yearOptionState}
            defaultOptionIndex={yearOptions.length - 1}
          />
        </div>
        <div>
          <Dropdown
            placeHolderText={firstMonth}
            options={monthOptions}
            onOptionChange={option => {
              setMonthOptionState(option.value);
              setQueryParams({ month: option.value, year: yearOptionState });
            }}
            valueOfSelect={monthOptionState}
            defaultOptionIndex={monthOptions.length - 1}
            setValueOfSelect={setMonthOptionState}
            checkFlag
          />
        </div>
      </div>
      {(isLoading || isFetching) && <LoadingBox />}
      {!(isLoading || isFetching) && (
        <div className="settlement-content">
          <div>당월 마감 내역</div>
          <div>
            <button onClick={handleClick}>
              <div>
                <p>바로가기</p>
                <img src="assets/arrow/right-dark.png" alt="arrow" />
              </div>
            </button>
            <div>
              <span>{formatNumber(sumPrice)}</span>원
            </div>
          </div>
        </div>
      )}
      {currentUser?.businessType === 'AS_AGENCY' &&
        (currentUser?.asengineer ||
          currentUser?.memberType === 'ACCOUNT' ||
          currentUser?.previousMemberType === 'ACCOUNT') && (
          <>
            {(isBusinessFetching || isBusinessLoading) && <LoadingBox />}
            {!(isBusinessFetching || isBusinessLoading) && (
              <div className="settlement-content">
                <div>당월 출장비 내역</div>
                <div>
                  <button onClick={handleClickBusinessTrip}>
                    <div>
                      <p>바로가기</p>
                      <img src="assets/arrow/right-dark.png" alt="arrow" />
                    </div>
                  </button>
                  <div>
                    <span>{formatNumber(businessSumPrice)}</span>원
                  </div>
                </div>
              </div>
            )}
            {(isMaterialFetching || isMaterialLoading) && <LoadingBox />}
            {!(isMaterialFetching || isMaterialLoading) && (
              <div className="settlement-content">
                <div>당월 서비스자재 내역</div>
                <div>
                  <button onClick={handleClickMaterials}>
                    <div>
                      <p>바로가기</p>
                      <img src="assets/arrow/right-dark.png" alt="arrow" />
                    </div>
                  </button>
                  <div>
                    <span>{formatNumber(materialSumPrice)}</span>원
                  </div>
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
}
