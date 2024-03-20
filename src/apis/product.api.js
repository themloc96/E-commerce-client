import { clientRequest } from '../utils/Request';

export const getAllProductsFn = async () => {
  const response = await clientRequest.get('v1/product/all');
  return response;
};

export const searchFn = async ({
  search = '',
  brand = null,
  category = null,
  apps = [],
  designs = [],
  accessMethods = [],
  page = 0,
}) => {
  let advanceSearch = '';
  if (category != null) advanceSearch += `&CATEGORY=${category}`;
  // App 서비스
  if (apps && apps.length > 0) {
    apps.forEach(element => {
      advanceSearch += `&APP_SERVICE=${element}`;
    });
  }
  // 디자인
  if (designs && designs.length > 0) {
    designs.forEach(element => {
      advanceSearch += `&DESIGN=${element}`;
    });
  }
  // 출입방식
  if (accessMethods && accessMethods.length > 0) {
    accessMethods.forEach(element => {
      advanceSearch += `&ACCESS_METHOD=${element}`;
    });
  }
  const paramQuery = {
    IS_PUBLIC: true,
    SORT_DESC: true,
  };
  const response = await clientRequest.get(
    `v1/product/search?NAME=${
      search || ''
    }&BRAND=${brand}${advanceSearch}&PAGE=${page}&SIZE=12`,
    { params: paramQuery },
  );
  return response;
};

export const getProductByIdFn = async id => {
  const response = await clientRequest.get(`v1/product/${id}`);
  return response;
};

export const getBestProductsFn = async id => {
  const response = await clientRequest.get(`v1/product/best`);
  return response;
};

export const getMaterialPopupFn = async searchParams => {
  const paramQuery = {
    ...searchParams,
  };

  const response = await clientRequest.get(`/v1/product/material/popup`, {
    params: paramQuery,
  });
  return response;
};
