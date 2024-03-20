import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { saveProductToCartLS } from '../../utils/shoppingCart';
import { getIdFromNameId } from '../../utils/helpers';
import { getProductByIdFn } from '../../apis/product.api';
import { useShoppingCartContext } from '../../contexts/ShoppingCartProvider';

export const useQuantityValue = () => {
  const [quantityValue, setQuantityValue] = useState(1);
  const handleChangeQuantity = type => {
    if (type === 'INCREASE') {
      setQuantityValue(prev => prev + 1);
    }
    if (type === 'DECREASE') {
      if (quantityValue > 1) {
        setQuantityValue(prev => prev - 1);
      }
    }
  };
  return { quantityValue, onChangeQuantity: handleChangeQuantity };
};

export const useProduct = () => {
  const shoppingCartCtx = useShoppingCartContext();
  const { slug } = useParams();
  // Slug is the nameId current
  const productId = getIdFromNameId(slug);
  // query: product detail data
  const { data: product, isLoading } = useQuery({
    queryKey: [`v1/product/${productId}`, productId],
    queryFn: () => {
      return getProductByIdFn(productId || '');
    },
  });
  const { price, id, name, productThumbnail, wholeSalePrice } = product || {
    price: 0,
    id: null,
    name: '',
    productThumbnail: '',
    wholeSalePrice: 0,
  };

  const handleAddToCart = ({ quantityValue, selectedOption }) => {
    const totalAmount = (price + selectedOption.price) * quantityValue;
    // price + quantityValueOption * (selectedOption?.price || 1);
    const productToCart = {
      ...product,
      description: '',
    };
    const newProductList = saveProductToCartLS({
      product: productToCart,
      quantity: quantityValue,
      totalAmount,
      selectedOption,
    });
    shoppingCartCtx.setProducts(newProductList);
  };
  return { product, handleAddToCart, isLoading };
};
