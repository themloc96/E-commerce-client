export const menuItems = [
  {
    text: '상품 주문',
    value: 'product-order',
    link: '/order/keyin-smart-lock',
    sub: [
      {
        text: 'Keyin 스마트락',
        value: 'Keyin-스마트락',
        link: '/order/keyin-smart-lock',
      },
      {
        text: 'Ark 도어락',
        value: 'Ark-도어락',
        link: '/order/ark-door-lock',
      },
      {
        text: '기타',
        value: '기타',
        link: '/order/other-products',
      },
      // {
      //   text: '자재',
      //   value: '자재',
      //   link: '/',
      // },
    ],
  },
  {
    text: '커뮤니티',
    value: 'community',
    link: '/community/raonark_story',
    sub: [
      {
        text: '라오나크 이야기',
        value: '라오나크-이야기',
        link: '/community/raonark_story',
      },
      {
        text: '이달의 인터뷰',
        value: '이달의-인터뷰',
        link: '/community/interview',
      },
      {
        text: '대리점 소식',
        value: '대리점-소식',
        link: '/community/agency_news',
      },
    ],
  },
  {
    text: 'A/S관리',
    value: 'a-s-management',
    link: '/as/status',
    sub: [
      {
        text: 'A/S 현황',
        value: 'A/S-현황',
        link: '/as/status',
      },
      {
        text: '재고 조회',
        value: '재고-조회',
        link: '/as/inventory',
      },
      {
        text: '자재반납',
        value: '자재반납',
        link: '/as/material-return-status',
      },
      {
        text: '품질 게시판',
        value: '품질-게시판',
        link: '/as/quality',
      },
    ],
  },
];
