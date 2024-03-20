import React, { useState } from 'react';
import Dropdown from '../../../components/Input/Dropdown';
import { formatNumber, generateUId } from '../../../utils/helpers';
import ProductOptionsDropdown from '../../../components/Input/ProductOptionsDropdown';
import { useAuthContext } from '../../../contexts/AuthProvider';
import { businessType } from '../../../constants';

function ProductAction(props) {
  const {
    onChangeQuantity,
    quantityValue,
    product,
    selectedOption,
    onSelectedOption,
    totalAmount,
  } = props;
  const authCtx = useAuthContext();
  // console.log('AUTH : ', authCtx);
  const { state } = authCtx;
  const { businessInfo } = state;
  const { productColors, price, wholeSalePrice, productOptions } = product;
  const colors = Object.keys(productColors).map(key => {
    return {
      id: generateUId(),
      name: key,
      color: productColors[key],
    };
  });
  const basicPrice =
    businessInfo?.businessType === businessType.GENERAL ||
    businessInfo?.businessType === businessType.AS
      ? price + Math.round(price * 0.1)
      : wholeSalePrice + Math.round(wholeSalePrice * 0.1);
  return (
    <section className="product-action border-bottom">
      <div className="flex">
        <span className="f16Medium lg:f20Medium w-[120px] md:w-[140px]">
          색상
        </span>
        <div className="product-action-colors">
          {colors?.map(item => {
            const { id, name, color } = item;
            return (
              <div
                key={id}
                className="product-action-color-item flex items-center lg:gap-[7px] gap-[5.5px]"
              >
                <input
                  style={{
                    background: color.includes('#') ? `${color}` : `#${color}`,
                  }}
                  type="radio"
                  checked
                  onChange={() => {}}
                />
                <label
                  className="f16Regular lg:text-[20px]"
                  htmlFor="age1"
                  style={{ lineHeight: '145%' }}
                >
                  {name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-[0px]  mt-[30px] lg:mt-[44px] mb-[20px] dropdown-product-action items-center">
        <span className="f16Medium lg:f20Medium md:mt-[1px] md:w-[140px]  w-[120px]">
          제품선택
        </span>
        <ProductOptionsDropdown
          placeHolderText="옵션선택"
          options={productOptions.filter(item => {
            return item.usage;
          })}
          onOptionChange={option => {
            onSelectedOption(option);
          }}
          valueOfSelect={selectedOption}
        />
      </div>
      {selectedOption && (
        <div className="flex gap-[0] lg:mt-[30px]  mb-[30px] lg:mb-[34px] items-center">
          <span className="f16Medium lg:f20Medium mt-[6px]  md:w-[140px]  w-[120px]">
            {selectedOption.label}
          </span>
          <div className="quantity-row">
            <div className="quantity-wrap">
              <div className="quantity-content">
                <div
                  role="button"
                  tabIndex={0}
                  className="number-btn"
                  onClick={() => onChangeQuantity('DECREASE')}
                >
                  <div className="button_minus" />
                </div>
                <span className="quantity">{quantityValue}</span>
                <div
                  role="button"
                  tabIndex={0}
                  className="number-btn plus"
                  onClick={() => onChangeQuantity('INCREASE')}
                >
                  <div className="button_plus" />
                </div>
              </div>
            </div>
            <span className="f18Medium lg:f20Medium font-roboto mt-[5px] lg:mr-[1px] mr-[-1px] lg-mr[0.1rem] lg:mt-[7px]">
              {formatNumber(
                Math.round(selectedOption.price * 1.1) + basicPrice,
              )}
              <span>원</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

ProductAction.propTypes = {};

export default ProductAction;
