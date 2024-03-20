export const paymentMethods = [
  {
    label: '월말정산',
    value: 'MS', // Monthly-end Settlement
    id: null,
    type: null,
  },
  {
    label: '신용카드',
    value: 'CC', // Credit Card
    id: 'nice_v2.IM0016004m',
    type: 'card',
  },
  // {
  //   label: '계좌이체',
  //   value: 'AT', // Account Transfer
  //   id: 'nice_v2.IM0016004m',
  //   type: 'vbank',
  // },
  // {
  //   label: '휴대폰',
  //   value: 'phone', // Phone
  //   id: 'nice_v2.IM0016004m',
  //   type: 'phone',
  // },
  // {
  //   label: '네이버페이',
  //   value: 'NP', // NAVER Pay
  //   id: null,
  //   type: null,
  // },
  {
    label: '카카오페이',
    value: 'KP', // Kakaotalk Pay
    id: 'kakaopay.CAL8CRJMMH',
    type: 'card',
  },
];

export const shippingMethod = [
  {
    label: 'CJ대한통운',
    value: 'CJ', // CJ Logistics
  },
  {
    label: '한진택배',
    value: 'HJ', // Hanjin Express
  },
  {
    label: '롯데택배',
    value: 'LT', // Lotte Express
  },
  {
    label: '우체국',
    value: 'P', // post office
  },
  {
    label: '퀵서비스',
    value: 'FS', // quick service
  },
  {
    label: '직접배송',
    value: 'D', // direct delivery
  },
];

export const shippingMethodUpdated = [
  {
    label: 'Parcel',
    value: '택배', // parcel
  },
  {
    label: 'Quick Service',
    value: '퀵서비스', // quick service
  },
  {
    label: 'Direct Delivery',
    value: '직접배송', // direct delivery
  },
];
