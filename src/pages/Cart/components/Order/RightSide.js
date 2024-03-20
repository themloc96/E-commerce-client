import React, { useEffect } from 'react';
import ArrowRightIcon from '../../../../components/Svg/ArrowRightIcon';
import {
  formatCost,
  calculatePercentageOfPrice,
  productOptionsText,
  formatNumber,
} from '../../../../utils/helpers';
import { businessType } from '../../../../constants';

function RightSide(props) {
  const {
    order,
    listProduct,
    isDisabled,
    isMobile,
    onOpenInformation,
    isOpenInformation,
    onBuyMethod,
    typeBusiness,
  } = props;
  const isCheckBusinessType =
    typeBusiness === businessType.GENERAL || typeBusiness === businessType.AS;
  const totalAmountToPay = order.payment.totalPrice
    ? order.payment.totalPrice - order.payment.mileagePointUsage
    : 0;

  const renderProduct = () => {
    return (
      <>
        {listProduct.map(item => {
          const {
            id,
            name,
            price,
            wholeSalePrice,
            mileageAccumulationRate,
            productThumbnail,
            productOptions,
            quantity,
          } = item || {
            checked: false,
          };
          const selectedOption = productOptions[0];
          return (
            <div key={id} className="cart-product">
              <div className="cart-product-top">
                <div className="cursor-pointer product-img">
                  <img
                    className="w-full h-full"
                    src={productThumbnail}
                    alt={`product-${name}`}
                  />
                </div>
                <div className="cart-product-info">
                  <p className="cart-product-name">{name}</p>
                  <p className="cart-product-selected">
                    {item?.selectedOption
                      ? productOptionsText(
                          item?.selectedOption?.label,
                          item?.selectedOption?.value,
                        )
                      : ''}
                  </p>
                  <button className="go-to-prod-detail-btn">
                    <span className="product-info">상품페이지 바로가기</span>
                    <ArrowRightIcon />
                  </button>
                  <span className="cart-amount cart-product-amount">
                    {price
                      ? formatNumber(
                          typeBusiness === businessType.GENERAL
                            ? (price +
                                Math.round(price * 0.1) +
                                selectedOption.price +
                                Math.round(selectedOption.price * 0.1)) *
                                quantity
                            : (wholeSalePrice +
                                Math.round(wholeSalePrice * 0.1) +
                                selectedOption.price +
                                Math.round(selectedOption.price * 0.1)) *
                                quantity,
                        )
                      : 0}
                    원
                  </span>
                  <span className="cart-amount cart-product-amount milege">
                    <span className="number-percent">
                      {mileageAccumulationRate}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>%</span> 마일리지 적립{' '}
                    <span className="cart-money">
                      {price
                        ? formatCost(
                            calculatePercentageOfPrice(
                              mileageAccumulationRate,
                              isCheckBusinessType
                                ? price + Math.round(item.price_vat * 1.1)
                                : // * quantity
                                  wholeSalePrice +
                                    Math.round(item.wholeSalePrice_vat),
                              // * quantity,
                            ),
                          )
                        : 0}
                      원
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="right-side">
      <button
        className="collapse-btn"
        onClick={isMobile === 'PC' ? () => {} : onOpenInformation}
      >
        <div className="cart-content-header">
          <h3 className="lg:text-[32px] font-medium">
            주문상품 정보{' '}
            <span className="ml-[-2px] md:ml-0">
              / 총 {listProduct?.length || 0}개
            </span>
          </h3>
          {isMobile !== 'PC' && (
            <img
              className={`${isOpenInformation ? '' : 'icon-below'}`}
              src="/assets/icons/btn_arrow_18px@2x.png"
              alt=""
            />
          )}
        </div>
      </button>
      {isOpenInformation && (
        <div className="cart-product-wrap">{renderProduct()}</div>
      )}

      <div className="total-amount-wrap hidden lg:block">
        <div className="amount">
          <p className="title">총 상품 금액</p>
          <p className="price">
            {
              // formatCost(order?.payment?.totalPrice)
              Math.round(order?.payment?.totalPrice).toLocaleString()
            }
            원
          </p>
        </div>
        <div className="amount">
          <p className="title md:!mt-[-5px]">마일리지 사용</p>
          <p className="price">
            {Number(order?.payment?.mileagePointUsage) >
            Number(order?.payment?.totalPrice)
              ? 0
              : formatCost(order?.payment?.mileagePointUsage)}
            원
          </p>
        </div>
        <div className="amount">
          <p className="title">총 결제 예정금액</p>
          <p className="price">
            {
              // formatCost(order?.payment?.totalPrice)
              Math.round(totalAmountToPay).toLocaleString()
            }
            원
          </p>
        </div>
        <div
          className={`cart-order-submit ${
            !isDisabled ? ' cart-order-submit-enable' : ''
          }`}
        >
          <button onClick={onBuyMethod} disabled={isDisabled}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSide;
