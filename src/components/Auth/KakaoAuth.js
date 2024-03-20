import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  KAKAO_REST_API_KEY,
  KAKAO_REDIRECT_URL,
} from '../../constants/data/KakaoLoginData';
import { snsType, tokenLifeTime } from '../../constants/jsonData/auth';
import {
  removeSNSLoginFromLS,
  saveSNSLoginToLS,
} from '../../utils/localStorageSNSLogin';
import { loginUserWithKakaoFn } from '../../apis/auth.api';
import { useAuthContext } from '../../contexts/AuthProvider';
import { DEFAULT_URL } from '../../constants/AppConfig';

function KakaoAuth() {
  const authCtx = useAuthContext();

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const navigate = useNavigate();
  async function getUserData() {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URL,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      const kakaoData = await axios.post(
        'https://kapi.kakao.com/v2/user/me',
        {},
        {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      if (
        response.status === 400 &&
        response.data.message === 'You are not allowed to approve member'
      ) {
        alert('승인되지 않은 사용자입니다.');
        navigate('/auth');
      }

      const displayName = kakaoData.data.kakao_account?.profile?.nickname ?? "알수없음";
      const { email } = kakaoData.data.kakao_account;

      const userData = {
        displayName,
        email,
        snsType: snsType.KAKAO,
      };

      const responseData = await loginUserWithKakaoFn(userData);
      if (responseData.status === 'NeedToSignUp') {
        saveSNSLoginToLS(userData);
        navigate(`/social-login/sign-up`);
      }
      const token = responseData?.jwt;
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
        // alert('승인되지 않은 사용자입니다.');
      }
    } catch (e) {
      console.log(e);
      console.log(e.response.data.error_description);
      const errorDescription = e?.response?.data?.message;
      
      console.log(errorDescription?.includes('authorization code not found'));
      if (errorDescription?.includes('You are not allowed to approve member')) {
        navigate('/auth');
        alert('승인되지 않은 사용자입니다.');
      }
    }
  }
  getUserData();
}
export default KakaoAuth;