import { clientRequest } from '../utils/Request';

export const smartDeliveryCheckFn = async ({
  deliveryNote,
  deliveryCompany,
}) => {
  const paramQuery = {
    invoice: deliveryNote,
    company: deliveryCompany,
  };

  const response = await clientRequest.get('v1/smart-delivery/check', {
    params: paramQuery,
  });
  return response;
};
