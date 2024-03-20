import { clientRequest } from '../utils/Request';

export const getTermsFn = async () => {
  const response = await clientRequest.get(`v1/terms/list`);
  return response;
};
