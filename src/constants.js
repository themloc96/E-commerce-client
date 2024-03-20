export const loginStatus = {
  FIND_ID: 'FIND_ID',
  FIND_PASSWORD: 'FIND_PASSWORD',
  AUTH: 'AUTH',
  SIGN_UP: 'SIGN_UP',
  SIGN_UP_REPRESENTATIVE: 'SIGN_UP_REPRESENTATIVE',
  SIGN_UP_EMPLOYEE: 'SIGN_UP_EMPLOYEE',
  SIGN_IN: 'SIGN_IN',
};

export const loginType = {
  SOCIAL: 'SOCIAL',
};

export const signUpTypeSelected = {
  NONE: 'NONE',
  REPRESENTATIVE: 'representative',
  EMPLOYEE: 'employee',
};

export const myPageTabs = {
  ORDER_MANAGEMENT: 'ORDER_MANAGEMENT',
  PARTNER_MANAGEMENT: 'PARTNER_MANAGEMENT',
  CALCULATE: 'CALCULATE',
  CUSTOMER_MANAGEMENT: 'CUSTOMER_MANAGEMENT',
  ACCOUNT_MANAGEMENT: 'ACCOUNT_MANAGEMENT',
};

export const myPageTabsUrlHash = {
  ORDER_MANAGEMENT: 'order',
  PARTNER_MANAGEMENT: 'partner',
  CALCULATE: 'calculate',
  CUSTOMER_MANAGEMENT: 'customer',
  ACCOUNT_MANAGEMENT: 'account',
};

export const roleMember = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_USER: 'ROLE_USER',
};

export const shippingStatus = {
  IN_PROGRESS: 'DELIVERY_IN_PROGRESS',
  COMPLETED: 'DELIVERY_COMPLETED',
};

export const bannerPosition = {
  PC: 'PC',
  MO: 'MO',
};

export const businessType = {
  GENERAL: 'GENERAL', // 일반
  AGENCY: 'AGENCY', // 대리점
  AS: 'AS', // A/S 지점
  AS_AGENCY: 'AS_AGENCY', // A/S + 대리점
};

export const mileageType = {
  MEMBER_REGISTRATION: '회원가입',
  REFERRAL_CODE: '추천인',
  PRODUCT_ORDER: '주문번호',
  PARTNER_SETTLEMENT: '파트너 정산',
  ORDER_CANCEL: '주문번호',
};

export const ordStatus = {
  WP: '결제대기',
  PC: '결제완료',
  MS: '월말정산',
  PP: '상품준비중',
  DP: '배송중',
  DC: '배송완료',
  OC: '취소',
};

export const LENGTH_OPTIONS = 11;

export const storyTabs = {
  ALL: 'ALL',
  COMPANY_NEWS: 'COMPANY_NEWS',
  NEW_PRODUCT: 'NEW_PRODUCT',
  EVENTS: 'EVENTS',
  REPORT: 'REPORT',
};

export const storyTabsUrlHash = {
  ALL: 'all',
  COMPANY_NEWS: 'company_news',
  NEW_PRODUCT: 'new_product',
  EVENTS: 'events',
  REPORT: 'report',
};

export const serviceTabs = {
  ALL: 'ALL',
  QUALITY_TECHNOLOGY: 'QUALITY_TECHNOLOGY',
  OPERATE: 'OPERATE',
};

export const serviceTabsUrlHash = {
  ALL: 'all',
  QUALITY_TECHNOLOGY: 'quality_technology',
  OPERATE: 'operate',
};

export const afterServiceStatus = {
  CC: 'CC', // Consultation Completed note 상담완료,
  AC: 'AC', // Confirmed note A/S 접수완료
  AF: 'AF', // Finished note A/S 조치완료,
  AAC: 'AAC', // Action Confirmed note A/S 조치확정,
  AM: 'AM', // MOVE note A/S 출동중,
  T: 'T', // Temporary Draft note 임시저장,
  C: 'C', // Cancel note 취소,
  CCA: 'CCA', // Cancel A/S Acceptance,
  AAD: 'AAD', // Cancel A/S Acceptance
};
