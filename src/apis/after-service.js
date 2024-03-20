import { clientRequest } from '../utils/Request';

export const getAfterServiceByIdFn = async id => {
  if (!id) return null;
  const response = await clientRequest.get(`v1/after-service/${id}`);
  return response;
};

export const getRepresentSymptomsFn = async () => {
  const response = await clientRequest.get(
    'v1/after-service/represent-symptoms/list',
  );
  return response;
};
export const getDetailedSymptomsFn = async () => {
  const response = await clientRequest.get(
    'v1/after-service/detailed-symptoms/list',
  );
  return response;
};

export const getMaterialTotalFn = async params => {
  const response = await clientRequest.get('v1/after-service/material/total', {
    params: { ...params },
  });
  return response;
};

export const getMaterialStatusFn = async params => {
  const response = await clientRequest.get('v1/after-service/material/status', {
    params: { ...params },
  });
  return response;
};

export const getMaterialSearchFn = async params => {
  const response = await clientRequest.get('v1/after-service/material/search', {
    params: { ...params },
  });
  return response;
};

export const getSettlementMaterialFn = async params => {
  const response = await clientRequest.get(
    'v1/after-service/settlement/material',
    {
      params: { ...params },
    },
  );
  return response;
};

export const updateAfterServiceFn = async body => {
  const response = await clientRequest.post(
    `v1/after-service/update/${body?.ASid}`,
    body,
  );
  return response;
};
