const LS_SNS_LOGIN = 'SNS_login_';

export const saveSNSLoginToLS = (snsLogin) => {
  localStorage.setItem(LS_SNS_LOGIN, JSON.stringify(snsLogin));
}
export const getSNSLoginFromLS = () => {
  return JSON.parse(localStorage.getItem(LS_SNS_LOGIN));
}
export const removeSNSLoginFromLS = () => {
  localStorage.removeItem(LS_SNS_LOGIN);
}