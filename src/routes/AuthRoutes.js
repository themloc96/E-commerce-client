import { Outlet } from 'react-router-dom';
import KakaoAuth from '../components/Auth/KakaoAuth';
import Login from '../pages/Auth';
import { loginStatus, loginType } from '../constants';
import { Mainlayout } from '../components/Layouts/Mainlayout';
import NaverAuth from '../components/Auth/NaverAuth';
import RejectedRoute from './RejectedRoute';

export const AuthRoutes = () => {
  return {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: (
          <Mainlayout
            className="bg-bg2 md:bg-transparent"
            headerType="header"
          />
        ),
        children: [
          {
            path: 'sign-up',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: (
                  <Login status={loginStatus.SIGN_UP} title="회원가입" />
                ),
              },
            ],
          },
          {
            path: 'sign-up/representative',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: (
                  <Login
                    status={loginStatus.SIGN_UP_REPRESENTATIVE}
                    title="대표자 회원가입"
                  />
                ),
              },
            ],
          },
          {
            path: 'social-login/sign-up/representative',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: (
                  <Login
                    status={loginStatus.SIGN_UP_REPRESENTATIVE}
                    title="대표자 회원가입"
                    pageType={loginType.SOCIAL}
                  />
                ),
              },
            ],
          },
          {
            path: 'social-login/sign-up/employee',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: (
                  <Login
                    status={loginStatus.SIGN_UP_EMPLOYEE}
                    title="직원 회원가입"
                    pageType={loginType.SOCIAL}
                  />
                ),
              },
            ],
          },
          {
            path: 'social-login/sign-up',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: (
                  <Login
                    status={loginStatus.SIGN_UP}
                    title="회원가입"
                    pageType={loginType.SOCIAL}
                  />
                ),
              },
            ],
          },
          {
            path: 'find-id',
            element: <Login status={loginStatus.FIND_ID} title="아이디 찾기" />,
          },
          {
            path: 'find-password',
            element: (
              <Login status={loginStatus.FIND_PASSWORD} title="비밀번호 변경하기" />
            ),
          },
          {
            path: 'auth',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: <Login />,
              },
            ],
          },
          {
            path: 'auth/kakao',
            element: <KakaoAuth />,
            children: [
              {
                path: '',
                element: <KakaoAuth />,
              },
            ],
          },
          {
            path: 'auth/naver',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: <NaverAuth />,
              },
            ],
          },
          {
            path: 'login',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: <Login status={loginStatus.SIGN_IN} />,
              },
            ],
          },
          {
            path: 'sign-up/employee',
            element: <RejectedRoute />,
            children: [
              {
                path: '',
                element: (
                  <Login
                    status={loginStatus.SIGN_UP_EMPLOYEE}
                    title="직원 회원가입"
                  />
                ),
              },
            ],
          },
        ],
      },
    ],
  };
};
