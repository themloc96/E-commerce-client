import { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import signInStyles from '../../styles/login/sign-in.scss';

import { reducer } from '../../utils/Reducer';
import { IndCheckbox } from '../../components/WTable/IndCheckbox';
import { loginUserFn } from '../../apis/auth.api';
import { DEFAULT_URL } from '../../constants/AppConfig';
import { useAuthContext } from '../../contexts/AuthProvider';
import { Input } from '../../components/Input';
import * as LS from '../../utils/localStorageUserProfile';
import { tokenLifeTime } from '../../constants/jsonData/auth';

function SignIn() {
  const [isAutoLogin, setIsAutoLogin] = useState();
  const [viewType, setViewType] = useState('password');
  const authCtx = useAuthContext();
  const navigate = useNavigate();
  const userProfile = LS.getUserProfileFromLS();
  const width = window.innerWidth;

  // Submit Login Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      username: userProfile?.username,
    },
  });

  // API login mutation
  const { mutate: loginUser } = useMutation(userData => loginUserFn(userData), {
    onSuccess: data => {
      console.log('login success');
      const expiredTime = isAutoLogin
        ? tokenLifeTime.ONE_WEEK
        : tokenLifeTime.DEFAULT;
      const payload = {
        accessToken: data?.token,
        expiredTime,
      };

      const mobileType = navigator.userAgent.toLowerCase();
      console.log('user agent : ', mobileType);

      if (mobileType.includes('raonark_android')) {
        window.raonark.fcmTokenSend(data.username);
      } else if (
        mobileType.includes('raonark_iphone') ||
        mobileType.includes('raonark_ipad') ||
        mobileType.includes('raonark_ipod')
      ) {
        if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.fcmTokenSend
        ) {
          window.webkit.messageHandlers.fcmTokenSend.postMessage(data.username);
        } else {
          console.log('window.webkit : ', window.webkit);
          console.log(
            'window.webkit.messageHandlers : ',
            window.webkit.messageHandlers,
          );
          console.log(
            'window.webkit.messageHandlers.fcmTokenSend : ',
            window.webkit.messageHandlers.fcmTokenSend,
          );
        }
      }
      authCtx.dispatch({ type: 'LOGIN_USER', payload });
      navigate(DEFAULT_URL);
    },
    onError: error => {
      const errMessage = error?.response?.data?.message;
      if (errMessage.includes('Wrong Username')) {
        setError('username', {
          type: 'serverError',
          message: '아이디를 확인해 주세요.',
        });
        setError('password', {
          type: 'serverError',
          message: '비밀번호를 확인해 주세요.',
        });
      }
      if (errMessage.includes('Wrong Password')) {
        setError('password', {
          type: 'serverError',
          message: '비밀번호를 확인해 주세요.',
        });
      }
      if (errMessage.includes('Member is waiting for approval')) {
        alert('승인되지 않은 사용자입니다.');
      }
    },
  });

  const onSubmit = data => {
    loginUser(data);
  };
  const handleCheckSavingUsername = e => {
    const username = watch('username');

    if (e?.target?.checked && username) {
      LS.saveUserProfileToLS({
        username,
      });
    } else {
      LS.removeUsernameFromLS();
    }
  };
  const handleCheckRememberMe = e => {
    const username = watch('username');
    const pwd = watch('password');
    if (e?.target?.checked && username && pwd) {
      setIsAutoLogin(true);
    } else {
      setIsAutoLogin(false);
    }
  };

  const handleCheckDeleteValue = () => {
    document.getElementById('username').value = '';
  };

  // const renderImage = () => {
  //   if (width <= 767 && viewType === 'text')
  //     // a small visible icon
  //     return <img alt="viewImage2" src="/assets/icons/pw_view_icon_2.png" />;
  //   if (width <= 767 && viewType === 'password')
  //     // an invisible little icon
  //     return <img alt="viewImage1" src="/assets/icons/pw_view_icon.png" />;
  //   if (width > 767 && viewType === 'text')
  //     // an big invisible icon
  //     return <img alt="viewImage4" src="/assets/icons/pw_view_icon_2@2x.png" />;
  //   // big invisible icon
  //   return <img alt="viewImage3" src="/assets/icons/pw_view_icon@2x.png" />;
  // };

  const handleCheckViewType = () => {
    if (viewType === 'password') setViewType('text');
    if (viewType === 'text') setViewType('password');
    // renderImage();
  };

  const handleOnKeyPress = e => {
    if (e.key === 'Enter' || e.code === 'Enter' || e.which === 13) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="sign-up-container login-001 mt-[60px] md:mt-[58px]">
      <p className="sign-up-label md:!mb-[16px]">아이디</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyPress={e => handleOnKeyPress(e)}
      >
        <div className="input-div">
          <Input
            id="username"
            label=""
            register={register}
            name="username"
            rule={{
              required: '아이디를 확인해 주세요.',
            }}
            classes="sign-up-input"
            placeholder="아이디를 입력해 주세요."
            error={!!errors.username}
            helperText={errors.username?.message}
            isActionDelete
            onHandleDeleteValue={handleCheckDeleteValue}
          />
          {/* <button onClick={() => handlCheckDeleteValue()} type="button">
            {width > 767 ? (
              <img
                alt="deleteImage"
                className="icon-delete"
                src="/assets/icons/close_16px@2x.png"
              />
            ) : (
              <img alt="deleteImage" src="/assets/icons/close_16px.png" />
            )}
          </button> */}
        </div>
        <p className="sign-up-label password-title">비밀번호</p>
        <div className="input-div">
          <Input
            id="password"
            label=""
            type={viewType}
            register={register}
            name="password"
            rule={{
              required: '비밀번호를 확인해 주세요.',
            }}
            classes="mt-[3px] sign-up-input"
            placeholder="비밀번호를 입력해 주세요."
            error={!!errors.password}
            helperText={errors.password?.message}
            isActionShowPwd
            onHandleCheckViewType={handleCheckViewType}
            viewType={viewType}
          />
          {/* <button
            type="button"
            className="view-button"
            onClick={() => handlCheckViewType()}
          >
            {renderImage()}
          </button> */}
        </div>
        <div className="sign-up-checkbox !mt-[13px] md:!mt-[15px]">
          <div className="mr-[20px] md:mr-[22px]">
            <IndCheckbox
              className="!h-[22px] !w-[22px] mr-[7px] md:mr-[12px] leading-none"
              id="자동로그인"
              type="checkbox"
              value="value1"
              onChange={handleCheckRememberMe}
            />
            <label className="text-sm md:text-lg" htmlFor="자동로그인">
              자동로그인
            </label>
          </div>
          <div>
            <IndCheckbox
              className="!h-[22px] !w-[22px] mr-[7px] md:mr-[10px] leading-none"
              id="아이디저장"
              type="checkbox"
              value="value1"
              onChange={handleCheckSavingUsername}
            />
            <label className="text-sm md:text-lg" htmlFor="아이디저장">
              아이디저장
            </label>
          </div>
        </div>
        <button type="submit" className="sign-up-button">
          로그인
        </button>
      </form>
      <div className="under-sign-up-button">
        <Link to="/find-id">
          <button className="left-button">아이디 찾기</button>
        </Link>
        <div className="h-line" />
        <Link to="/find-password">
          <button className="center-button">비밀번호 찾기</button>
        </Link>
        <div className="h-line" />
        <Link to="/sign-up">
          <button className="right-button">회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
