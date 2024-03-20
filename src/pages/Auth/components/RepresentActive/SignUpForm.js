import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { Input } from '../../../../components/Input';
import { loginType } from '../../../../constants';
import { requestCert, withDebounce } from '../../../../utils/helpers';
import TermList from '../TermList';
import { verifyReferralCodeFn, userIdCheckFn } from '../../../../apis/auth.api';
import { useQueryParams } from '../../../../hooks/useQueryParams';

function SignUpForm(props) {
  const {
    onSubmit,
    isSignUpWithSocial,
    register,
    errors,
    pageType,
    setError,
    clearErrors,
    onHandleOpenTerm,
    setValue,
    watch,
    submitCount,
    termList,
    setTermList,
    isSuccessCert,
    setIsSuccessCert,
  } = props;
  const { filterParamsObj } = useQueryParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [referralCode, setReferralCode] = useState();
  const [checkFlag, setCheckFlag] = useState(false);
  const userId = watch('username');

  useEffect(() => {
    const param1 = params.get('recommendation');
    if (param1) setReferralCode(param1);
  }, [params]);

  const { isFetching, data, refetch } = useQuery({
    queryKey: [`v1/auth/referaalcodecheck/${referralCode}`, referralCode],
    queryFn: () => {
      return verifyReferralCodeFn(referralCode);
    },
    enabled: !!referralCode,
    onSuccess: response => {
      if (!response) {
        setError('referralCode', {
          type: 'errorFromServer',
          message: '사용할 수 없는 코드입니다.',
        });
      } else {
        clearErrors('referralCode');
        setValue('referralCode', referralCode);
      }
    },
  });

  const { message } = useQuery({
    queryKey: [`v1/auth/useridcheck/${userId}`, userId],
    queryFn: () => {
      return userIdCheckFn(userId);
    },
    onSuccess: _data => {
      switch (_data.message) {
        case 'true':
          setCheckFlag(false);
          return true;
        case 'false':
          setCheckFlag(true);
          setError('username', {
            type: 'serverError',
            message: '이미 존재하는 아이디입니다.',
          });
          return false;
        default:
          return null;
      }
    },
    onError: error => {
      console.log(`v1/auth/useridcheck/${userId} fail`);
      console.log(error);
      setCheckFlag(true);
      setError('username', {
        type: 'serverError',
        message: '아이디를 입력해주세요.',
      });
    },
  });

  useEffect(() => {
    if (filterParamsObj && filterParamsObj.referralCode) {
      console.log(referralCode);
      setReferralCode(filterParamsObj.referralCode);
    }
  }, [filterParamsObj]);

  // when submit button clicked then refetch api verify referralCode
  useEffect(() => {
    if (submitCount > 0 && referralCode) {
      refetch();
    }
  }, [submitCount, referralCode]);

  return (
    <div className="sign-up-container join-ceo-005">
      <form onSubmit={onSubmit}>
        {!isSignUpWithSocial ? (
          <>
            <p className="sign-up-label">아이디</p>
            <Input
              label=""
              classes="sign-up-input"
              placeholder="아이디 입력"
              register={register}
              name="username"
              helperText={errors.username?.message}
              error={!!errors.username && checkFlag}
              // onChange={e => setUserName(e.target.value)}
            />
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
          <Input label="" type="hidden" register={register} name="username" />
        )}
        <p className="sign-up-label">이름</p>
        <div className="find-id-flex">
          <div>
            <Input
              label=""
              classes="sign-up-input !mt-0"
              placeholder={
                pageType !== loginType.SOCIAL ? '사용자 이름' : '이름 입력'
              }
              register={register}
              name="name"
              helperText={errors.name?.message}
              error={!!errors.name && !isSuccessCert}
              disabled
            />
          </div>
          <button
            className="black-button"
            type="button"
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
        <p className="sign-up-label">추천인 코드</p>
        <div style={{ position: 'relative' }}>
          <Input
            label=""
            type="number"
            pattern="[0-9]*"
            classes="sign-up-input"
            placeholder="추천인의 휴대폰 번호 입력"
            register={register}
            name="referralCode"
            helperText={errors.referralCode?.message}
            error={!!errors.referralCode}
            onChange={withDebounce(event =>
              setReferralCode(event.target.value),
            )}
            defaultValue={referralCode}
          />
          {data && (
            <img
              alt="checkbox"
              className="checkbox-icon-input"
              src="/assets/app/checkbox.svg"
            />
          )}
          {isFetching && (
            <ClipLoader
              size="25px"
              className="checkbox-icon-input"
              color="#fc5000"
            />
          )}
        </div>
        <TermList
          error={errors.termList}
          clearErrors={clearErrors}
          setValue={setValue}
          onHandleOpenTerm={onHandleOpenTerm}
          fieldName="termList"
          termList={termList}
          setTermList={setTermList}
        />
        <button className="sign-up-button">회원가입 신청</button>
      </form>
    </div>
  );
}

export default SignUpForm;
