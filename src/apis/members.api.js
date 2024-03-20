import { itemsPerPageDefault } from '../components/Pagination/configPagination';
import { clientRequest } from '../utils/Request';

export const getAllMemebersByBusinessIdFn = async ({ page, id }) => {
  const paramQuery = {
    SORT_DESC: 'true',
    SIZE: itemsPerPageDefault,
    PAGE: page,
  };
  const response = await clientRequest.get(`v1/business/${id}/members/all`, {
    params: paramQuery,
  });
  return response;
};

export const getSearchMemberFn = async searchParams => {
  const params = {
    ...searchParams,
  };
  const response = await clientRequest.get(`v1/member/search`, {
    params,
  });
  return response;
};
// Change member's status
export const approvalMemberFn = async body => {
  const response = await clientRequest.put(
    `v1/business/members/workplace/approve`,
    body,
  );
  return response;
};
// Change member's status
export const rejectMemberFn = async ({ businessId, memberId }) => {
  const response = await clientRequest.put(
    `v1/business/${businessId}/members/${memberId}/reject`,
  );
  return response;
};
export const getMemberByIdFn = async ({ id }) => {
  const response = await clientRequest.get(`v1/member/${id}`);
  return response;
};
export const withdrawMember = async memberId => {
  const response = await clientRequest.get(`v1/member/${memberId}/removal`);
  return response;
};
