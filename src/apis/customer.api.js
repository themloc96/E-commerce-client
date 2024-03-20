import { clientRequest } from '../utils/Request';

export const getCustomerByIdFn = async id => {
  const response = await clientRequest.get(`v1/business/client/${id}`);
  return response;
};
export const createCustomerFn = async body => {
  const response = await clientRequest.post(`v1/business/client/created`, body);
  return response;
};
export const updateCustomerFn = async (body, id) => {
  const response = await clientRequest.post(
    `v1/business/client/updated/${id}`,
    body,
  );
  return response;
};
export const getSearchProductsFn = async searchParams => {
  const params = {
    ...searchParams,
  };
  const response = await clientRequest.get(`v1/product/popup`, {
    params,
  });
  return response;
};
