import { orderPerPageDefault } from '../components/Pagination/configPagination';
import { clientRequest } from '../utils/Request';

export const getAllOrdersFn = async ({ page }) => {
  const paramQuery = {
    SORT_DESC: 'true',
    SIZE: orderPerPageDefault,
    PAGE: page,
  };
  const response = await clientRequest.get('v1/order/all', {
    params: paramQuery,
  });
  return response;
};

export const getOrderByIdFn = async id => {
  if (!id) return null;
  const response = await clientRequest.get(`v1/order/${id}`);
  return response;
};

export const getOrdersByBusinessIdFn = async ({page, businessId, size=null}) => {
  if (!businessId) return null;
  const paramQuery = {
    SORT_DESC: 'true',
    SIZE: size || orderPerPageDefault,
    PAGE: page,
  };
  const response = await clientRequest.get(`v1/order/business/${businessId}`, {
    params: paramQuery,
  });
  return response;
};

export const getOrderAmountCurrentMonthFn = async () => {
  const response = await clientRequest.get(
    `v1/order/compute/sum-current-month`,
  );
  return response;
};

export const getOrderAmountLastMonthFn = async () => {
  const response = await clientRequest.get(`v1/order/compute/sum-last-month`);
  return response;
};

export const getOrderCalculationsFn = async searchParams => {
  const paramQuery = {
    ...searchParams,
  };
  const response = await clientRequest.get('v1/order/calculate/list', {
    params: paramQuery,
  });
  return response;
};
export const getShippingByOrderIdFn = async orderId => {
  if (!orderId) return null;
  const response = await clientRequest.get(`v1/order/shipping/${orderId}`);
  return response;
};

export const createOrderFn = async body => {
  const response = await clientRequest.post('v1/order/create', body);
  return response;
};

export const getOrderBillingByOrderIdFn = async id => {
  if (!id) return null;
  const response = await clientRequest.get(`v1/order/billing/${id}`);
  return response;
};
