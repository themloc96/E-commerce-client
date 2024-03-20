import { clientRequest } from '../utils/Request';

export const getAllPartnersByBusinessIdFn = async businessId => {
  const response = await clientRequest.get(
    `v1/business/${businessId}/partners/all`,
  );
  return response;
};

export const registerPartnerFn = async ({ businessId, partnerId }) => {
  const response = await clientRequest.post(
    `/v1/business/${businessId}/partners/${partnerId}/register`,
  );
  return response;
};

export const approvalPartnerFn = async ({ businessId, partnerId }) => {
  const response = await clientRequest.put(
    `/v1/business/${businessId}/partners/${partnerId}/approve`,
  );
  return response;
};

export const deletePartnerFn = async ({ businessId, partnerId }) => {
  const response = await clientRequest.put(
    `/v1/business/${businessId}/partners/${partnerId}/delete`,
  );
  return response;
};

export const getOrderCalculatingFn = async ({ memberId, year, month }) => {
  const paramQuery = {
    id: memberId,
    year,
    month,
  };
  const response = await clientRequest.get('v1/order/calculate', {
    params: paramQuery,
  });
  return response;
};

export const sendConsultationFn = async () => {
  const response = await clientRequest.post(
    `/v1/member/consultation-request/send`,
  );
  return response;
};
