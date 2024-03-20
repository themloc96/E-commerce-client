import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import LoadingBox from '../Loading/LoadingBox';
import storeStyles from '../../styles/store/store.module.scss';
import Img from '../Img';
import {
  calculatePercentageOfPrice,
  formatCost,
  generateNameId,
} from '../../utils/helpers';

// contexts
import { useAuthContext } from '../../contexts/AuthProvider';

// constant
import { LENGTH_OPTIONS, businessType } from '../../constants';

function Products({
  fetchNextPage,
  hasNextPage,
  dataLength,
  data,
  isFetchingData,
  listOption,
}) {
  const navigate = useNavigate();
  const onRedirectToProductDetail = name => navigate(`/product/${name}`);
  const authCtx = useAuthContext();

  const { state } = authCtx;
  const { businessInfo } = state;
  const isCheckBusinessType =
    businessInfo?.businessType === businessType.GENERAL ||
    businessInfo?.businessType === businessType.AS;
  const isCheckAll = (listOption?.length ?? 0) === LENGTH_OPTIONS;

  if (isFetchingData) {
    return (
      <div className="flex justify-center w-full items-center">
        <LoadingBox />
      </div>
    );
  }

  if (dataLength === 0 || dataLength === '0') {
    return (
      <div
        className="flex justify-center w-full items-center"
        style={
          window.innerWidth > 420
            ? { fontSize: '24px', textAlign: 'center', paddingTop: '100px' }
            : { fontSize: '18px', textAlign: 'center', paddingTop: '100px' }
        }
      >
        해당 검색 조건에 맞는 상품이 없습니다.
      </div>
    );
  }

  return (
    <InfiniteScroll
      next={fetchNextPage}
      hasMore={hasNextPage ?? true}
      loader={
        <div className="flex justify-center w-full items-center">
          <LoadingBox />
        </div>
      }
      style={{ overflow: 'inherit' }}
      dataLength={dataLength}
    >
      {data?.pages
        .map(page => {
          return page?.data?.list;
        })
        .reduce((a, b) => {
          return [...a, ...b];
        }, [])
        .map(item => {
          const product = item;
          const {
            name,
            id,
            productThumbnail,
            price,
            wholeSalePrice,
            mileageAccumulationRate,
            public: isPublic,
            usage: isUsage,
          } = product;
          let isNotShowPrd = !isPublic;

          if (isCheckAll) {
            isNotShowPrd = false;
          }

          if (isNotShowPrd) {
            return null;
          }

          return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={id}
              className={storeStyles.card}
              onClick={() => {
                onRedirectToProductDetail(generateNameId({ name, id }));
              }}
            >
              <Img src={productThumbnail} alt={name} />
              <div className={storeStyles['products-info']}>
                <div className={storeStyles.info}>
                  <span>{name}</span>
                </div>
                <span className={storeStyles.number}>
                  {formatCost(
                    isCheckBusinessType
                      ? price + Math.round(price * 0.1)
                      : wholeSalePrice + Math.round(wholeSalePrice * 0.1),
                  )}
                  <span>원</span>
                </span>
                <hr />
                <span className={storeStyles['products-desc']}>
                  <span className={storeStyles.number}>
                    {mileageAccumulationRate}
                  </span>
                  <span className={storeStyles.percent}>%</span>
                  {window.innerWidth <= 400 ? ' 적립' : '마일리지 적립'}
                  <span className={storeStyles.cost}>
                    {price
                      ? formatCost(
                          calculatePercentageOfPrice(
                            mileageAccumulationRate,
                            isCheckBusinessType
                              ? price + Math.round(product.price_vat)
                              : wholeSalePrice +
                                  Math.round(product.wholeSalePrice_vat),
                          ),
                        )
                      : 0}
                  </span>
                  원
                </span>
              </div>
            </div>
          );
        })}
    </InfiniteScroll>
  );
}

export default Products;
