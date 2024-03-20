import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { forgotPasswordFn } from '../../apis/auth.api';
import { Input } from '../../components/Input';
import { PASSWORD_REGEX } from '../../constants/form/validations';
import RequestSendOtpForm from './components/RequestSendOtpForm';
import VerifyOtpForm from './components/VerifyOtpForm';
import { getOtpFromLS } from './utils';
import { optType } from './contants';

function FindPassWord({
  onHandleChangePasswordSuccess = () => {},
  onHandleVerifiedPassWord = () => {},
}) {
  const navigate = useNavigate();
  const [isEnableCountDown, setIsEnableCountDown] = useState(false);
  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);
  const [isOpenChangePwdForm, setIsOpenChangePwdForm] = useState(false);
  const [isFocusOtp, setIsFocusOtp] = useState(false);

  const [isTimeout, setIsTimeout] = useState(true);
  const [isInputReset, setIsInputReset] = useState(false);
  const [signupType, setSignupType] = useState('');
  // const onToggleCountDown = () => {
  //   const status = !isEnableCountDown
  //   if(status){
  //     setIsVerifiedOtp(false)
  //   }
  //   setIsEnableCountDown(status);
  // };

  // const onToggleCountDown = () => {
  //   setIsEnableCountDown(prev => !prev);
  // };

  const onToggleCountDown = value => {
    setIsEnableCountDown(value);
  };

  // snackBar
  // const { enqueueSnackbar } = useSnackbar();

  // API forgot password mutation
  const { mutate: forgotPassword } = useMutation(
    userData => forgotPasswordFn(userData),
    {
      onSuccess: data => {
        onHandleChangePasswordSuccess(true); // Open modal change pwd successful
      },
      onError: () => {
        console.log('Something went wrong!');
        // enqueueSnackbar('Something went wrong!', {
        //   variant: 'error',
        // });
      },
    },
  );

  // Submit Forgot pwd Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        password: yup
          .string()
          .required(
            () =>
              '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
          )
          .matches(
            PASSWORD_REGEX,
            '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
          ),
        passwordConfirmation: yup
          .string()
          .required(
            () =>
              '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
          )
          .oneOf([yup.ref('password'), null], '비밀번호를 확인해주세요.'),
      }),
    ),
  });

  const onSubmit = data => {
    const otp = getOtpFromLS();
    forgotPassword({
      newPassword: data.password,
      username: otp.nameOrUsername,
      otp: otp.code,
    });
  };

  useEffect(() => {
    setIsVerifiedOtp(false);
  }, [isInputReset]);

  return isOpenChangePwdForm ? (
    <div className="sign-up-container password-005">
      {signupType !== 'HOMEPAGE' ? (
        <div>
          <p style={{ fontSize: '18px' }}>
            소셜 계정은 라오나크 내에서는 비밀번호 변경이 불가능합니다. 따라서
            해당 소셜 플랫폼 사이트(구글, 카카오, 네이버,애플) 에 접속하신 후
            비밀번호를 변경하셔야 합니다.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="lg:!mt-[85px] sign-up-button active"
          >
            로그인 페이지 이동하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="sign-up-label mt-595" style={{ marginTop: 59.5 }}>
            새 비밀번호
          </p>
          <p className="description-label pl-[9px] md:pl-0">
            영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해 주세요.
          </p>
          <Input
            label=""
            type="password"
            classes="sign-up-input"
            placeholder="새 비밀번호를 입력해주세요."
            register={register}
            name="password"
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
          <p className="sign-up-label">새 비밀번호 확인</p>
          <Input
            label=""
            type="password"
            classes="sign-up-input"
            placeholder="새 비밀번호를 확인해 주세요."
            register={register}
            name="passwordConfirmation"
            error={!!errors.passwordConfirmation}
            helperText={errors?.passwordConfirmation?.message}
          />
          <button type="submit" className="sign-up-button">
            확인
          </button>
        </form>
      )}
    </div>
  ) : (
    <div className="sign-up-container find-id-002 mt-[-1px]">
      <RequestSendOtpForm
        firstLabelName="아이디"
        onToggleCountDown={onToggleCountDown}
        firstPlaceholder="아이디를 입력해주세요."
        setIsFocusOtp={setIsFocusOtp}
        otpType={optType.FIND_PASSWORD}
        isTimeout={isTimeout}
        setIsTimeout={setIsTimeout}
        isInputReset={isInputReset}
        setIsInputReset={setIsInputReset}
      />
      <VerifyOtpForm
        isEnableCountDown={isEnableCountDown}
        // setIsEnableCountDown={setIsEnableCountDown}
        onToggleCountDown={onToggleCountDown}
        setIsVerifiedOtp={setIsVerifiedOtp}
        isVerifiedOtp={isVerifiedOtp}
        isFocusOtp={isFocusOtp}
        isTimeout={isTimeout}
        setIsTimeout={setIsTimeout}
        isInputReset={isInputReset}
        setIsInputReset={setIsInputReset}
        setSignupType={setSignupType}
      />
      <button
        onClick={() => setIsOpenChangePwdForm(true)}
        className={`lg:!mt-[85px] sign-up-button ${
          isVerifiedOtp ? 'active' : ''
        }`}
        disabled={!isVerifiedOtp || isTimeout}
      >
        비밀번호 변경하기
      </button>
    </div>
  );
}

export default FindPassWord;
