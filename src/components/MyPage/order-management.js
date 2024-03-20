import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllOrdersFn, getOrdersByBusinessIdFn } from '../../apis/order.api';
import { roleMember, ordStatus, businessType } from '../../constants';
import { useAuthContext } from '../../contexts/AuthProvider';
import { useQueryParams } from '../../hooks';
import {
  formatCost,
  formateDate,
  productOptionsText,
  setOnErrorImage,
} from '../../utils/helpers';
import LoadingBox from '../Loading/LoadingBox';
import Pagination from '../Pagination';

export default function OrderManagement() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { state } = useAuthContext();
  const { currentUser, businessInfo } = state;
  const { filterParamsObj } = useQueryParams();

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  const { isLoading, data, isFetching } =
    currentUser?.role === roleMember.ROLE_ADMIN
      ? useQuery(
          ['v1/order/all', filterParamsObj],
          () => {
            return getAllOrdersFn({
              ...filterParamsObj,
            });
          },
          {
            keepPreviousData: true,
            enabled: currentUser !== null,
            onError: error => {
              console.log('getAllOrdersFn failed');
              console.log(error);
            },
          },
        )
      : useQuery(
          ['getOrdersByBusinessId', filterParamsObj, businessInfo?.id],
          () =>
            getOrdersByBusinessIdFn({
              ...filterParamsObj,
              businessId: businessInfo?.id || null,
            }),
          {
            enabled: currentUser !== null,
            onError: error => {
              console.log('getOrdersByBusinessIdFn failed');
              console.log(error);
            },
          },
        );

  return (
    <>
      <div
        className={`my-page-content-container order-product-container !max-w-[unset] ${
          isFetching ? 'section-loading' : ''
        }`}
      >
        {isLoading ? (
          <LoadingBox />
        ) : (
          data?.data?.list.map((dt, index) => {
            const { id, createdAt, orderDetails, orderStatus, orderCode } = dt;
            const statusname = Object.keys(ordStatus).includes(orderStatus)
              ? ordStatus[orderStatus]
              : '정보없음';

            return (
              <div
                key={`${id}-${createdAt}`}
                className={index > 0 ? 'mt-[69px] max-[766px]:mt-[31px]' : ''}
              >
                <div className="order-date-container">
                  <div className="date">
                    <p
                      style={
                        window.innerWidth <= 766 ? { paddingBottom: '5px' } : {}
                      }
                    >
                      주문일자 <span className="span-1">|</span>
                      <span className="span-2" style={{ marginRight: 30 }}>
                        {createdAt.split(' ')[0].replace(/-/g, '.')}
                      </span>
                    </p>
                    <p>
                      주문번호 <span className="span-1">|</span>
                      <span className="span-2">{orderCode || ''}</span>
                    </p>
                  </div>
                  <Link to={`order-detail/${id}`}>
                    <button>
                      <span>주문 상세보기</span>
                      <img alt="right" src="/assets/arrow/right-dark.png" />
                    </button>
                  </Link>
                </div>
                {orderDetails?.length > 0
                  ? orderDetails.map((de, deIndex) => {
                      const thumbnail = de.product.productThumbnail
                        ? de.product.productThumbnail
                        : '/assets/products/no-image.png';
                      return (
                        <div
                          className="product-container"
                          key={`${de?.createdAt}-${de?.product?.id}`}
                        >
                          <div className="product-info-left">
                            <img
                              id={`product-${de?.product?.id}`}
                              src={thumbnail}
                              alt={de?.product?.name}
                              onError={() =>
                                setOnErrorImage(`product-${de?.product?.id}`)
                              }
                            />
                            <div className="product-infomation">
                              <p className="line-1">
                                <span>
                                  {/* [{de?.product?.modelName}] {de?.product?.name}{' '} */}
                                  {de?.product?.name}{' '}
                                </span>
                              </p>
                              <p className="product-choosing">
                                {de?.productOptions.length > 0
                                  ? productOptionsText(
                                      de?.productOptions[0].label,
                                      de?.productOptions[0].price,
                                    )
                                  : ''}
                              </p>
                              <p className="price">
                                <span className="number">
                                  {formatCost(
                                    Math.round(
                                      (de?.unitPrice ?? 0) * 1.1 +
                                        (de?.productOptions[0].price ?? 0) +
                                        (de?.productOptions[0].price_vat ?? 0),
                                    ),
                                  )}
                                </span>
                                원 / 수량 {de?.quantity}
                                {de?.productUnitName}
                              </p>
                            </div>
                          </div>
                          <div className="delivery">
                            <p>{statusname}</p>
                            {orderStatus === 'DP' ? (
                              <Link to={`orders/${id}/delivery-tracking`}>
                                <button>배송조회</button>
                              </Link>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      );
                    })
                  : ''}
              </div>
            );
          })
        )}
        {!isLoading && data?.data?.list?.length === 0 && (
          <div className="text-center text-[1.5rem] py-12">
            주문 목록이 없습니다.
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
        totalPages={data?.metaData?.totalPages}
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
