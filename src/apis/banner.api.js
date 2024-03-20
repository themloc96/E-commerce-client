import { clientRequest } from '../utils/Request';
import { bannersPerPageDefault } from '../components/Pagination/configPagination';

// export const getListBannerFn = async (id) => {
//   const response = await clientRequest.get(`v1/banner/list?id=${id}`);
//   return response;
// };

export const getListBannerFn = async ({page}) => {
  const paramQuery = {
    SIZE: bannersPerPageDefault,
    PAGE: page,
  };
  const response = await clientRequest.get('v1/banner/list', {
    params: paramQuery,
  });
  return response;
}