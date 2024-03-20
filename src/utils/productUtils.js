import { convenienceList, safetyList } from '../constants/jsonData/product';
import { acceptMethods } from '../constants/jsonData/store';

/**
 *
 * @param {*} accessMethodStrs this from server response
 * return acessMethod list
 */
export const getAccessMethodsByStrings = accessMethodStrs => {
  const newAccessMethods = [];
  acceptMethods.forEach(acceptMethod => {
    if (accessMethodStrs.includes(acceptMethod.value)) {
      newAccessMethods.push(acceptMethod);
    }
  });
  return newAccessMethods;
};

/**
 *
 * @param {*} safetyStrs this from server response
 * return Safety List
 */
export const getSafetyListByStrings = safetyStrs => {
  if (!safetyStrs || safetyStrs?.length === 0) return [];
  const newSafetyList = [];
  safetyList.forEach(safety => {
    if (safetyStrs.includes(safety.value)) {
      newSafetyList.push(safety);
    }
  });
  // console.log(newSafetyList);
  return newSafetyList;
};

/**
 *
 * @param {*} ConvenienceStrs this from server response
 * return Convenience List
 */
export const getConveniencesByStrings = convenienceStrs => {
  const newConvenienceList = [];
  convenienceList.forEach(safety => {
    if (convenienceStrs.includes(safety.value)) {
      newConvenienceList.push(safety);
    }
  });
  return newConvenienceList;
};
