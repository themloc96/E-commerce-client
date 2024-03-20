import { clientRequest } from "../utils/Request"

export const getMeFn = async () => {
  const response = await clientRequest.get('v1/member/my-info')
  return response;
}

export const getBusinessByUserIdFn = async (userId) => {
  if(!userId) return null;
  const response = await clientRequest.get(`v1/member/${userId}/business`)
  return response;
}
export const changePasswordFn = async ({ oldPassword, newPassword }) => {
  const response = await clientRequest.post('v1/user/change-password', {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response;
};

export const updateUserInfoFn = async (body) => {
  const response = await clientRequest.put('v1/member/update', body);
  return response;
};
