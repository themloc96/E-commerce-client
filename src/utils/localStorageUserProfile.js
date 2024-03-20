import { isEmptyObject } from './helpers';

const LS_USER_PROFILE = 'user_profile_';

export const getUserProfileFromLS = () => {
  const userProfile = localStorage.getItem(LS_USER_PROFILE);
  return JSON.parse(userProfile);
};

export const saveUserProfileToLS = value => {
  const oldValue = getUserProfileFromLS();
  const newValue = { ...oldValue, ...value };
  localStorage.setItem(LS_USER_PROFILE, JSON.stringify(newValue));
};
export const removeUserProfileFromLS = () => {
  localStorage.removeItem(LS_USER_PROFILE);
};

export const removeUsernameFromLS = value => {
  const oldValue = getUserProfileFromLS();
  if (isEmptyObject(oldValue)) {
    removeUserProfileFromLS();
    return;
  }
  if(!oldValue?.isRemember) {
    removeUserProfileFromLS();
    return;
  }
  const newValue = {
    isRemember: oldValue?.isRemember,
  };
  localStorage.setItem(LS_USER_PROFILE, JSON.stringify(newValue));
};
export const removeIsRememberMeFromLS = value => {
  const oldValue = getUserProfileFromLS();
  if (isEmptyObject(oldValue)) {
    return;
  }
  if(!oldValue?.username) {
    removeUserProfileFromLS();
    return;
  }
  const newValue = {
    username: oldValue?.username,
  };
  localStorage.setItem(LS_USER_PROFILE, JSON.stringify(newValue));
};
