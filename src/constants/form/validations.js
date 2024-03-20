export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+?[\]{};:'",.<>/])[A-Za-z\d`~!@#$%^&*()\-_=+?[\]{};:'",.<>/]{8,}$/;
export const PASSWORD_REGEX_CHANGE =
  /(^$)|(^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+?[\]{};:'",.<>/])[A-Za-z\d`~!@#$%^&*()\-_=+?[\]{};:'",.<>/]{8,}$)/;
