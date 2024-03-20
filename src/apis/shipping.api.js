import { clientRequest } from '../utils/Request';

export const createShippingFn = async body => {
  const response = await clientRequest.post('v1/shipping/add', body);
  return response;
};

export const shippingCartCreateFn = async body => {
  const response = await clientRequest.post('v1/shipping-cart/created', body);
  return response;
};

export const shippingCartListFn = async memberId => {
  if (memberId === undefined) return null;
  const response = await clientRequest.get(`v1/shipping-cart/list/${memberId}`);
  return response;
};

export const shippingCartDeleteFn = async body => {
  const response = await clientRequest.post('v1/shipping-cart/deleted', body);
  return response;
};

export const shippingCartCountUpdateFn = async (id, productCount) => {
  const paramQuery = {
    count: productCount,
  };
  const response = await clientRequest.get(`v1/shipping-cart/count/${id}`, {
    params: paramQuery,
  });
  return response;
};
