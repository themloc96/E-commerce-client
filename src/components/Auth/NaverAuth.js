import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  NAVER_STATE,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
} from '../../constants/data/NaverLoginData';
import { snsType, tokenLifeTime } from '../../constants/jsonData/auth';
import {
  removeSNSLoginFromLS,
  saveSNSLoginToLS,
} from '../../utils/localStorageSNSLogin';
import { loginUserWithNaverFn } from '../../apis/auth.api';
import { useAuthContext } from '../../contexts/AuthProvider';
import { DEFAULT_URL } from '../../constants/AppConfig';

function NaverAuth() {
  const authCtx = useAuthContext();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  async function getUserData() {
    try {
      const responseData = await loginUserWithNaverFn({ code });
      const { displayName, emailID } = responseData;

      const userData = {
        displayName,
        email: emailID,
        snsType: snsType.NAVER,
        code,
      };
      if (
        responseData.status === 400 &&
        responseData.data.message === 'You are not allowed to approve member'
      ) {
        alert('승인되지 않은 사용자입니다.');
        navigate('/auth');
      }
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
      navigate('/main');
    }
  }
  getUserData();
}
export default NaverAuth;
