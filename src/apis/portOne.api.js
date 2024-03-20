import { clientRequest } from '../utils/Request';

export const getPortOnePaymentsFn = async id => {
  if (!id) return null;
  const response = await clientRequest.get(`v1/portone/payments/${id}`);
  return response;
};
