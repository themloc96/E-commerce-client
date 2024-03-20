import React from 'react';
import { formatCost, calculatePercentageOfPrice } from '../../../utils/helpers';

import { useAuthContext } from '../../../contexts/AuthProvider';
import { businessType } from '../../../constants';

function ProductInfo({ product }) {
  const { productBrand, name, price, wholeSalePrice, mileageAccumulationRate } =
    product;
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;
  const isCheckBusinessType =
    businessInfo?.businessType === businessType.GENERAL ||
    businessInfo?.businessType === businessType.AS;

  return (
    <section className="border-bottom product-info-inner">
      <span className="brand-name text-textSecondary1 f14Medium lg:f20Medium">
        {productBrand}
      </span>
      <h1 className="product-name f18Medium text-claimp mt-[20px] mb-[30px] lg:f30Medium lg:max-w-[503px]">
        {name}
      </h1>
      <div className="text-accentLeaf f18Medium mb-[11px] lg:mb-[19.5px] lg:f20Medium">
        <span className="mr-[3px] font-roboto lg:ml-[-1.5px]">
          {price
            ? formatCost(
                calculatePercentageOfPrice(
                  mileageAccumulationRate,
                  isCheckBusinessType
                    ? price + Math.round(product.price_vat)
                    : wholeSalePrice + Math.round(product.wholeSalePrice_vat),
                ),
              )
            : 0}
          원
        </span>
        <span>({mileageAccumulationRate}%) 적립</span>
      </div>
      <div>
        <span
          className="f30Medium font-roboto lg:f40Bold"
          style={{ letterSpacing: '0.2px' }}
        >
          {formatCost(
            businessInfo?.businessType === businessType.GENERAL ||
              businessInfo?.businessType === businessType.AS
              ? price + Math.round(product.price_vat)
              : wholeSalePrice + Math.round(product.wholeSalePrice_vat),
          )}
        </span>
        <span className="font-roboto f20Regular lg:ml-[3px] ml-[1px] mt-[1px] text-[20px] lg:text-[25px]">
          원
        </span>
      </div>
    </section>
  );
}

ProductInfo.propTypes = {};

export default ProductInfo;
