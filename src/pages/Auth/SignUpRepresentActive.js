import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// COMPs
// SERVICEs
import { signUpBusinessFn } from '../../apis/auth.api';
// CONSTANTs
import { loginType } from '../../constants';
import { snsType } from '../../constants/jsonData/auth';
// STYLEs
import '../../styles/login/sign-up-representive.scss';

import {
  getSNSLoginFromLS,
  removeSNSLoginFromLS,
} from '../../utils/localStorageSNSLogin';
import schema from './Schema/SignUpRepresentActive';
import SignUpForm from './components/RepresentActive/SignUpForm';
import VerifyForm from './components/RepresentActive/VerifyForm';
import { checkValidBizNumber, getErrorFromServer } from './utils';
import { terms } from './contants';

function SignUpRepresentActive({
  pageType = '',
  onHandleOpenTerm = () => {},
  onHandleSignUpSuccess = () => {},
}) {
  const [isVerifiedRep, setIsVerifiedRep] = useState(false);
  const [isValidBizNumber, setIsValidBizNumber] = useState(false);
  const [termList, setTermList] = useState(terms);
  const [isCheckRequiredTerms, setIsCheckRequiredTerms] = useState(false);
  const [isCheckOptionalTerms, setIsCheckOptionalTerms] = useState(false);
  const [isSuccessCert, setIsSuccessCert] = useState(false);

  useEffect(() => {
    const checkRequiredTerms = termList
      .filter(item => item.isRequired === true)
      .every(item => item.checked === true);
    const checkOptionalTerms = termList
      .filter(item => item.isRequired === false)
      .every(item => item.checked === true);

    setIsCheckRequiredTerms(checkRequiredTerms);
    setIsCheckOptionalTerms(checkOptionalTerms);
  }, [termList]);

  // SNS local storage
  const SNSLogin = getSNSLoginFromLS();
  const isSignUpWithSocial = pageType === loginType.SOCIAL;

  // Submit Sign up Form
  const {
    register,
    formState: { errors, submitCount },
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      username: isSignUpWithSocial ? SNSLogin?.email : '',
      email: isSignUpWithSocial ? SNSLogin?.email : '',
      name: isSignUpWithSocial ? SNSLogin?.displayName : '',
      signupType: isSignUpWithSocial ? SNSLogin?.snsType : snsType.HOMEPAGE,
    },
    resolver: yupResolver(schema({ isVerifiedRep, isSignUpWithSocial })),
  });

  // API sign up mutation
  const { mutate: signUpBusiness } = useMutation(
    userData => signUpBusinessFn(userData),
    {
      onSuccess: () => {
        if (isSignUpWithSocial) {
          removeSNSLoginFromLS();
        }
        onHandleSignUpSuccess(true);
      },
      onError: error => {
        console.log('Something went wrong!');
        // enqueueSnackbar('Something went wrong!', {
        //   variant: 'error',
        // });
        const errMessage = error?.response?.data?.message;
        const errorFromServer = getErrorFromServer(errMessage);
        if (error?.response.status === 400) {
          const { fieldName, message } = errorFromServer;
          setError(fieldName, {
            type: 'serverError',
            message,
          });
        }
      },
    },
  );

  const onVerify = handleSubmit(() => {
    if (!isValidBizNumber) {
      setError('businessRegistrationNumber', {
        type: 'custom',
        message: '사업자 등록번호를 확인해주세요.',
      });
      return;
    }
    clearErrors('businessRegistrationNumber');
    setIsValidBizNumber(true);
    setIsVerifiedRep(true);
  });

  const onSubmit = handleSubmit(data => {
    // if (!isSuccessCert) {
    //   alert('본인 인증을 진행해주세요.');
    //   return;
    // }
    // if (!isCheckRequiredTerms) {
    //   alert('필수 약관을 확인해주세요.');
    //   return;
    // }
    const formData = {
      id: 1,
      ...data,
      password: isSignUpWithSocial
        ? `${SNSLogin.snsType}-${SNSLogin?.email}`
        : data?.password,
      businessAddress: data?.businessAddress,
      businessDetailedAddress: data?.businessDetailedAddress,
      from_referralCode: data?.phone,
      businessPhone: data?.phone,
      roleType: 'ROLE_USER',
      snsStatus: isSignUpWithSocial,
      marketingConsentStatus: isCheckOptionalTerms, // 마케팅 동의 여부
    };
    if (isSignUpWithSocial) {
      formData.snsType = SNSLogin?.snsType;
    }
    signUpBusiness(formData);
  });

  return isVerifiedRep ? (
    <SignUpForm
      onSubmit={onSubmit}
      isSignUpWithSocial={isSignUpWithSocial}
      register={register}
      errors={errors}
      pageType={pageType}
      setError={setError}
      clearErrors={clearErrors}
      onHandleOpenTerm={onHandleOpenTerm}
      setValue={setValue}
      watch={watch}
      submitCount={submitCount}
      termList={termList}
      setTermList={setTermList}
      isSuccessCert={isSuccessCert}
      setIsSuccessCert={setIsSuccessCert}
    />
  ) : (
    <VerifyForm
      register={register}
      errors={errors}
      watch={watch}
      setValue={setValue}
      isValidBizNumber={isValidBizNumber}
      onVerify={onVerify}
      setError={setError}
      clearErrors={clearErrors}
      setIsValidBizNumber={setIsValidBizNumber}
      submitCount={submitCount}
    />
  );
}

export default SignUpRepresentActive;
