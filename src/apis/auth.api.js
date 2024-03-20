import { clientRequest } from '../utils/Request';

export const loginUserFn = async ({ username, password }) => {
  const response = await clientRequest.post('v1/auth/login', {
    username,
    password,
    // roleId: 2848
  });
  return response;
};
export const signUpBusinessFn = async body => {
  const response = await clientRequest.post('v1/auth/business-signup', body);
  return response;
};
export const signUpEmployeeFn = async body => {
  const response = await clientRequest.post('v1/auth/member-signup', body);
  return response;
};
export const loginUserWithFirebaseFn = async ({
  displayName,
  email,
  snsType,
}) => {
  const response = await clientRequest.post('v1/social/firebase', {
    displayName,
    email,
    snsType,
  });
  return response;
};

export const loginUserWithKakaoFn = async ({ displayName, email, snsType }) => {
  const response = await clientRequest.post('/v1/social/kakao', {
    displayName,
    email,
    snsType,
  });
  return response;
};

/**
 * Don't modidfy this.
 */
export const loginUserWithNaverFn = async ({ code }) => {
  const response = await clientRequest.post('v1/social/naver', {
    code,
  });
  return response;
};

export const requestSendOtpFn = async ({ nameOrUsername, phone, type }) => {
  const response = await clientRequest.post('v1/auth/send-otp', {
    nameOrUsername,
    phone,
    type,
  });
  return response;
};

export const verifyOptFn = async ({ key, phone }) => {
  const response = await clientRequest.post('v1/auth/otp-check', {
    key,
    phone,
  });
  return response;
};
export const verifyBusinessNumberFn = async bizNumber => {
  const response = await clientRequest.get(
    `v1/auth/verify-registration-number/${bizNumber}`,
  );
  return response;
};

export const forgotPasswordFn = async ({ username, otp, newPassword }) => {
  const response = await clientRequest.post('v1/auth/forgot-password', {
    username,
    otp,
    newPassword,
  });
  return response;
};

export const forgotUsernameFn = async ({ name, otp, phone }) => {
  const response = await clientRequest.post('v1/auth/forgot-username', {
    name,
    otp,
    phone,
  });
  return response;
};

export const verifyReferralCodeFn = async code => {
  const response = await clientRequest.post(
    `v1/auth/referralcodecheck?code=${code}`,
  );
  return response;
};

export const checkPasswordFn = async ({ password }) => {
  const response = await clientRequest.post('v1/auth/check-password', {
    password,
  });
  return response;
};

export const userIdCheckFn = async id => {
  const response = await clientRequest.get(`v1/auth/useridcheck/${id}`, { id });
  return response;
};
