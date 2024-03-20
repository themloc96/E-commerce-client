import React, { useEffect, useMemo, useState } from 'react';
// COMPs
import { useQuery } from '@tanstack/react-query';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import PageHeader from '../../../components/MyPage/page-header';
import TotalAmountOfTable from '../../../components/WTable/TotalAmountOfTable';
import MaterialTransactionStatement from '../../../components/MyPage/material-transaction-statement';
import ModalComponent from '../../../components/core/modal-base';
import printComponent from '../../../utils/printComponent';
import MaterialOrderListTable from './components/MaterialOrderListTable';

import '../../../styles/calculation/service-material.scss';

import {
  useQueryParams,
  useToggleModal,
  useWindowDimensions,
} from '../../../hooks';
import { useAuthContext } from '../../../contexts/AuthProvider';
import Dropdown from '../../../components/Input/Dropdown';
import { getSettlementMaterialFn } from '../../../apis/after-service.api';
import LoadingBox from '../../../components/Loading/LoadingBox';
import { formatNumber, getMobileType } from '../../../utils/helpers';

function ServiceMaterialPage() {
  const { width } = useWindowDimensions();
  const {
    state: { currentUser, businessInfo },
  } = useAuthContext();
  let startMonth = 0;
  let endMonth = 0;
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const [monthChange, setMonthChange] = useState('');
  const [changeDate, setChangeDate] = useState(false);
  const { isOpen, onToggle } = useToggleModal();
  const { filterParamsObj, setSearchParams } = useQueryParams();
  const { year, month } = filterParamsObj;
  const yearOptions = [];
  const monthOptions = [];

  const date = new Date();
  // get current year
  const curYear = date.getFullYear();
  // get current month
  const curMonth = date.getMonth() + 1;
  if (currentUser) {
    const createYear = new Date(currentUser.createdAt).getFullYear();
    const lastYear = thisYear - createYear;
    const selectYear = Number(year);
    const createMonth = new Date(currentUser.createdAt).getMonth() + 1;

    if (
      createYear === selectYear &&
      selectYear === thisYear &&
      createYear === thisYear
    ) {
      startMonth = createMonth;
      endMonth = thisMonth;
    } else if (
      createYear === selectYear &&
      selectYear !== thisYear &&
      createYear !== thisYear
    ) {
      startMonth = createMonth;
      endMonth = 12;
    } else if (
      createYear !== selectYear &&
      selectYear === thisYear &&
      createYear !== thisYear
    ) {
      startMonth = 1;
      endMonth = thisMonth;
    } else {
      startMonth = 1;
      endMonth = 12;
    }

    for (let i = 0; i <= lastYear; i += 1) {
      const nowYears = createYear + i;
      const option = { value: nowYears, label: nowYears };
      yearOptions.push(option);
    }
    for (let i = startMonth; i <= endMonth; i += 1) {
      const nowMonth = i.toString().padStart(2, '0');
      const option = { value: nowMonth, label: nowMonth };
      monthOptions.push(option);
    }
  }

  useEffect(() => {
    if (!(year && month)) {
      setSearchParams({
        ...filterParamsObj,
        year: curYear,
        month: curMonth,
      });
    }
  }, []);

  const { data, isFetching, isLoading } = useQuery(
    ['v1/after-service/settlement/material', businessInfo?.id, filterParamsObj],
    () =>
      getSettlementMaterialFn({
        // myBusinessId: 1 || null,
        myBusinessId: businessInfo?.id || null,
        nowYear: filterParamsObj.year || null,
        nowMonth: filterParamsObj.month || null,
      }),
    {
      enabled: businessInfo?.id !== null,
    },
  );

  const materialSumPrice = useMemo(() => {
    const sum = data?.list.reduce((prev, current) => {
      return prev + (current.totalPrice + current.vat);
    }, 0);
    return sum;
  }, [data]);

  const iframe =
    '<iframe id="ifmcontentstoprinttransaction" style="height: 0px; width: 0px; position: absolute"></iframe>';
  return (
    <div className="service-material">
      <Container>
        {width > 768 && (
          <>
            <PageHeader currentLink="/my-page#calculate" />
            <h2 className="service-material-sub-heading">
              당월 서비스 자재 내역
            </h2>
          </>
        )}

        <div className="service-material-content-outer">
          <div className="service-material-top-of-content">
            <div className="dropdownDiv">
              <Dropdown
                placeHolderText={year}
                options={yearOptions}
                onOptionChange={option => {
                  setSearchParams({ ...filterParamsObj, year: option.value });
                  setChangeDate(true);
                }}
                valueOfSelect={year}
                defaultOptionIndex={yearOptions.findIndex(
                  item => item.label === Number(year),
                )}
              />
              <Dropdown
                placeHolderText={month}
                options={monthOptions}
                onOptionChange={option => {
                  setSearchParams({
                    ...filterParamsObj,
                    month: option.value,
                  });
                  setChangeDate(true);
                }}
                valueOfSelect={month}
                defaultOptionIndex={monthOptions.findIndex(
                  item => item.label === month,
                )}
                setValueOfSelect={setMonthChange}
                checkFlag
              />
            </div>
            <Button
              onClick={onToggle}
              className="!h-[30px] !w-[105px] !p-0 md:!w-[150px] md:!h-[40px] md:!pr-[2px]"
              variant="outline-gray"
            >
              <span className="!text-sm md:!text-lg !font-normal">
                거래명세서
              </span>
            </Button>
          </div>
          {(isLoading || isFetching) && <LoadingBox />}
          {!(isLoading || isFetching) && (
            <div className="service-material-content">
              <MaterialOrderListTable dataList={data?.list} />
              <TotalAmountOfTable
                elementText={
                  <div className="flex items-end md:mt-[-5px]">
                    <span className="f16Medium md:mr-[4px] md:f24Medium">
                      합계
                    </span>
                  </div>
                }
                totalAmountValue={formatNumber(materialSumPrice)}
              />
            </div>
          )}
        </div>
      </Container>
      <ModalComponent
        className="transaction-statement-modal"
        isOpen={isOpen}
        closeModal={onToggle}
      >
        <div className="print-button">
          {getMobileType() === 'default' && (
            <button
              onClick={() =>
                printComponent(
                  'transaction-statement',
                  'ifmcontentstoprinttransaction',
                  onToggle,
                )
              }
            >
              인쇄
            </button>
          )}
        </div>
        <div id="transaction-statement">
          <MaterialTransactionStatement
            buyerBusiness={businessInfo}
            billing={data?.list}
            totalPrice={materialSumPrice}
          />
        </div>
      </ModalComponent>
      <div
        dangerouslySetInnerHTML={{
          __html: iframe,
        }}
      />
    </div>
  );
}

export default ServiceMaterialPage;
