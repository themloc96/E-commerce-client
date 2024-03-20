import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
// components
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Pagination from '../../../components/Pagination';
import NoData from '../../../components/WTable/NoData';
import EmployeeTableList from './components/EmployeeTableList';
// styles
import '../../../styles/my-page/employee-management.scss';
// service
import {
  approvalMemberFn,
  getAllMemebersByBusinessIdFn,
  rejectMemberFn,
} from '../../../apis/members.api';
// context
import { useAuthContext } from '../../../contexts/AuthProvider';
// hook
import PageHeader from '../../../components/MyPage/page-header';
import { useQueryParams, useWindowDimensions } from '../../../hooks';

function index() {
  const { width } = useWindowDimensions();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const [employeeList, setEmployeeList] = useState([]);
  const [brakeFlag, setBrakeFlag] = useState(false);
  const { filterParamsObj } = useQueryParams();
  const { state } = authCtx;
  const { businessInfo } = state;
  const businessId = businessInfo?.id;

  // query: Members Data
  const { isFetching, isLoading, data, refetch } = useQuery(
    [`v1/business/${businessId}/members/all`, filterParamsObj],
    () => {
      return getAllMemebersByBusinessIdFn({
        ...filterParamsObj,
        id: businessId,
      });
    },
    {
      enabled: Boolean(businessId),
      // eslint-disable-next-line no-shadow
      onSuccess: data => {
        setEmployeeList(
          data?.data?.list.length > 0
            ? data.data.list.map(item => ({ ...item, checked: false }))
            : [],
        );
      },
    },
  );
  const handleChangeCheckedAll = e => {
    const isChecked = e?.target.checked;
    setEmployeeList(() => {
      return employeeList?.map(item => ({ ...item, checked: isChecked }));
    });
  };

  const handleChangeEmployeeChecked = (e, id) => {
    const isChecked = e?.target?.checked;
    setEmployeeList(() => {
      return employeeList?.map(item => {
        if (item.id === id) {
          return {
            ...item,
            checked: isChecked,
          };
        }
        return item;
      });
    });
  };
  // ACTION : Approval member
  const approvalMemberMutaion = useMutation({
    mutationFn: body => approvalMemberFn(body),
    onSuccess: () => {
      refetch();
    },
    onError: error => {
      if (brakeFlag === false) {
        setBrakeFlag(true);
        switch (error.response.data.message) {
          case 'You are not allowed to approve member':
            return alert('직원 거부 및 승인은 대표자 계정만 가능합니다.');
          default:
            return console.log('Something went wrong!');
        }
      } else {
        return console.log('Something went wrong!');
      }
    },
  });

  const handleApprovalMember = () => {
    const employeeApprovingList = employeeList
      ?.filter(item => item?.checked)
      ?.map(item => {
        return {
          memberId: item?.id,
          businessId: businessInfo?.id,
          business_NO: item?.businessRegistrationNumber,
          cust_NAME: businessInfo?.businessName,
          boss_NAME: item?.businessRegistrationName,
          addr: item?.businessAddress || item?.detailedAddress,
        };
      });
    setBrakeFlag(false);
    approvalMemberMutaion.mutate(employeeApprovingList);
  };
  // ACTION : Reject member
  const rejectMemberMutaion = useMutation({
    mutationFn: memberId => rejectMemberFn({ businessId, memberId }),
    onSuccess: () => {
      refetch();
    },
    onError: error => {
      if (brakeFlag === false) {
        switch (error.response.data.message) {
          case 'You are not allowed to reject member':
            setBrakeFlag(true);
            return alert('직원 거부 및 승인은 대표자 계정만 가능합니다.');
          default:
            return console.log('Something went wrong!');
        }
      } else {
        return console.log('Something went wrong!');
      }
    },
  });

  const handleRejectMember = () => {
    // eslint-disable-next-line func-names
    setBrakeFlag(false);
    employeeList.forEach((item) => {
      if (item.checked) {
        rejectMemberMutaion.mutate(item.id);
      }
    });
  };

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  return (
    <div className="employee">
      <Container className="employee-container">
        {width > 768 && (
          <>
            <PageHeader currentLink="/my-page#account" />
            <h2 className="f32Medium mb-[20px] mt-[45px] ml-[60px]">
              직원관리
            </h2>
          </>
        )}
        {isLoading && (
          <div className="text-center">
            <ClipLoader color="#fc5000" />
            <p>Loading ...</p>
          </div>
        )}
        {employeeList.length > 0 && (
          <>
            <div
              className={`employee-content ${
                isFetching ||
                rejectMemberMutaion.isLoading ||
                approvalMemberMutaion.isLoading
                  ? 'section-loading'
                  : ''
              }`}
            >
              <EmployeeTableList
                employeeList={employeeList}
                onChangeEmployeeChecked={handleChangeEmployeeChecked}
                onChangeCheckedAll={handleChangeCheckedAll}
                isFetching={isFetching}
              />
              <div className="employee-btn-group">
                <div className="flex-1 md:flex-initial">
                  <Button onClick={handleRejectMember} variant="outline-gray">
                    거부
                  </Button>
                </div>
                <div className="flex-1 md:flex-initial">
                  <Button onClick={handleApprovalMember} variant="ghost">
                    승인
                  </Button>
                </div>
              </div>
            </div>
            <Pagination
              onPrevPage={() =>
                handleGoToPage(Number(data?.metaData?.currentPage) - 1)
              }
              onNextPage={() =>
                handleGoToPage(Number(data?.metaData?.currentPage) + 1)
              }
              curPage={Number(data?.metaData?.currentPage) + 1}
              canPrevPage={data?.metaData?.currentPage > 0}
              totalPages={data?.metaData?.totalPages}
              onChangePage={handleGoToPage}
              canNextPage={
                data?.metaData?.currentPage <
                Number(data?.metaData?.totalPages) - 1
              }
            />
          </>
        )}
        {!(isLoading || isFetching) && employeeList.length <= 0 && <NoData />}
      </Container>
    </div>
  );
}

export default index;
