/* eslint-disable camelcase */
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// COMPs
import Container from '../Container';
import Dropdown from '../Input/Dropdown';
import LoadingBox from '../Loading/LoadingBox';
import ModalComponent from '../core/modal-base';
import TransactionStatement from './transaction-statement';

import {
  getOrderCalculationsFn,
  getOrdersByBusinessIdFn,
} from '../../apis/order.api';
import { useAuthContext } from '../../contexts/AuthProvider';
import { useToggleModal, useWindowDimensions } from '../../hooks';
import { useQueryParams } from '../../hooks/useQueryParams';
import '../../styles/my-page/currentmonthorderdetailspage.scss';
import { formatShortDate } from '../../utils/helper.dateTime';
import { formatNumber, generateUId, getMobileType } from '../../utils/helpers';
import printComponent from '../../utils/printComponent';
import PageHeader from './page-header';

export default function Settlement() {
  const { width } = useWindowDimensions();
  const {
    state: { currentUser },
  } = useAuthContext();
  const { id } = currentUser || {
    id: null,
  };

  let startMonth = 0;
  let endMonth = 0;
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const [monthChange, setMonthChange] = useState('');
  const { isOpen, onToggle } = useToggleModal();
  const { filterParamsObj, setSearchParams } = useQueryParams();
  const { year, month } = filterParamsObj;
  const yearOptions = [];
  const monthOptions = [];

  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;

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

  const [orderCalculations, setOrderCalculations] = useState([]);
  const [changeDate, setChangeDate] = useState(false);
  // query: Table Data
  const { data, isFetching, isLoading } = useQuery(
    ['getOrdersByBusinessId', businessInfo?.id],
    () =>
      getOrdersByBusinessIdFn({
        businessId: businessInfo?.id || null,
        size: 999999,
      }),
    {
      enabled: currentUser !== null,
      onError: error => {
        // console.log('getOrdersByBusinessIdFn failed');
        console.log(error);
        setOrderCalculations([]);
      },
      onSuccess: _data => {
        // console.log('getOrdersByBusinessIdFn success');
        // console.log(_data);
        setOrderCalculations(
          _data?.data?.list
            .filter(item => item.orderConfirmDate !== null)
            .filter(item => item.orderStatus !== 'OC')
            .filter(item =>
              item.createdAt.includes(
                `${year}-${month.toString().padStart(2, '0')}`,
              ),
            ) ?? [],
        );
      },
    },
  );
  // const { list: orderCalculations } = data?.data || {
  //   list: [],
  //   totalPrice: 0,
  // };

  const filterData = () => {
    let restMonth = '';
    if (monthChange !== '') restMonth = monthChange;
    else restMonth = month;
    // console.log(year, restMonth);
    setOrderCalculations(
      data?.data?.list
        .filter(item => item.orderConfirmDate !== null)
        .filter(item => item.orderStatus !== 'OC')
        .filter(item => {
          // console.log(
          //   item.createdAt,
          //   `${year}-${restMonth.toString().padStart(2, '0')}`,
          // );
          return item.createdAt.includes(
            `${year}-${restMonth.toString().padStart(2, '0')}`,
          );
        }) ?? [],
    );
    setMonthChange('');
  };

  useEffect(() => {
    if (changeDate === true) {
      filterData();
    }
    setChangeDate(false);
  }, [changeDate]);

  useEffect(() => {
    if (monthChange !== '') {
      filterData();
    }
    setMonthChange('');
  }, [monthChange]);
  const dataBillingNew = useMemo(() => {
    const bill = {
      buyerBusiness: { ...businessInfo },
      order: {},
    };

    const tempDetail =
      data &&
      data.list?.map((item, index) => {
        const isMileageUse = item.mileageAmount < 0;
        // const quantity = item.product_quantity?.replace(/\D/g, '');
        const quantity = item.product_quantity;
        return {
          isMileageUse,
          product: {
            id: index,
            name: isMileageUse ? item.mileageContent : item.product_name,
          },
          createdAt: item.createdAt,
          productUnitName: '개',
          quantity, // 수량
          unitPrice: item.product_unit_price,
          note: '',
          totalPrice: isMileageUse
            ? item.mileageAmount
            : item.product_total_price,
          totalPriceVAT: item.product_vat_price,
        };
      });
    bill.order.orderDetails = tempDetail;
    return bill;
  }, [data, businessInfo]);

  const billing = dataBillingNew;

  // 마일리지 합계
  const sumMileage = useMemo(() => {
    const mileageSum = orderCalculations.reduce((prev, current) => {
      return prev + current.mileagePointUsage;
    }, 0);
    return mileageSum;
  }, [orderCalculations]);

  // 공급가액 합계 (부가세 제외)
  const sumPrice = useMemo(() => {
    // console.log('begin sumPrice');
    const detail = orderCalculations?.flatMap(item => item.orderDetails);
    // console.log('orderCalculations : ', orderCalculations);
    // console.log('detail : ', detail);
    const sum = detail?.reduce((prev, current) => {
      const total = Math.round(
        (current.unitPrice * 1.1 +
          Math.round(current.productOptions[0]?.price ?? 0) * 1.1) *
          (current.quantity ?? 1),
      );
      // console.log(total + prev);
      return prev + total;
    }, 0);
    return sum;
  }, [orderCalculations]);

  const iframe =
    '<iframe id="ifmcontentstoprinttransaction" style="height: 0px; width: 0px; position: absolute"></iframe>';

  return (
    <Container>
      <div className="current-month-order-details-page">
        {width > 768 && (
          <>
            <PageHeader currentLink="/my-page#calculate" />
            <div className="content-current">
              <h2>당월 마감 내역</h2>
            </div>
          </>
        )}
        <div className="order-details">
          <div className="select-wrap">
            <div className="select-wrap-box">
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
                  setSearchParams({ ...filterParamsObj, month: option.value });
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
            <div className="button-right-current">
              <button onClick={onToggle}>거래명세서</button>
            </div>
          </div>
          {(isLoading || isFetching) && <LoadingBox />}
          {(!isLoading || !isFetching) && (
            <div className="table-current">
              <div className="table-mo-current">
                <table>
                  <thead>
                    <tr className="header">
                      <th className="col-1">
                        <span>No</span>
                      </th>
                      <th className="col-2">
                        <span>요청일</span>
                      </th>
                      <th className="col-3">
                        <span>품명</span>
                      </th>
                      <th className="col-4">
                        <span>수량</span>
                      </th>
                      <th className="col-5">
                        <span>단가(원)</span>
                      </th>
                      <th className="col-6">
                        <span>공급가액(원)</span>
                      </th>
                      <th className="col-7">
                        <span>VAT(원)</span>
                      </th>
                      <th className="col-8">
                        <span>비고</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderCalculations.length > 0 &&
                      orderCalculations.map((item, index) => {
                        const { createdAt, mileageContent } = item;
                        return item.orderDetails?.map((detail, dtIndex) => {
                          const unitPrice = Math.round(
                            detail.unitPrice +
                              (detail.productOptions[0]?.price ?? 0),
                          );
                          return (
                            <>
                              <tr key={generateUId()}>
                                <th className="col-1">
                                  <span>{dtIndex === 0 && index + 1}</span>
                                </th>
                                <th className="col-2">
                                  <span>
                                    {dtIndex === 0 &&
                                      formatShortDate(createdAt)}
                                  </span>
                                </th>
                                <th className="col-3">
                                  <span>
                                    {`${detail.product.name} (${
                                      detail.productOptions[0]?.label ?? ''
                                    })`}
                                  </span>
                                </th>
                                <th className="col-4">
                                  <span>{detail.quantity}</span>
                                </th>
                                <th className="col-5">
                                  <span>{formatNumber(unitPrice)}</span>
                                </th>
                                <th className="col-6">
                                  <span>
                                    {formatNumber(unitPrice * detail.quantity)}
                                  </span>
                                </th>
                                <th className="col-7">
                                  <span>
                                    {formatNumber(
                                      Math.round(
                                        unitPrice * detail.quantity * 0.1,
                                      ),
                                    )}
                                  </span>
                                </th>
                                <th className="col-8"> </th>
                              </tr>
                              {/* mileage */}
                              {item.mileagePointUsage > 0 &&
                                dtIndex === item.orderDetails.length - 1 && (
                                  <tr key={generateUId()}>
                                    <th className="col-1">
                                      <span />
                                    </th>
                                    <th className="col-2">
                                      <span />
                                    </th>
                                    <th
                                      className="col-3"
                                      style={{ color: 'red' }}
                                    >
                                      <span>마일리지 사용</span>
                                    </th>
                                    <th className="col-4">
                                      <span />
                                    </th>
                                    <th className="col-5">
                                      <span />
                                    </th>
                                    <th
                                      className="col-6"
                                      style={{ color: 'red' }}
                                    >
                                      <span>
                                        -{formatNumber(item.mileagePointUsage)}
                                      </span>
                                    </th>
                                    <th className="col-7">
                                      <span />
                                    </th>
                                    <th className="col-8"> </th>
                                  </tr>
                                )}
                            </>
                          );
                        });
                      })}
                  </tbody>
                </table>
              </div>
              <div className="total-current">
                <div className="vat-current">
                  <span>합계</span>
                  <p>(공급가액 총합 + VAT 총합)</p>
                </div>
                <div className="img-current">
                  <img
                    className="pc-only-current"
                    alt="sum"
                    src="/assets/app/sum-dark.svg"
                  />
                </div>
                <div className="total-number-current">
                  {formatNumber(sumPrice - sumMileage)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* MODAL  */}
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
          <TransactionStatement
            buyerBusiness={businessInfo}
            billing={orderCalculations}
            totalPrice={sumPrice}
            totalMileage={sumMileage}
          />
        </div>
      </ModalComponent>
      <div dangerouslySetInnerHTML={{ __html: iframe }} />
    </Container>
  );
}
