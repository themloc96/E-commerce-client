import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import KakaoLogin from 'react-kakao-login';
import AppleLogin from 'react-apple-login';
import base64 from 'base-64';
import {
  KAKAO_REDIRECT_URL,
  KAKAO_REST_API_KEY,
} from '../../constants/data/KakaoLoginData';
import {
  NAVER_STATE,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URL,
} from '../../constants/data/NaverLoginData';
import handleGoogleLogin from '../../components/Auth/GoogleAuth';
import handleAppleLogin from '../../components/Auth/AppleAuth';
import { loginUserWithFirebaseFn } from '../../apis/auth.api';
import { DEFAULT_URL } from '../../constants/AppConfig';
import { useAuthContext } from '../../contexts/AuthProvider';
import {
  removeSNSLoginFromLS,
  saveSNSLoginToLS,
} from '../../utils/localStorageSNSLogin';
import { tokenLifeTime } from '../../constants/jsonData/auth';
import { APPLE_CLIENT_ID } from '../../constants/data/AppleLoginData';
// import jwt from 'jsonwebtoken';

function LoginPage() {
  const authCtx = useAuthContext();
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&scope=account_email,profile_nickname,`;
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URL}&state=${NAVER_STATE}`;
  const navigate = useNavigate();
  // API login mutation
  const { mutate: loginUserWithFirebase } = useMutation(
    userData => loginUserWithFirebaseFn(userData),
    {
      onSuccess: data => {
        if (data.status === 'NeedToSignUp') {
          navigate('/social-login/sign-up');
        } else {
          const token = data?.jwt;
          if (token) {
            const expiredTime = tokenLifeTime.DEFAULT;
            const payload = {
              accessToken: token,
              expiredTime,
            };
            authCtx.dispatch({ type: 'LOGIN_USER', payload });
            navigate(DEFAULT_URL);
            removeSNSLoginFromLS();
          } else {
            alert('승인되지 않은 사용자입니다.');
          }
        }
      },
      onError: error => {
        if (
          error.response.status === 400 &&
          error.response.data.message === 'Bad credentials'
        ) {
          navigate('/social-login/sign-up');
        } else if (
          error.response.status === 400 &&
          error.response.data.message ===
            'You are not allowed to approve member'
        ) {
          alert('승인되지 않은 사용자입니다.');
          navigate('/auth');
        }
      },
    },
  );

  const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const testToken = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decode = base64.decode(testToken);
    const data = JSON.parse(decode);
    return data;
  };

  const handleRedirectSignIn = async snsType => {
    if (snsType === 'kakao') {
      window.location.href = KAKAO_AUTH_URL;
      // window.open(KAKAO_AUTH_URL);
    } else if (snsType === 'naver') {
      window.location.href = NAVER_AUTH_URL;
    } else if (snsType === 'google') {
      handleGoogleLogin(loginUserWithFirebase);
    } else if (snsType === 'apple') {
      // handleAppleLogin(loginUserWithFirebase);
      console.log('sign in with apple');

      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: 'https://keyin.app/auth',
        response_type: 'code id_token',
        state: 'origin:web',
        response_mode: 'form_post',
        usePopup: true,
      });
      try {
        const res = await window.AppleID.auth.signIn();
        if (res.authorization.id_token) {
          const data = parseJwt(res.authorization.id_token);
          if (data) {
            const userData = {
              displayName:
                res?.user !== undefined
                  ? `${res.user.name.lastName}${res.user.name.firstName}`
                  : '',
              email: data.email,
              snsType: 'APPLE',
            };
            saveSNSLoginToLS(userData);
            loginUserWithFirebase(userData);
          } else {
            console.log('Token verification required');
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // window.location.href = '/social-login/sign-up';
    }
  };

  return (
    <div className="login-000">
      <div className="select-login-method">
        <KakaoLogin
          token="64d0c649f5b7e5a3ef9790587ee5f19b"
          // onFail={result => console.error(result)}
          render={() => (
            <button
              onClick={() => handleRedirectSignIn('kakao')}
              className="kakao-method pt-[2px]"
            >
              <div className="ml-[-9px]">
                <picture>
                  <source
                    media="(max-width:520px)"
                    srcSet="/assets/logos/kakao-m.png"
                  />
                  <img alt="kakao" src="/assets/logos/kakao.svg" />
                </picture>
                <span className="mt-[-3px] md:mt-[0px]">카카오 로그인</span>
              </div>
            </button>
          )}
        />
        <button
          onClick={() => handleRedirectSignIn('naver')}
          className="naver-method !mb-[9px] md:!mb-[11px]"
        >
          <div className="ml-[-9px]">
            <picture>
              <source
                media="(max-width:520px)"
                srcSet="/assets/logos/naver-m.png"
              />
              <img alt="kakao" src="/assets/logos/naver.svg" />
            </picture>
            <span>네이버 로그인</span>
          </div>
        </button>
        <AppleLogin
          clientId="com.react.apple.login"
          render={() => (
            <button
              className="apple-method !mb-[9px] md:!mb-[11px]"
              // onClick={renderProps.onClick}
              onClick={() => handleRedirectSignIn('apple')}
            >
              <div className="md:ml-[-8px]">
                <picture>
                  <source
                    media="(max-width:520px)"
                    srcSet="/assets/logos/apple-m.png"
                  />
                  <img alt="apple" src="/assets/logos/apple.svg" />
                </picture>
                <span>Apple 로그인</span>
              </div>
            </button>
          )}
          redirectURI="https://keyin.app/auth"
        />
        <button
          className="google-method"
          onClick={() => handleRedirectSignIn('google')}
        >
          <div className="md:ml-[-5px]">
            <picture className="md:mt-[-3px] md:ml-[-3px]">
              <source
                media="(max-width:520px)"
                srcSet="/assets/logos/google-m.png"
              />
              <img alt="kakao" src="/assets/logos/google.svg" />
            </picture>
            <span className="md:mt-[-4px] md:ml-[-3px]">Google 로그인</span>
          </div>
        </button>
      </div>
      <div className="line-2" />
      <Link className="member-method-link" to="/login">
        <button className="id-method">
          <p>아이디로 로그인</p>
        </button>
      </Link>
      <Link className="member-method-link" to="/sign-up">
        <button className="member-method">회원가입</button>
      </Link>
    </div>
  );
}

export default LoginPage;
