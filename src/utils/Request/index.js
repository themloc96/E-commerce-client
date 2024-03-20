/* eslint-disable func-names */
import axios from 'axios';
import { REACT_APP_API_URL } from '../../constants/AppConfig';
import {
  LocalStorageEventTarget,
  getAccessTokenFromStorage,
  removeAccessToken,
} from '../accessTokenUtils';

const BASE_URL = REACT_APP_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Waiting 2m for request timeout
  headers: {
    'Cache-Control': 'no-cache',
  },
});
instance.interceptors.request.use(config => {
  const token = getAccessTokenFromStorage();
  const accessToken = token?.accessToken;
  if (accessToken && config.headers) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response?.data;
  },
  function (error) {
    if (error.response.status === 401) {
      const clearLSEvent = new Event('clearLS');
      LocalStorageEventTarget.dispatchEvent(clearLSEvent);
    }
    return Promise.reject(error);
  },
);

export { instance as clientRequest };
