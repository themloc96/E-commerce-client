import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
// COMPs
import Container from '../../components/Container';
import SliderProductImage from './components/SliderProductImage';
import ProductInfo from './components/ProductInfo';
import AccessMethod from './components/AccessMethod';
import SafetySection from './components/SafetySection';
import ProductAction from './components/ProductAction';
import ConvenienceSection from './components/ConvenienceSection';
import ShoppingCartModal from './components/ShoppingCartModal';
import TotalAmount from './components/TotalAmount';
import NoData from '../../components/WTable/NoData';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import TabsSection from './components/TabsSection';
// STYLEs
import '../../styles/product/main.scss';
// HOOKs
import { useToggleModal } from '../../hooks';
import { useProduct, useQuantityValue } from './hooks';

import { formatNumber, isEmptyObject } from '../../utils/helpers';
import {
  getAccessMethodsByStrings,
  getSafetyListByStrings,
} from '../../utils/productUtils';
import ProductDescription from './components/ProductDescription';
import { useAuthContext } from '../../contexts/AuthProvider';
import { businessType } from '../../constants';
import { shippingCartCreateFn } from '../../apis/shipping.api';

export function ProductPage() {
  const { quantityValue, onChangeQuantity } = useQuantityValue();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState();
  const [MoveFlage, setMoveFlag] = useState(false);
  const { isOpen, onToggle, onClose } = useToggleModal();
  const { product, isLoading } = useProduct();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo, currentUser } = state;
  const {
    price,
    productSafetyFeatures,
    productConvenienceFunctions,
    productAccessMethods,
    description,
  } = product || {
    price: null,
    productSafetyFeatures: [],
    productConvenienceFunctions: [],
    productColors: [],
    productAccessMethods: [],
    description: '',
  };
  const totalAmount =
    businessInfo?.businessType === businessType.GENERAL ||
    businessInfo?.businessType === businessType.AS
      ? price + Math.round(price * 0.1)
      : (product?.wholeSalePrice || 0) +
        Math.round((product?.wholeSalePrice || 0) * 0.1);

  const { mutate: addShippingCart } = useMutation(
    productData => shippingCartCreateFn(productData),
    {
      onSuccess: () => {
        if (MoveFlage) navigate('/cart');
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const onChangMoveCart = () => {
    setMoveFlag(true);
  };

  // auto scroll to top when the component mounted
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }
  if (!isLoading && isEmptyObject(product)) return <NoData />;

  return (
    <div className="product-detail-wrapper lg:mt-[126px]">
      <div className="block w-full lg:mx-0 slider-wrap lg:hidden relative">
        <SliderProductImage product={product} />
      </div>
      <Container>
        <div className="flex flex-col xl:items-start lg:flex-row lg:justify-between">
          <div className="hidden w-full lg:mx-0 slider-wrap lg:block relative">
            <SliderProductImage product={product} />
          </div>
          <div className="product-info">
            <ProductInfo product={product} />
            <AccessMethod
              product={{
                ...product,
                accessMethods: getAccessMethodsByStrings(productAccessMethods),
              }}
            />
            <ProductAction
              onChangeQuantity={onChangeQuantity}
              quantityValue={quantityValue}
              product={product}
              selectedOption={selectedOption}
              onSelectedOption={setSelectedOption}
              totalAmount={totalAmount}
            />
            <TotalAmount
              onToggle={onToggle}
              selectedOption={selectedOption}
              onAddToCart={() =>
                addShippingCart({
                  productId: product?.id,
                  memberId: currentUser?.id,
                  shippingCartCount: quantityValue,
                  productOptionId: [selectedOption.id],
                })
              }
              totalAmount={totalAmount}
              optionPrice={selectedOption ? selectedOption.price : 0}
              quantityValue={quantityValue}
              moveFlag={() => onChangMoveCart()}
            />
          </div>
        </div>
        <TabsSection />
        <ProductDescription description={description} />
        <SafetySection
          safeties={getSafetyListByStrings(productSafetyFeatures)}
        />
        <ConvenienceSection
          productConvenienceFunctions={productConvenienceFunctions}
        />
      </Container>
      {/* MODAL  */}
      <ShoppingCartModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
