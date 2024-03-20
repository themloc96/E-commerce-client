import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Container from '../../components/Container';
import storeStyles from '../../styles/store/store.module.scss';
import '../../styles/as-status/main.scss';
import Pagination from '../../components/Pagination';
import { useQueryParams, useWindowDimensions } from '../../hooks';
import Dropdown from '../../components/Input/Dropdown';
import { useAuthContext } from '../../contexts/AuthProvider';
import { getListAsService, getStatusList } from '../../apis/asService.api';
import TableDataAsStatus from './components/TableDataAsStatus';
import LoadingBox from '../../components/Loading/LoadingBox';

const STALETIME_MS = 3000;

// const listStatusAsDisplayed = [
//   afterServiceStatus.AC,
//   afterServiceStatus.AF,
//   afterServiceStatus.AAD,
// ];

function Main() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { width } = useWindowDimensions();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser, businessInfo } = state;
  const [listAsService, setListAsService] = useState([]);
  const [monthChange, setMonthChange] = useState('');

  const { filterParamsObj, setSearchParams } = useQueryParams();
  const { year, month, asDispatchCategory } = filterParamsObj;
  const optionsAsDispatch = [
    { label: '구분', value: '' },
    { label: '일반', value: 'GENERAL' },
    { label: '긴급', value: 'URGENT' },
  ];

  let startMonth = 0;
  let endMonth = 0;
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;
  const yearOptions = [];
  const monthOptions = [];

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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!(year && month)) {
      setSearchParams({
        ...filterParamsObj,
        year: thisYear,
        month: thisMonth,
      });
    }
  }, []);

  useEffect(() => {
    if (monthChange) {
      setSearchParams({
        ...filterParamsObj,
        month: monthChange,
      });
    }
  }, [monthChange]);

  const { data, isFetching, isLoading } = useQuery(
    ['getListAsService', filterParamsObj],
    () =>
      getListAsService(
        { ...filterParamsObj },
        currentUser?.id,
        businessInfo?.id,
        currentUser?.memberType,
        currentUser?.previousMemberType,
      ),
    {
      enabled: currentUser !== null && businessInfo !== null,
      onError: error => {
        setListAsService([]);
      },
      onSuccess: _data => {
        setTimeout(() => {
          setListAsService(_data.data.list);
        }, 500);
        setMonthChange('');
      },
    },
  );

  const { data: listStatus } = useQuery(
    ['getStatusList', filterParamsObj],
    () => getStatusList({ ...filterParamsObj }, currentUser?.id),
    {
      enabled: currentUser !== null && filterParamsObj.year !== undefined,
      staleTime: STALETIME_MS,
      retry: 0,
    },
  );

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}&year=${year}&month=${month}`,
    });
  };

  return (
    <div>
      <Container className={`${storeStyles.container} wrapper`}>
        <div className={`${storeStyles['keyin-header']} title-as`}>
          <span>A/S현황</span>
        </div>
        <div className="as-action">
          <div className="number-applications">
            <div className="title">
              <span>접수 건수</span>
            </div>
            <div className="case">
              <span>{listStatus?.ASCount}</span>
              <span>건</span>
            </div>
          </div>
          <div className="action-results">
            <div className="title">
              <span>조치 결과 입력 필요</span>
            </div>
            <div className="case">
              <span>{listStatus?.ASStatusAADCount}</span>
              <span>건</span>
            </div>
          </div>
          <div className="completed-action">
            <div className="title">
              <span>A/S 조치 완료</span>
            </div>
            <div className="case">
              <span>{listStatus?.ASStatusAFCount}</span>
              <span>건</span>
            </div>
          </div>
        </div>
        {width < 992 && (
          <div className="filter">
            <div className="select-wrap">
              <div className="select-wrap-box">
                <Dropdown
                  placeHolderText={year}
                  options={yearOptions}
                  onOptionChange={option => {
                    setSearchParams({
                      ...filterParamsObj,
                      year: option.value,
                    });
                  }}
                  valueOfSelect={year}
                  defaultOptionIndex={yearOptions.findIndex(
                    item => item.label === Number(year),
                  )}
                  defaultChecked={year}
                />
                <Dropdown
                  placeHolderText={month}
                  options={monthOptions}
                  onOptionChange={option => {
                    setSearchParams({
                      ...filterParamsObj,
                      month: option.value,
                    });
                  }}
                  valueOfSelect={month}
                  defaultOptionIndex={monthOptions.findIndex(
                    item => item.label === month,
                  )}
                  setValueOfSelect={setMonthChange}
                  checkFlag
                  defaultChecked={month}
                />
                <Dropdown
                  placeHolderText="구분"
                  options={optionsAsDispatch}
                  onOptionChange={option => {
                    setSearchParams({
                      ...filterParamsObj,
                      asDispatchCategory: option.value,
                    });
                  }}
                  valueOfSelect={asDispatchCategory}
                  defaultOptionIndex={optionsAsDispatch.findIndex(
                    item => item.value === asDispatchCategory,
                  )}
                  defaultChecked={
                    asDispatchCategory || optionsAsDispatch[0].label
                  }
                />
              </div>
            </div>
          </div>
        )}
        <div className="as-status-container">
          {width > 992 && (
            <>
              <div className="filter">
                <div className="select-wrap">
                  <div className="select-wrap-box">
                    <Dropdown
                      placeHolderText={year}
                      options={yearOptions}
                      onOptionChange={option => {
                        setSearchParams({
                          ...filterParamsObj,
                          page: 0,
                          year: option.value,
                        });
                      }}
                      valueOfSelect={year}
                      defaultOptionIndex={yearOptions.findIndex(
                        item => item.label === Number(year),
                      )}
                      defaultChecked={year}
                    />
                    <Dropdown
                      placeHolderText={month}
                      options={monthOptions}
                      onOptionChange={option => {
                        setSearchParams({
                          ...filterParamsObj,
                          page: 0,
                          month: option.value,
                        });
                      }}
                      valueOfSelect={month}
                      defaultOptionIndex={monthOptions.findIndex(
                        item => item.label === month,
                      )}
                      setValueOfSelect={setMonthChange}
                      checkFlag
                      defaultChecked={month}
                    />
                    <Dropdown
                      placeHolderText="구분"
                      options={optionsAsDispatch}
                      onOptionChange={option => {
                        setSearchParams({
                          ...filterParamsObj,
                          page: 0,
                          asDispatchCategory: option.value,
                        });
                      }}
                      valueOfSelect={asDispatchCategory}
                      defaultOptionIndex={optionsAsDispatch.findIndex(
                        item => item.value === asDispatchCategory,
                      )}
                      defaultChecked={
                        asDispatchCategory || optionsAsDispatch[0].label
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="line" />
            </>
          )}
          {isLoading || isFetching ? (
            <LoadingBox />
          ) : (
            <TableDataAsStatus
              data={data?.data?.list}
              currentPage={data?.metaData?.currentPage}
            />
          )}
        </div>
        {!!listAsService.length && (
          <Pagination
            onPrevPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) - 1)
            }
            onNextPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) + 1)
            }
            totalPages={
              data?.metaData?.totalPages ? data?.metaData?.totalPages : 1
            }
            onChangePage={handleGoToPage}
            curPage={Number(data?.metaData?.currentPage) + 1}
            canPrevPage={data?.metaData?.currentPage > 0}
            canNextPage={
              data?.metaData?.currentPage <
              Number(data?.metaData?.totalPages) - 1
            }
          />
        )}
      </Container>
    </div>
  );
}

export default Main;
