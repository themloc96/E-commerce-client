import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { signUpEmployeeFn, userIdCheckFn } from '../../apis/auth.api';
import { Input } from '../../components/Input';
import { loginType } from '../../constants';
import { snsType } from '../../constants/jsonData/auth';
import '../../styles/login/sign-up-employee.scss';
import { isEmptyObject, requestCert } from '../../utils/helpers';
import {
  getSNSLoginFromLS,
  removeSNSLoginFromLS,
} from '../../utils/localStorageSNSLogin';
import schema from './Schema/SignUpEmployee';
import VerifyBusinessNumber from './components/Employee/VerifyBusinessNumber';
import TermList from './components/TermList';
import { getErrorFromServer } from './utils';
import { terms } from './contants';

function SignUpEmployee({
  pageType = '',
  onHandleSignUpSuccess = () => {},
  onHandleOpenTerm,
}) {
  // const { enqueueSnackbar } = useSnackbar();

  const [termList, setTermList] = useState(terms);
  const [isCheckRequiredTerms, setIsCheckRequiredTerms] = useState(false);
  const [isCheckOptionalTerms, setIsCheckOptionalTerms] = useState(false);
  const [isSuccessCert, setIsSuccessCert] = useState(false);
  const [checkFlag, setCheckFlag] = useState(false);

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
    setError,
    clearErrors,
    watch,
    control,
    setValue,
    getValues,
  } = useForm({
    mode: 'all',
    defaultValues: {
      username: isSignUpWithSocial ? SNSLogin?.email : '',
      email: isSignUpWithSocial ? SNSLogin?.email : '',
      name: isSignUpWithSocial ? SNSLogin?.displayName : '',
      signupType: isSignUpWithSocial ? SNSLogin?.snsType : snsType.HOMEPAGE,
      roleType: 'ROLE_USER',
    },
    resolver: yupResolver(schema({ isSignUpWithSocial })),
  });
  const userId = watch('id');

  // API sign up mutation
  const { mutate: signUpEmployee } = useMutation(
    userData => signUpEmployeeFn(userData),
    {
      onSuccess: () => {
        onHandleSignUpSuccess(true);
        if (isSignUpWithSocial) {
          removeSNSLoginFromLS();
        }
      },
      onError: error => {
        // enqueueSnackbar('Something went wrong!', {
        //   variant: 'error',
        // });
        // eslint-disable-next-line dot-notation
        const errMessage = error?.response?.data?.message;
        const errorFromServer = getErrorFromServer(errMessage);
        if (error?.response.status === 400) {
          const { fieldName, message } = errorFromServer;
          const newFieldName = fieldName === 'username' ? 'id' : fieldName;
          setError(newFieldName, {
            type: 'serverError',
            message,
          });
        }
      },
    },
  );

  const { message } = useQuery({
    queryKey: [`v1/auth/useridcheck/${userId}`, userId],
    queryFn: () => {
      return userIdCheckFn(userId);
    },
    onSuccess: data => {
      switch (data.message) {
        case 'true':
          setCheckFlag(false);
          return true;
        case 'false':
          setCheckFlag(true);
          setError('id', {
            type: 'serverError',
            message: '이미 존재하는 아이디입니다.',
          });
          return false;
        default:
          return null;
      }
    },
    onError: error => {
      console.log(error);
      setCheckFlag(true);
      setError('id', {
        type: 'serverError',
        message: '아이디를 입력해주세요.',
      });
    },
  });

  const onSubmit = data => {
    // if (!isSuccessCert) {
    //   alert('본인 인증을 진행해주세요.');
    //   return;
    // }
    // if (isCheckRequiredTerms === false) {
    //   alert('필수 약관을 확인해주세요.');
    //   return;
    // }
    let formData = data;
    if (isSignUpWithSocial) {
      formData = {
        ...data,
        password: isSignUpWithSocial
          ? `${SNSLogin.snsType}-${SNSLogin?.email}`
          : data?.password,
        marketingConsentStatus: isCheckOptionalTerms, // 마케팅 동의 여부
      };
    } else {
      formData = {
        ...data,
        username: data?.id,
      };
    }
    if (!isEmptyObject(errors)) {
      return;
    }

    signUpEmployee({
      ...formData,
      from_referralCode: data?.phone,
      snsStatus: isSignUpWithSocial,
    });
  };

  return (
    <div className="sign-up-container join-staff-001">
      <form onSubmit={handleSubmit(onSubmit)}>
        {pageType !== loginType.SOCIAL ? (
          <>
            <p className="sign-up-label">아이디</p>
            {/* USERNAME */}
            <div>
              <Input
                label=""
                classes="sign-up-input"
                placeholder="아이디 입력"
                register={register}
                name="id"
                helperText={errors.id?.message}
                error={!!errors.id && checkFlag}
              />
            </div>
            <p className="sign-up-label">비밀번호</p>
            <p className="description-label">
              영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해 주세요.
            </p>
            <Input
              label=""
              type="password"
              classes="sign-up-input"
              placeholder="비밀번호 입력"
              register={register}
              name="password"
              helperText={errors.password?.message}
              error={!!errors.password}
            />
            <p className="sign-up-label">비밀번호 확인</p>
            <Input
              label=""
              type="password"
              classes="sign-up-input"
              placeholder="비밀번호 확인"
              register={register}
              name="passwordConfirmation"
              helperText={errors.passwordConfirmation?.message}
              error={!!errors.passwordConfirmation}
            />
          </>
        ) : (
          <Input label="" type="hidden" register={register} name="id" />
        )}
        <p className="sign-up-label">이름</p>
        <div className="find-id-flex">
          <div>
            <Input
              label=""
              classes="sign-up-input !mt-0"
              placeholder="사용자 이름"
              register={register}
              name="name"
              helperText={errors.name?.message}
              error={!!errors.name && !isSuccessCert}
              disabled
            />
          </div>
          <button
            className="black-button"
            onClick={async e => {
              e.preventDefault();
              try {
                const certed = await requestCert(window.location.href);
                setValue('name', certed.name);
                setValue('phone', certed.phone);
                setIsSuccessCert(true);
              } catch (err) {
                console.log('인증 오류');
                console.log(err);
                setIsSuccessCert(false);
              }
            }}
          >
            본인인증
          </button>
        </div>
        <p className="sign-up-label">휴대폰 번호</p>
        <Input
          label=""
          classes="sign-up-input"
          placeholder="휴대폰 번호"
          name="phone"
          register={register}
          helperText={errors.phone?.message}
          error={!!errors.phone}
          disabled
        />
        <p className="sign-up-label">이메일</p>
        <Input
          label=""
          classes="sign-up-input"
          placeholder="@이하 주소까지 모두 입력"
          register={register}
          name="email"
          helperText={errors.email?.message}
          error={!!errors.email}
          disabled={isSignUpWithSocial}
        />
        <VerifyBusinessNumber
          register={register}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
          control={control}
          watch={watch}
          setValue={setValue}
          submitCount={submitCount}
        />
        <TermList
          onHandleOpenTerm={onHandleOpenTerm}
          register={register}
          error={errors?.terms}
          fieldName="terms"
          clearErrors={clearErrors}
          setValue={setValue}
          termList={termList}
          setTermList={setTermList}
        />
        <button type="submit" className="sign-up-button sign-up-employee">
          회원가입 신청
        </button>
      </form>
    </div>
  );
}

export default SignUpEmployee;
