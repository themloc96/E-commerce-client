/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndCheckbox } from '../../../components/WTable/IndCheckbox';
import {
  formatCost,
  formatNumber,
  generateNameId,
  isEmptyObject,
  productOptionsText,
} from '../../../utils/helpers';
import ArrowLeftIcon from '../../../components/Svg/ArrowLeftIcon';
import Img from '../../../components/Img';
import { businessType } from '../../../constants';
import { useAuthContext } from '../../../contexts/AuthProvider';

function ProductList(props) {
  const { products, onChangChecked, onChangeQuantity } = props;
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;
  const navigate = useNavigate();
  if (products?.length === 0 || !products) return null;
  const onRedirectToProductDetail = name => {
    navigate(`/product/${name}`);
  };
  return (
    <div className="cart-products">
      {products.map((item, index) => {
        const {
          id,
          name,
          quantity,
          price,
          checked,
          wholeSalePrice,
          productThumbnail,
          productOptions,
          shippingCartId,
        } = item || {
          checked: false,
        };
        const selectedOption = productOptions[0]
          ? productOptions[0]
          : { price: 0 };
        const realPrice =
          businessInfo?.businessType === businessType.GENERAL ||
          businessInfo?.businessType === businessType.AS
            ? Number(
                price +
                  Math.round(item.price_vat) +
                  Math.round(selectedOption.price * 1.1),
              )
            : Number(
                wholeSalePrice +
                  Math.round(item.wholeSalePrice_vat) +
                  Math.round(selectedOption.price * 1.1),
              );

        return (
          <div key={id} className="cart-product">
            <div className="cart-product-top">
              <div className="lg:self-center w-[22px] h-[22px] cart-product-top-checkbox">
                <IndCheckbox
                  onChange={e => onChangChecked(index)}
                  checked={checked}
                />
              </div>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                className="cursor-pointer cart-product-img"
                onClick={() =>
                  onRedirectToProductDetail(generateNameId({ name, id }))
                }
              >
                <Img
                  className="w-full h-full"
                  src={productThumbnail}
                  alt="product-2"
                />
              </div>
              <div className="cart-product-info">
                <p className="cart-product-name">{name}</p>
                {!isEmptyObject(selectedOption) && (
                  <p className="cart-product-selected">
                    {productOptionsText(
                      selectedOption.label,
                      selectedOption.value,
                    )}
                  </p>
                )}

                <button
                  className="go-to-prod-detail-btn"
                  onClick={() =>
                    onRedirectToProductDetail(generateNameId({ name, id }))
                  }
                >
                  <span>상품페이지 바로가기</span>
                  <ArrowLeftIcon />
                </button>
                <span className="cart-amount cart-product-amount">
                  {/* {formatNumber(price)}원 */}
                  {formatCost(realPrice)}원
                </span>
              </div>
            </div>
            <div className="cart-product-bottom">
              <div className="w-[22px] cart-product-bottom-first-div">
                &nbsp;
              </div>
              <div className="cart-quantity-wrap">
                <div className="hidden lg:block lg:mt-[42px] text-center">
                  <span className="f18Regular">수량</span>
                </div>
                <div className="cart-quantity-content">
                  <div
                    role="button"
                    tabIndex={0}
                    className="number-btn"
                    onClick={() =>
                      onChangeQuantity(shippingCartId, quantity - 1)
                    }
                  >
                    <div className="button_minus" />
                  </div>
                  <span className="quantity">{quantity}</span>
                  <div
                    role="button"
                    tabIndex={0}
                    className="number-btn plus"
                    onClick={() =>
                      onChangeQuantity(shippingCartId, quantity + 1)
                    }
                  >
                    <div className="button_plus" />
                  </div>
                </div>
              </div>
              <span className="cart-amount cart-product-bottom-amount amount-of-product">
                {formatNumber(realPrice * quantity)}원
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
