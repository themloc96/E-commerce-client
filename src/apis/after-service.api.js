import { clientRequest } from '../utils/Request';

export const getSettlementFeeFn = async ({
  myBusinessId,
  nowYear,
  nowMonth,
}) => {
  const params = {
    businessId: myBusinessId,
    year: nowYear,
    month: nowMonth,
  };
  const response = await clientRequest.get('v1/after-service/settlement/fee', {
    params,
  });
  return response;
};

export const getSettlementMaterialFn = async ({
  myBusinessId,
  nowYear,
  nowMonth,
}) => {
  const params = {
    businessId: myBusinessId,
    year: nowYear,
    month: nowMonth,
  };
  const response = await clientRequest.get(
    'v1/after-service/settlement/material',
    { params },
  );
  return response;
};
