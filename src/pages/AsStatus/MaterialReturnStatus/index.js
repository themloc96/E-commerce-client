import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// components
import Container from '../../../components/Container';
import TotalAmountOfTable from '../../../components/WTable/TotalAmountOfTable';
import Dropdown from '../../../components/Input/Dropdown';

// hooks
import { useQueryParams, useWindowDimensions } from '../../../hooks';

// contexts
import { useAuthContext } from '../../../contexts/AuthProvider';

// styles
import '../../../styles/as-status/material-return-status.scss';
import storeStyles from '../../../styles/store/store.module.scss';

// apis
import { getMaterialSearchFn } from '../../../apis/after-service';

// utils
import { formatShortDate } from '../../../utils/helper.dateTime';

// constants
import {
  asFeeTypeObj,
  returnStatusObj,
} from '../../../constants/enum/material';

function MaterialReturnStatus() {
  const { width } = useWindowDimensions();

  const navigate = useNavigate();
  const { hash } = useLocation();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser, businessInfo } = state;

  const { filterParamsObj, setSearchParams } = useQueryParams();
  const { year, month } = filterParamsObj;

  let startMonth = 0;
  let endMonth = 0;
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const firstMonth = thisMonth.toString().padStart(2, '0');

  const [yearOptionState, setYearOptionState] = useState(thisYear);
  const [monthOptionState, setMonthOptionState] = useState(firstMonth);
  const yearOptions = [];
  const monthOptions = [];

  const { data: items = { data: { list: [] } } } = useQuery(
    ['getMaterialSearchFn', year, month],
    () =>
      getMaterialSearchFn({
        SIZE: 999999,
        MONTH: month || thisMonth,
        YEAR: year || thisYear,
        AS_STATUS: 'AAC',
        BUSINESS_ID: businessInfo.id,
      }),
    {
      enabled: businessInfo?.id !== null,
    },
  );

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

  const sumCount = useMemo(() => {
    let sum = 0;
    if (items?.data?.list.length > 0) {
      sum = items?.data?.list.reduce((prev, current) => {
        return prev + Number(current.asAnticipationMaterialCount);
      }, 0);
    }
    return sum;
  }, [items]);

  const setQueryParams = ({ year1, month1 }) => {
    navigate({
      hash,
      search: `?year=${year1}&month=${month1}`,
    });
  };

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}
          `}
      </style>
    );
  }

  return (
    <>
      <Style />
      <div>
        <Container
          className={`${storeStyles.container} wrapper-material-return-status`}
        >
          <div className={`${storeStyles['keyin-header']}`}>
            <span className="!text-textSecondary4">자재 반납 현황</span>
          </div>
          <div className="content">
            <div className="filter-group">
              <div className="wrapper-filter">
                <Dropdown
                  placeHolderText={year || thisYear}
                  options={yearOptions}
                  onOptionChange={option => {
                    setYearOptionState(option.value);
                    setQueryParams({
                      year1: option.value,
                      month1: monthOptionState,
                    });
                  }}
                  valueOfSelect={year || yearOptionState}
                  defaultOptionIndex={yearOptions.length - 1}
                />
                <Dropdown
                  placeHolderText={month || thisMonth}
                  options={monthOptions}
                  onOptionChange={option => {
                    setMonthOptionState(option.value);
                    setQueryParams({
                      month1: option.value,
                      year1: yearOptionState,
                    });
                  }}
                  valueOfSelect={month || monthOptionState}
                  defaultOptionIndex={monthOptions.length - 1}
                  setValueOfSelect={setMonthOptionState}
                  checkFlag
                />
              </div>
              {width > 767 && (
                <div className="btn">
                  <Link to="/as/material-return-status-case-1">
                    <button>
                      <span>반납 요청</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
            <div className="line" />
            <div className="wrapper-table">
              <table>
                <thead>
                  <tr className="header">
                    <th className="col-1">
                      <span> {width < 767 ? '구분' : 'No'}</span>
                    </th>
                    <th className="col-2">
                      <span>요청일</span>
                    </th>
                    <th className="col-3">
                      <span>품번</span>
                    </th>
                    <th className="col-4">
                      <span>품명</span>
                    </th>
                    <th className="col-5">
                      <span>수량</span>
                    </th>
                    <th className="col-6">
                      <span>내용</span>
                    </th>
                    <th className="col-7">
                      <span>상태</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.data.list.map((item, index) => {
                    const {
                      createdAt,
                      asMaterialCode,
                      asMaterialsName,
                      asAnticipationMaterialCount,
                      asFeeType,
                      returnStatus,
                      as_id: asId,
                      id,
                    } = item;
                    return (
                      <tr key={`${id}-${asId}`}>
                        <td className="col-1">
                          <span>{index + 1}</span>
                        </td>
                        <td className="col-2">
                          <span>
                            {formatShortDate(createdAt, 'yyyy.MM.DD')}
                          </span>
                        </td>
                        <td className="col-3">
                          <span> {asMaterialCode}</span>
                        </td>
                        <td className="col-4">
                          <span>{asMaterialsName}</span>
                        </td>
                        <td className="col-5">
                          <span>{asAnticipationMaterialCount}</span>
                        </td>
                        <td className="col-6">
                          <span>{asFeeTypeObj[asFeeType]}</span>
                        </td>
                        <td className="col-7">
                          <span
                            className={
                              returnStatus === 'RETURN_COMPLETED'
                                ? 'status-complete'
                                : 'status-default'
                            }
                          >
                            {returnStatusObj[returnStatus]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TotalAmountOfTable
              elementText={
                <div className="flex items-end md:mt-[-2px] txt-total">
                  <span className="f16Medium md:mr-[4px] md:f24Medium">
                    합계
                  </span>
                  <span className="text-[10px] mb-[5px] md:text-base">
                    (수량)
                  </span>
                </div>
              }
              totalAmountValue={sumCount}
              isCheckDataEmpty={items?.data?.list.length || 0}
            />
            {width < 767 && (
              <div className="btn">
                <Link to="/as/material-return-status-case-1">
                  <button>
                    <span>반납 요청</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default MaterialReturnStatus;
