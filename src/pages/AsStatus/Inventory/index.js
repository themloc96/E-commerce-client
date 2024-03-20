import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Container from '../../../components/Container';
import Dropdown from '../../../components/Input/Dropdown';
import { useAuthContext } from '../../../contexts/AuthProvider';
import { useQueryParams, useWindowDimensions } from '../../../hooks';
import '../../../styles/as-status/inventory.scss';
import storeStyles from '../../../styles/store/store.module.scss';

// apis
import { getMaterialTotalFn } from '../../../apis/after-service';

function Inventory() {
  const { width } = useWindowDimensions();

  const navigate = useNavigate();
  const { hash } = useLocation();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser } = state;

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

  const { data: items = { list: [] } } = useQuery(
    ['getMaterialTotalFn', month, year],
    () =>
      getMaterialTotalFn({
        businessId: '',
        productCode: '',
        baseDate: '',
        year: year || yearOptionState,
        month: month || monthOptionState,
      }),
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

  const setQueryParams = ({ year1, month1 }) => {
    navigate({
      hash,
      search: `?year=${year1}&month=${month1}`,
    });
  };

  const getSum = att => {
    let sum = 0;
    items.list.forEach(item => {
      sum += item[att];
    });
    return sum;
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
        <Container className={`${storeStyles.container} wrapper-inventory`}>
          <div className={`${storeStyles['keyin-header']}`}>
            <span>재고조회</span>
          </div>
          <div className="content">
            <div className="filter-group">
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

            <div className="line" />
            <div className="wrapper-table">
              <table>
                <thead>
                  <tr className="header">
                    <th className="col-1">
                      <span> {width < 767 ? 'No' : '구분'}</span>
                    </th>
                    <th className="col-2">
                      <span>품목코드</span>
                    </th>
                    <th className="col-3">
                      <span>모델명</span>
                    </th>
                    <th className="col-4">
                      <span>품목명</span>
                    </th>
                    <th className="col-5">
                      <span>총합</span>
                    </th>
                    <th className="col-6">
                      <span>무상수거</span>
                    </th>
                    <th className="col-7">
                      <span>유상수거</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.list.map((item, index) => {
                    const {
                      freeCount,
                      paidCount,
                      productCode,
                      productModel,
                      productName,
                      totalCount,
                    } = item;
                    return (
                      <tr key={`${freeCount}-${paidCount}-${totalCount}`}>
                        <td className="col-1">
                          <span>{index + 1}</span>
                        </td>
                        <td className="col-2">
                          <span>{productCode}</span>
                        </td>
                        <td className="col-3">
                          <span>{productModel}</span>
                        </td>
                        <td className="col-4">
                          <span>{productName}</span>
                        </td>
                        <td className="col-5">
                          <span>{totalCount}</span>
                        </td>
                        <td className="col-6">
                          <span>{freeCount}</span>
                        </td>
                        <td className="col-7">
                          <span>{paidCount}</span>
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="footer">
                    <td className="total" colSpan={4}>
                      <span>합계</span>
                    </td>
                    <td className="col-5 number">
                      <span>{getSum('totalCount')}</span>
                    </td>
                    <td className="col-6 number">
                      <span>{getSum('freeCount')}</span>
                    </td>
                    <td className="col-7 number">
                      <span>{getSum('paidCount')}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Inventory;
