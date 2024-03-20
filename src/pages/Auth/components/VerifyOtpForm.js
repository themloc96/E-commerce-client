import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { Input } from '../../../components/Input';
import Timer from '../../../components/Timer';
import { verifyOptFn } from '../../../apis/auth.api';
import { getOtpFromLS, saveOtpToLS } from '../utils';

const InputText = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function VerifyOtpForm({
  isEnableCountDown,
  isVerifiedOtp,
  setIsVerifiedOtp,
  onToggleCountDown,
  isFocusOtp,
  isTimeout,
  setIsTimeout,
  isInputReset,
  setIsInputReset,
  setSignupType,
}) {
  // snackBar
  // const { enqueueSnackbar } = useSnackbar();

  // Submit Verify Form
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    setFocus,
    reset,
  } = useForm();
  // const [isDisable, setIsDisable] = useState(false);

  const watchAllFields = watch();

  // API VerifyOtp mutate
  const { mutate: verifyOtp } = useMutation(data => verifyOptFn(data), {
    onSuccess: data => {
      if (!data.status) {
        setError('otpCode', {
          type: 'serverError',
          message: '수신 받은 인증번호가 유효하지 않습니다.',
        });
        return;
      }
      if (data === '등록된 사용자 이름이 존재하지 않습니다.') {
        setError('otpCode', {
          type: 'serverError',
          message: isTimeout
            ? '입력시간이 초과되었습니다.'
            : '수신 받은 인증번호가 유효하지 않습니다.',
        });
        return;
      }
      const isMatched = String(data.status) === String(getValues('otpCode'));
      if (isMatched) {
        saveOtpToLS({ code: data.status });
        setSignupType(data.signupType);
        setIsVerifiedOtp(true);
        onToggleCountDown(false);
      } else {
        setError('otpCode', {
          type: 'serverError',
          message: isTimeout
            ? '입력시간이 초과되었습니다.'
            : '수신 받은 인증번호가 유효하지 않습니다.',
        });
      }
    },
    onError: error => {
      setIsVerifiedOtp(false);
      console.log('Something went wrong!');
      // enqueueSnackbar('Something went wrong!', {
      //   variant: 'error',
      // });
    },
  });

  const onSubmit = () => {
    const otp = getOtpFromLS();
    if (!otp?.nameOrUsername) {
      console.log('Something went wrong!');
      // enqueueSnackbar('Something went wrong!', {
      //   variant: 'error',
      // });
      return;
    }
    verifyOtp({ key: otp.nameOrUsername, phone: otp?.phone });
  };

  useEffect(() => {
    if (isFocusOtp) setFocus('otpCode');
  }, [isFocusOtp]);

  useEffect(() => {
    if (isInputReset === true) {
      reset();
      setIsInputReset(false);
    }
  }, [isInputReset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="sign-up-label">인증번호</p>
      <div className="find-id-flex !h-auto">
        <div>
          <Input
            label=""
            classes="sign-up-input"
            placeholder="인증번호 입력"
            name="otpCode"
            register={register}
            rule={{
              required: '수신 받은 인증번호가 유효하지 않습니다.',
              pattern: {
                value: /\d{6}/,
                message: '수신 받은 인증번호가 유효하지 않습니다.',
              },
            }}
            error={!!errors.otpCode}
            helperText={errors.otpCode?.message}
            disabled={isVerifiedOtp}
          />
          {isEnableCountDown && (
            <Timer
              m={1}
              onToggleCountDown={onToggleCountDown}
              isEnableCountDown={isEnableCountDown}
              isInputReset={isInputReset}
              onSetTimeout={() => {
                setError('otpCode', {
                  type: 'timeout',
                  message: '입력시간이 초과되었습니다.',
                });
                setIsTimeout(true);
                onSubmit();
              }}
            />
          )}
        </div>
        <button
          className={`${
            watchAllFields.otpCode && !isTimeout ? '!bg-black !text-white' : ''
          }`}
          disabled={!watchAllFields.otpCode || isTimeout}
        >
          확인
        </button>
      </div>
    </form>
  );
}

export default VerifyOtpForm;
