import OrderDetail from '../MyPage/OrderDetail';
import AccountManagement from '../../pages/MyPage/AccountManagement';
import CheckMemberInformation from '../../pages/MyPage/CheckMemberInformation';
import ModifyPersonalInfo from '../../pages/MyPage/ModifyPersonalInfo';
import EmployeeManagement from '../../pages/MyPage/EmployeeManagement';
import MyPage from '../../pages/MyPage';
import Store from '../../pages/Store';
import ArkProduct from '../../pages/ArkProduct';
import OtherProduct from '../../pages/OtherProduct';
import CurrentOrderDetailsPage from '../MyPage/current-month-order-details-page';
import history from '../../history';
import Main from '../../pages/Main';
import Mileage from '../../pages/Mileage';
import Cart from '../../pages/Cart';
import Order from '../../pages/Cart/Order';
import Login from '../../pages/Auth/Login';
import Product from '../../pages/Product';
import Purchase from '../../pages/Purchase';
import { loginStatus, loginType } from '../../constants';
import {
  AS_STATUS,
  AUTH,
  CART,
  CART_ORDER,
  FIND_ID,
  FIND_PASSWORD,
  LOGIN,
  MAIN,
  MILEAGE,
  MY_PAGE,
  MY_PAGE_ACCOUNT,
  MY_PAGE_CHECK_ACCOUNT_INFORMATION,
  MY_PAGE_DETAIL,
  MY_PAGE_EMPLOYEE_MANAGEMENT,
  MY_PAGE_KYIN_SMART_LOCK,
  MY_PAGE_MODIFY_INFO,
  MY_PAGE_ORDER_DETAIL,
  ORDER_ARK_DOOR_LOCK,
  ORDER_PRODUCT,
  PRODUCT_SLUG,
  PURCHASE,
  SIGN_UP,
  SIGN_UP_EMPLOYEE,
  SIGN_UP_REPRESENTATIVE,
  SOCIAL_LOGIN_SIGN_UP,
  SOCIAL_SIGN_UP_EMPLOYEE,
  SOCIAL_SIGN_UP_REPRESENTATIVE,
  INVENTORY,
  MATERIALRETURNSTATUS,
  SERVICENOTE,
} from './Routes';
import AsStatus from '../../pages/AsStatus';
import Inventory from '../../pages/AsStatus/Inventory';
import MaterialReturnStatus from '../../pages/AsStatus/MaterialReturnStatus';
import ServiceNote from '../../pages/AsStatus/ServiceNote';


export const RouteMiniLayout = [
  {
    path: MY_PAGE_ORDER_DETAIL,
    component: <OrderDetail />,
    label: 'OrderDetail',
    nameMiniLayOut: '주문상세',
    isMiniLayout: true,
  },
  {
    path: MY_PAGE_CHECK_ACCOUNT_INFORMATION,
    component: <CheckMemberInformation />,
    label: 'CheckMemberInformation',
    nameMiniLayOut: '',
    isMiniLayout: true,
  },
  {
    path: MY_PAGE_MODIFY_INFO,
    component: <ModifyPersonalInfo />,
    label: 'ModifyPersonalInfo',
    nameMiniLayOut: '개인정보 수정',
    isMiniLayout: true,
  },
  {
    path: MY_PAGE_EMPLOYEE_MANAGEMENT,
    component: <EmployeeManagement />,
    label: 'ModifyPersonalInfo',
    nameMiniLayOut: '직원관리',
    isMiniLayout: true,
  },
  {
    path: MY_PAGE_DETAIL,
    component: <CurrentOrderDetailsPage />,
    label: 'details',
    nameMiniLayOut: '당월 마감 내역',
    isMiniLayout: true,
  },
  {
    path: CART,
    component: <Cart />,
    label: 'cart',
    nameMiniLayOut: '장바구니',
    isMiniLayout: true,
  },
  {
    path: CART_ORDER,
    component: <Order />,
    label: 'order',
    isMiniLayOut: true,
    nameMiniLayOut: '주문하기',
  },
];

export const RoutePrivate = [
  {
    path: MY_PAGE,
    component: <MyPage history={history} />,
    label: 'MyPage',
  },
  {
    path: MY_PAGE_ACCOUNT,
    component: <AccountManagement />,
    label: 'AccountManagement',
  },
  {
    path: MY_PAGE_KYIN_SMART_LOCK,
    component: <Store />,
    label: 'keyin-smart-lock',
  },
  {
    path: ORDER_PRODUCT,
    component: <OtherProduct />,
    label: 'other-products',
  },
  {
    path: ORDER_ARK_DOOR_LOCK,
    component: <ArkProduct />,
    label: 'ark-door-lock',
  },
  {
    path: MAIN,
    component: <Main history={history} />,
    label: 'main',
  },

  {
    path: MILEAGE,
    component: <Mileage />,
    label: 'mileage',
  },

  {
    path: AS_STATUS,
    component: <AsStatus />,
    label: 'as-status',
  },

  {
    path: INVENTORY,
    component: <Inventory />,
    label: 'inventory',
  },

  {
    path: MATERIALRETURNSTATUS,
    component: <MaterialReturnStatus />,
    label: 'material-return-status',
  },

  {
    path: SERVICENOTE,
    component: <ServiceNote />,
    label: 'service-note',
  },
];

export const RouteMainLayout = [
  {
    path: PRODUCT_SLUG,
    component: <Product />,
    label: 'Product',
    isMiniLayout: false,
  },
  {
    path: PURCHASE,
    component: <Purchase />,
    label: 'Purchase',
    isMiniLayout: false,
  },
];

export const RoutePublic = [
  {
    path: SIGN_UP,
    component: <Login status={loginStatus.SIGN_UP} title="회원가입" />,
    label: 'sign-up',
  },
  {
    path: SIGN_UP_EMPLOYEE,
    component: (
      <Login status={loginStatus.SIGN_UP_EMPLOYEE} title="직원 회원가입" />
    ),
    label: 'employee',
  },
  {
    path: SIGN_UP_REPRESENTATIVE,
    component: (
      <Login
        status={loginStatus.SIGN_UP_REPRESENTATIVE}
        title="대표자 회원가입"
      />
    ),
    label: 'representative',
  },
  {
    path: SOCIAL_SIGN_UP_REPRESENTATIVE,
    component: (
      <Login
        status={loginStatus.SIGN_UP_REPRESENTATIVE}
        title="대표자 회원가입"
        pageType={loginType.SOCIAL}
      />
    ),
    label: 'representative',
  },
  {
    path: SOCIAL_SIGN_UP_EMPLOYEE,
    component: (
      <Login
        status={loginStatus.SIGN_UP_EMPLOYEE}
        title="직원 회원가입"
        pageType={loginType.SOCIAL}
      />
    ),
    label: 'employee',
  },
  {
    path: SOCIAL_LOGIN_SIGN_UP,
    component: (
      <Login
        status={loginStatus.SIGN_UP}
        title="회원가입"
        pageType={loginType.SOCIAL}
      />
    ),
    label: 'sign-up',
  },
  {
    path: LOGIN,
    component: <Login status={loginStatus.SIGN_IN} />,
    label: 'login',
  },
  {
    path: FIND_ID,
    component: <Login status={loginStatus.FIND_ID} title="아이디 찾기" />,
    label: 'find-id',
  },
  {
    path: FIND_PASSWORD,
    component: (
      <Login status={loginStatus.FIND_PASSWORD} title="비밀번호 찾기" />
    ),
    label: 'find-password',
  },
  {
    path: AUTH,
    component: <Login />,
    label: 'auth',
  },
];
