import { clientRequest } from '../utils/Request';

export const getDetailModusignFn = async ({ id }) => {
  const response = await clientRequest.get(`v1/modusign/detail/${id}`);
  return response;
};
