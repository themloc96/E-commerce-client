import { Outlet } from 'react-router-dom';
import { Mainlayout, Minilayout } from '../components/Layouts';
import { useWindowDimensions } from '../hooks';

import MyPage from '../pages/MyPage';
import Store from '../pages/Store';
import Main from '../pages/Main';
import ArkProduct from '../pages/ArkProduct';
import Mileage from '../pages/Mileage';
import OtherProduct from '../pages/OtherProduct';
import OrderDetail from '../components/MyPage/OrderDetail';
import CheckMemberInformation from '../pages/MyPage/CheckMemberInformation';
import ModifyPersonalInfo from '../pages/MyPage/ModifyPersonalInfo';
import EmployeeManagement from '../pages/MyPage/EmployeeManagement';
import CurrentOrderDetailsPage from '../components/MyPage/current-month-order-details-page';
import Cart from '../pages/Cart';
import Order from '../pages/Cart/Order';
import ProductPage from '../pages/Product/Loadable';
import Story from '../pages/Community/Story';
import Interview from '../pages/Community/Interview';
import Distributor from '../pages/Community/Distributor';
import DistributorDetail from '../pages/Community/Distributor/Detail';
import DistributorCreate from '../pages/Community/Distributor/DistributorCreate';
import CreateCustomerPage from '../pages/Customer/New';
import EditCustomerPage from '../pages/Customer/Edit';
import AsStatus from '../pages/AsStatus';
import RequireAuth from '../components/Auth/RequireAuth';
import TravelExpensePage from '../pages/Calculation/TravelExpense';
import InstallationProductsPage from '../pages/Customer/InstallationProducts';
import SituationDetailCaseFive from '../pages/AsStatus/SituationDetailCaseFive';
import ServiceMaterialPage from '../pages/Calculation/ServiceMaterial';
import ActionResult from '../pages/AsStatus/ActionResult';
import ActionResultCaseOne from '../pages/AsStatus/ActionResult/ActionResultCaseOne';
import Inventory from '../pages/AsStatus/Inventory';
import MaterialReturnStatus from '../pages/AsStatus/MaterialReturnStatus';
import MaterialReturnStatusCaseOne from '../pages/AsStatus/MaterialReturnStatusCaseOne';
import ServiceNote from '../pages/AsStatus/ServiceNote';
import DeliveryTrackingPage from '../pages/MyPage/Order/DeliveryTracing';
import AsReception from '../pages/AsStatus/AsReception';
import EnterActionDetails from '../pages/AsStatus/EnterActionDetails';

export const MainRoutes = () => {
  const { width } = useWindowDimensions();
  return {
    path: '',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Mainlayout />,
        children: [
          {
            path: 'main',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <Main />,
              },
            ],
          },
          {
            path: 'order/keyin-smart-lock',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <Store />,
              },
            ],
          },
          {
            path: 'order/ark-door-lock',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <ArkProduct />,
              },
            ],
          },
          {
            path: 'order/other-products',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <OtherProduct />,
              },
            ],
          },
          {
            path: '/product/:slug',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <ProductPage />,
              },
            ],
          },
          {
            path: '/as/status',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <AsStatus />,
              },
            ],
          },
          {
            path: '/as/inventory',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <Inventory />,
              },
            ],
          },
          {
            path: '/as/material-return-status',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <MaterialReturnStatus />,
              },
            ],
          },
          {
            path: '/as/quality',
            element: <RequireAuth />,
            children: [
              {
                path: '',
                element: <ServiceNote />,
              },
            ],
          },
        ],
      },
      {
        path: '/as/quality/:slug/:slug',
        element: (
          <Minilayout
            name=""
            className="bg-white"
            renderWithoutFooter={width < 1024}
          />
        ),
        children: [
          {
            path: '',
            element: <DistributorDetail />,
          },
        ],
      },
      {
        path: '',
        element: <RequireAuth />,
        children: [
          {
            path: 'my-page/order-detail/:slug',
            element: (
              <Minilayout
                className="bg-bg2 md:bg-transparent"
                name="주문상세"
              />
            ),
            children: [
              {
                path: '',
                element: <OrderDetail />,
              },
            ],
          },
          {
            path: 'my-page/check-account-information',
            element: <Minilayout headerType="baseHeader" name="" />,
            children: [
              {
                path: '',
                element: <CheckMemberInformation />,
              },
            ],
          },
          {
            path: 'my-page/modify-personal-info',
            element: (
              <Minilayout
                headerType="baseHeader"
                className="bg-bg2 md:bg-transparent"
                name="개인정보 수정"
              />
            ),
            children: [
              {
                path: '',
                element: <ModifyPersonalInfo />,
              },
            ],
          },
          {
            path: 'my-page/employee-management',
            element: <Minilayout name="직원관리" />,
            children: [
              {
                path: '',
                element: <EmployeeManagement />,
              },
            ],
          },
          {
            path: 'order/details',
            element: (
              <Minilayout
                name="당월 마감 내역"
                className="bg-bg2 md:bg-transparent"
              />
            ),
            children: [
              {
                path: '',
                element: <CurrentOrderDetailsPage />,
              },
            ],
          },
          {
            path: 'cart',
            element: (
              <Minilayout name="장바구니" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <Cart />,
              },
            ],
          },
          {
            path: '/cart/order',
            element: (
              <Minilayout name="주문하기" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <Order />,
              },
            ],
          },
          {
            path: 'my-page',
            element: <Mainlayout className="bg-bg2 md:bg-transparent" />,
            children: [
              {
                path: '',
                element: <MyPage />,
              },
            ],
          },
          {
            path: 'mileage',
            element: <Mainlayout className="bg-bg2 md:bg-transparent" />,
            children: [
              {
                path: '',
                element: <Mileage />,
              },
            ],
          },
          {
            path: '/community/raonark_story',
            element: <Mainlayout className="bg-bg2 md:bg-transparent" />,
            children: [
              {
                path: '',
                element: <Story />,
              },
            ],
          },
          {
            path: '/community/raonark_story/:slug/:slug',
            element: (
              <Minilayout
                name=""
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <DistributorDetail />,
              },
            ],
          },
          {
            path: '/community/interview',
            element: <Mainlayout className="bg-bg2 md:bg-transparent" />,
            children: [
              {
                path: '',
                element: <Interview />,
              },
            ],
          },
          {
            path: '/community/interview/:slug',
            element: (
              <Minilayout
                name=""
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <DistributorDetail />,
              },
            ],
          },
          {
            path: '/community/agency_news',
            element: <Mainlayout className="bg-bg2 md:bg-transparent" />,
            children: [
              {
                path: '',
                element: <Distributor />,
              },
            ],
          },
          {
            path: '/community/agency_news/:slug',
            element: (
              <Minilayout
                name=""
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <DistributorDetail />,
              },
            ],
          },
          {
            path: '/community/agency_news/create',
            element: (
              <Minilayout
                name="게시판 글쓰기"
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <DistributorCreate />,
              },
            ],
          },
          {
            path: '/community/agency_news/edit/:slug',
            element: (
              <Minilayout
                name="게시판 글쓰기 수정"
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <DistributorCreate />,
              },
            ],
          },
          {
            path: 'customers/create-new',
            element: (
              <Minilayout name="신규 고객 등록" className="md:bg-transparent" />
            ),
            children: [
              {
                path: '',
                element: <CreateCustomerPage />,
              },
            ],
          },
          {
            path: 'customers/:id/edit',
            element: (
              <Minilayout name="고객 정보 수정" className="md:bg-transparent" />
            ),
            children: [
              {
                path: '',
                element: <EditCustomerPage />,
              },
            ],
          },
          {
            path: 'customers/installation-products',
            element: (
              <Minilayout
                name="설치 제품 선택"
                className="bg-white"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <InstallationProductsPage />,
              },
            ],
          },
          {
            path: 'calculation/travel-expense',
            element: (
              <Minilayout
                name="당월 출장비 내역"
                className="bg-bg2 md:bg-transparent"
              />
            ),
            children: [
              {
                path: '',
                element: <TravelExpensePage />,
              },
            ],
          },
          {
            path: 'calculation/service-material',
            element: (
              <Minilayout
                name="당월 서비스 자재 내역"
                className="bg-bg2 md:bg-transparent"
              />
            ),
            children: [
              {
                path: '',
                element: <ServiceMaterialPage />,
              },
            ],
          },
          {
            path: 'my-page/orders/:id/delivery-tracking',
            element: (
              <Minilayout name="배송조회" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <DeliveryTrackingPage />,
              },
            ],
          },
          {
            path: '/as/status/detail/enter-action-details/:id',
            element: (
              <Minilayout name="접수 내역" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <EnterActionDetails />,
              },
            ],
          },
          {
            path: '/as/status/detail/as-reception/:id',
            element: (
              <Minilayout name="접수 내역" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <AsReception />,
              },
            ],
          },
          {
            path: '/as/status/detail/casefive',
            element: (
              <Minilayout name="접수 내역" renderWithoutFooter={width < 1024} />
            ),
            children: [
              {
                path: '',
                element: <SituationDetailCaseFive />,
              },
            ],
          },
          {
            path: '/as/action-result',
            element: (
              <Minilayout
                name="A/S 조치결과 입력"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <ActionResult />,
              },
            ],
          },
          {
            path: '/as/action-result/case-one/:id',
            element: (
              <Minilayout
                name="A/S 조치결과 입력"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <ActionResultCaseOne />,
              },
            ],
          },
          {
            path: '/as/action-result/popup',
            element: (
              <Minilayout
                name="사용 자재 추가"
                renderWithoutFooter={width < 1024}
              />
            ),
          },
          {
            path: '/as/material-return-status-case-1',
            element: (
              <Minilayout
                name="자재 반납 요청"
                renderWithoutFooter={width < 1024}
              />
            ),
            children: [
              {
                path: '',
                element: <MaterialReturnStatusCaseOne />,
              },
            ],
          },
        ],
      },
      // You can implement your route custom here
    ],
  };
};
