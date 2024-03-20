import { clientRequest } from '../utils/Request';

export const getListAsService = async (
  params,
  id,
  businessId,
  memberType,
  previousMemberType,
) => {
  let paramQuery = {};

  if (memberType === 'ACCOUNT' || previousMemberType === 'ACCOUNT') {
    paramQuery = {
      PAGE: params.page,
      SORT_DESC: 'true',
      YEAR: params.year,
      MONTH: params.month,
      AS_DISPATCH_CATEGORY: params.asDispatchCategory,
      BUSINESS_ID: businessId,
      SIZE: 20,
      T_AS_STATUS: true,
    };
  } else {
    paramQuery = {
      PAGE: params.page,
      SORT_DESC: 'true',
      YEAR: params.year,
      MONTH: params.month,
      AS_DISPATCH_CATEGORY: params.asDispatchCategory,
      AS_ENGINEER_ID: id,
      SIZE: 20,
      T_AS_STATUS: true,
    };
  }

  const response = await clientRequest.get(`v1/after-service/search`, {
    params: paramQuery,
  });
  return response;
};

export const getAsServiceDetail = async id => {
  const response = await clientRequest.get(`/v1/after-service/${id}`);
  return response;
};

export const getSurChargeList = async () => {
  const response = await clientRequest.get(`/v1/after-service/surcharge/list`);
  return response;
};

export const getStatusList = async (params, id) => {
  const paramQuery = {
    year: params.year,
    month: params.month,
  };
  const response = await clientRequest.get(`/v1/after-service/current/${id}`, {
    params: paramQuery,
  });
  return response;
};

export const updateStatus = async (ids, status) => {
  const response = await clientRequest.get(`v1/after-service/as-status`, {
    params: { status, ids: ids.toString() },
  });
  return response;
};
