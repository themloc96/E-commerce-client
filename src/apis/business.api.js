import {
  boardPerPageDefault,
  itemsPerPageDefault,
} from '../components/Pagination/configPagination';
import { clientRequest } from '../utils/Request';

export const getAllBusinessesFn = async () => {
  const response = await clientRequest.get('v1/business/all');
  return response;
};

export const getBusinessesInfoFn = async () => {
  const response = await clientRequest.get('v1/business/my-info');
  return response;
};

export const getSearchBusinessFn = async searchParams => {
  const paramQuery = {
    ...searchParams,
  };
  const response = await clientRequest.get('v1/business/search', {
    params: paramQuery,
  });
  return response;
};

export const getClientBusinessFn = async ({ page, businessId }) => {
  const paramQuery = {
    PAGE: page,
    SIZE: itemsPerPageDefault,
    SORT_DESC: 'true',
    BUSINESS_ID: businessId,
  };

  const response = await clientRequest.get(`/v1/business/client/search`, {
    params: paramQuery,
  });
  return response;
};
