const LS_OTP = 'opt_';
export const getOtpFromLS = () => {
  return JSON.parse(localStorage.getItem(LS_OTP));
};
export const saveOtpToLS = value => {
  const oldValue = getOtpFromLS();
  const newValue = { ...oldValue, ...value };
  localStorage.setItem(LS_OTP, JSON.stringify(newValue));
};
export const removeOtpFromLS = () => {
  return localStorage.removeItem(LS_OTP);
};

export const checkValidBizNumber = bizNumber => {
  if (!bizNumber) return false;
  return (
    bizNumber.length === 10 &&
    bizNumber.toString().slice(0, 3) >= 101 &&
    bizNumber.toString().slice(0, 3) <= 999
  );
};
export const getErrorFromServer = value => {
  const errors = {
    'Username is already token': {
      fieldName: 'username',
      message: '이미 존재하는 아이디입니다.',
    },
    'Email is already token': {
      fieldName: 'email',
      message: '이미 등록된 이메일입니다.',
    },
    'Phone is already token': {
      fieldName: 'phone',
      message: '이미 등록된 휴대폰 번호 입니다.',
    },
    'Business registration number is existed': {
      fieldName: 'business',
      message: '이미 존재하는 사업자등록번호입니다.',
    },
  };
  return errors[value];
};
