import { clientRequest } from '../utils/Request';

export const getHistoryByIdFn = async id => {
  if (!id) return [];
  const response = await clientRequest.get(`v1/mileage/member/${id}`);
  return response;
};

export const getAllHistoryFn = async () => {
  const response = await clientRequest.get(`v1/mileage/all`);
  return response;
};

export const getHistoryByBusinessIdFn = async businessId => {
  if (!businessId) return null;
  const response = await clientRequest.get(`v1/mileage/business/${businessId}`);
  return response;
};

export const getMileagePointByBusinessIdFn = async businessId => {
  const response = await clientRequest.get(`v1/mileage/expected/${businessId}`);
  return response;
};

export const getSavingMileagePointByBusinessIdFn = async businessId => {
  const response = await clientRequest.get(`v1/mileage/saving/${businessId}`);
  return response;
};

export const searchHistoryFn = async ({ page, businessId }) => {
  const paramQuery = {
    PAGE: page,
    SIZE: 10,
    BUSINESS_ID: businessId,
  };

  const response = await clientRequest.get(`v1/mileage/search?&SORT_DESC`, {
    params: paramQuery,
  });
  return response;
};
