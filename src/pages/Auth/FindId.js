import { useState, useEffect } from 'react';
// notistack
import { useSnackbar } from 'notistack';

// Api
import { useMutation } from '@tanstack/react-query';
import { forgotUsernameFn } from '../../apis/auth.api';

// COMPs
import RequestSendOtpForm from './components/RequestSendOtpForm';
import VerifyOtpForm from './components/VerifyOtpForm';

// util
import { getOtpFromLS } from './utils';
import { optType } from './contants';

function FindId({ onHandleOpen = () => {} }) {
  const [isEnableCountDown, setIsEnableCountDown] = useState(false);
  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);
  const [isFocusOtp, setIsFocusOtp] = useState(false);
  const [signupType, setSignupType] = useState('');

  // snackBar
  // const { enqueueSnackbar } = useSnackbar();

  // API forgot username mutation
  const { mutate: forgotUsername } = useMutation(
    userData => forgotUsernameFn(userData),
    {
      onSuccess: () => {
        onHandleOpen(true); // Open modal change pwd successful
      },
      onError: () => {
        console.log('Something went wrong!');
        // enqueueSnackbar('Something went wrong!', {
        //   variant: 'error',
        // });
      },
    },
  );

  // const onToggleCountDown = () => {
  //   setIsEnableCountDown(prev => !prev);
  // };

  const onToggleCountDown = value => {
    setIsEnableCountDown(value);
  };

  const windowWidth = window.innerWidth;

  const handleOpenModal = () => {
    // onHandleOpen(true);
    const otp = getOtpFromLS();
    forgotUsername({
      name: otp.nameOrUsername,
      otp: otp.code,
      phone: otp?.phone,
    });
  };

  const [isTimeout, setIsTimeout] = useState(true);
  const [isInputReset, setIsInputReset] = useState(false);
  useEffect(() => {
    setIsVerifiedOtp(false);
  }, [isInputReset]);

  return (
    <div className="sign-up-container find-id-002">
      <RequestSendOtpForm
        firstLabelName="이름"
        onToggleCountDown={onToggleCountDown}
        setIsFocusOtp={setIsFocusOtp}
        otpType={optType.FIND_ID}
        isTimeout={isTimeout}
        setIsTimeout={setIsTimeout}
        isInputReset={isInputReset}
        setIsInputReset={setIsInputReset}
      />
      <VerifyOtpForm
        isEnableCountDown={isEnableCountDown}
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
        onClick={handleOpenModal}
        className={`sign-up-button sign-up-button-find-id ${
          !isVerifiedOtp || isTimeout ? '' : '!bg-primary !text-white'
        }`}
        style={{ marginTop: windowWidth >= 600 ? 88 : 42 }}
        disabled={!isVerifiedOtp || isTimeout}
      >
        아이디 찾기
      </button>
    </div>
  );
}

export default FindId;
