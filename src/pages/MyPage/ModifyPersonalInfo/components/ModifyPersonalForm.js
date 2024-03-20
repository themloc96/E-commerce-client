import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '../../../../components/Input';
import Button from '../../../../components/Button';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PASSWORD_REGEX_CHANGE,
} from '../../../../constants/form/validations';
import { useAuthContext } from '../../../../contexts/AuthProvider';
import { changePasswordFn, updateUserInfoFn } from '../../../../apis/user.api';
import { checkPasswordFn } from '../../../../apis/auth.api';

function ModifyPersonalForm() {
  const { state } = useAuthContext();
  const { currentUser } = state;

  // Submit Forgot password Form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    getValues,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        oldPassword: yup
          .string()
          .required(() => '이전 비밀번호를 입력하세요.')
          // .required(
          //   () => '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해 주세요.',
          // )
          .matches(
            PASSWORD_REGEX,
            '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
          ),
        // .oneOf([yup.ref('newPassword'), null], '비밀번호를 확인해 주세요'),
        newPassword: yup
          .string()
          // .required(
          //   () => '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해 주세요.',
          // )
          .matches(
            PASSWORD_REGEX_CHANGE,
            '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.',
          ),
        passwordConfirmation: yup
          .string()
          // .required(
          //   () => '영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해 주세요.',
          // )
          .oneOf([yup.ref('newPassword'), null], '비밀번호를 확인해 주세요'),
        email: yup
          .string()
          .email('이메일 정보를 확인해 주세요.')
          .matches(EMAIL_REGEX, '이메일 정보를 확인해 주세요.'),
      }),
    ),
  });
  // API change password mutation
  const { mutate: updateUserInfo } = useMutation(
    userData => updateUserInfoFn(userData),
    {
      onSuccess: () => {
        alert('개인정보 수정이 완료되었습니다.');
        // enqueueSnackbar('비밀번호 변경이 완료되었습니다.', {
        //   variant: 'success',
        // });
        setTimeout(() => {
          // 이동할 URL을 지정합니다.
          const newUrl = '/my-page#account';
          // 페이지를 이동합니다.
          window.location.href = newUrl;
        }, 1000);
      },
    },
  );

  // API change password mutation
  const { mutate: changePassword } = useMutation(
    userData => changePasswordFn(userData),
    {
      onSuccess: data => {
        updateUserInfo({
          email: getValues()?.email || currentUser?.email,
        });
      },
      onError: error => {
        const errMessage = error?.response?.data?.message;
        const typeErrs = Object.keys(error?.response?.data);

        if (
          error?.response.status === 400 &&
          ((!!errMessage &&
            errMessage.includes('Old password is incorrect.')) ||
            typeErrs.includes('oldPassword'))
        ) {
          alert('기존 비밀번호가 일치하지 않습니다.');
          setError('oldPassword', {
            type: 'serverError',
            message: '비밀번호를 확인해주세요',
          });
        }
      },
    },
  );

  const { mutate: checkPassword } = useMutation(
    userData => checkPasswordFn(userData),
    {
      onSuccess: () => {
        updateUserInfo({
          email: getValues()?.email || currentUser?.email,
        });
      },
      onError: () => {
        alert('기존 비밀번호가 일치하지 않습니다.');
        setError('oldPassword', {
          type: 'serverError',
          message: '비밀번호를 확인해주세요',
        });
      },
    },
  );

  useEffect(() => {
    reset({
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    });
  }, [currentUser]);

  const onSubmit = data => {
    if (data.newPassword === '') {
      // updateUserInfo({
      //   email: data?.email || currentUser?.email,
      // });
      checkPassword({ password: data?.oldPassword });
    } else if (data?.newPassword === data?.oldPassword) {
      alert('기존 비밀번호와 동일합니다.');
    } else {
      changePassword({
        oldPassword: data?.oldPassword,
        newPassword: data?.newPassword,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="heading-wrap">
        <h3 className="f32Medium text-secondary4">개인정보 수정</h3>
      </div>
      <div className="motify-form flex flex-col gap-[20px] lg:gap-[22px]">
        <div className="flex-1 user-account">
          <Input
            label="아이디"
            name="username"
            register={register}
            type="text"
            disabled
          />
        </div>
        <div className="flex-1">
          <Input
            name="oldPassword"
            label="기존 비밀번호"
            placeholder="비밀번호 입력"
            sublabel="영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해 주세요."
            type="password"
            helperText={errors.oldPassword?.message}
            error={!!errors.oldPassword}
            register={register}
          />
        </div>
        <div className="flex-1">
          <Input
            name="newPassword"
            label="새 비밀번호"
            placeholder="비밀번호 확인"
            type="password"
            helperText={errors.newPassword?.message}
            error={!!errors.newPassword}
            register={register}
          />
        </div>
        <div className="flex-1">
          <Input
            name="passwordConfirmation"
            label="새 비밀번호 확인"
            placeholder="새 비밀번호 확인"
            type="password"
            helperText={errors.passwordConfirmation?.message}
            error={!!errors.passwordConfirmation}
            register={register}
          />
        </div>
        <div className="flex-1 flex justify-between items-end gap-3 lg:gap-[10px]">
          <div className="flex-1">
            <Input name="name" label="이름" register={register} disabled />
          </div>
          <div className="w-[90px] lg:w-[154.3px]">
            <Button
              disabled
              fullWidth
              className="identity-verification-btn"
              variant=""
            >
              <span>본인인증</span>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Input
            label="휴대폰 번호"
            name="phone"
            register={register}
            type="text"
            disabled
          />
        </div>
        <div className="flex-1 flex-email">
          <Input
            name="email"
            register={register}
            label="이메일"
            type="text"
            helperText={errors.email?.message}
            error={!!errors.email}
          />
        </div>
      </div>
      <Button
        fullWidth
        className="modify-personal-submit-btn"
        variant="secondary"
      >
        <span>회원정보 변경</span>
      </Button>
    </form>
  );
}

ModifyPersonalForm.propTypes = {};

export default ModifyPersonalForm;
