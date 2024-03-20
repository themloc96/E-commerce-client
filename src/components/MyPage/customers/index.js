import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// COMPS
import Button from '../../Button';
import CustomerListTable from './components/customer-list-table';
import Pagination from '../../Pagination';
// STYLES
import '../../../styles/my-page/customers.scss';
import { getClientBusinessFn } from '../../../apis/business.api';
import { useQueryParams } from '../../../hooks';
import LoadingBox from '../../Loading/LoadingBox';
import { useAuthContext } from '../../../contexts/AuthProvider';

function CustomersPage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { filterParamsObj } = useQueryParams();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;

  const onRedirectToCreateCustomer = () => {
    navigate('/customers/create-new');
  };

  const { isLoading, data } = useQuery(
    [`/v1/business/client/search`, filterParamsObj, businessInfo],
    () =>
      getClientBusinessFn({
        ...filterParamsObj,
        businessId: businessInfo?.id,
        RETURN_BUSINESS: false,
      }),
    {
      enabled: businessInfo !== null,
    },
  );

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  return (
    <>
      <div className="customers">
        <div className="customers-header">
          <h2>내 고객 현황</h2>
          <Button
            className="registration-btn"
            variant="outline-gray"
            onClick={onRedirectToCreateCustomer}
          >
            고객 등록
          </Button>
        </div>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <CustomerListTable listData={data?.data?.list} />
        )}
        {!isLoading && data?.data?.list?.length === 0 && (
          <div className="text-center text-[1.5rem] py-12">
            고객을 등록해주세요.
          </div>
        )}
      </div>
      <Pagination
        onPrevPage={() =>
          handleGoToPage(Number(data?.metaData?.currentPage) - 1)
        }
        onNextPage={() =>
          handleGoToPage(Number(data?.metaData?.currentPage) + 1)
        }
        totalPages={data?.metaData?.totalPages ? data?.metaData?.totalPages : 1}
        onChangePage={handleGoToPage}
        curPage={Number(data?.metaData?.currentPage) + 1}
        canPrevPage={data?.metaData?.currentPage > 0}
        canNextPage={
          data?.metaData?.currentPage < Number(data?.metaData?.totalPages) - 1
        }
      />
    </>
  );
}

export default CustomersPage;
