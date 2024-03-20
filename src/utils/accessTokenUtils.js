import { isEmptyObject } from './helpers';

const TOKEN_KEY = 'token_';
export const saveAccessToken = ({ accessToken, expiredTime }) => {
  const normalDate = new Date(expiredTime).toLocaleString('ko-KR', { timeZone: 'UTC' });
  const storedToken = {
    accessToken,
    expiredTime,
    dateTime: normalDate,
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(storedToken));
};

export const getAccessTokenFromStorage = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const checkAuthenticated = () => {
  const token = getAccessTokenFromStorage();

  if (isEmptyObject(token)) return false;

  if (!token?.accessToken) return false;

  const timeNow = new Date().getTime();
  if (timeNow >= token?.expiredTime) return false;

  return true;
};

export const LocalStorageEventTarget = new EventTarget();
