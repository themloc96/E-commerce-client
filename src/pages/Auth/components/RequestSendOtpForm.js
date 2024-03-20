import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';

import { requestSendOtpFn } from '../../../apis/auth.api';
import { Input } from '../../../components/Input';
import { saveOtpToLS } from '../utils';

function RequestSendOtpForm({
  firstLabelName,
  firstPlaceholder = '사용자 이름을 입력해주세요.',
  onToggleCountDown,
  setIsFocusOtp,
  otpType,
  isTimeout,
  setIsTimeout,
  isInputReset,
  setIsInputReset,
}) {
  // Submit Find Id Form
  const {
    register,
    watch,
    formState: { errors, submitCount },
    handleSubmit,
    setError,
  } = useForm();
  // const [isDisable, setIsDisable] = useState(false);
  const watchAllFields = watch();

  // API login mutation
  const { mutate: requestSendOtp } = useMutation(
    data => requestSendOtpFn(data),
    {
      onSuccess: () => {
        onToggleCountDown(false);
        onToggleCountDown(true);
        setIsFocusOtp(true);
      },
      onError: err => {
        const errorMessage = err.response.data.message;
        if (
          errorMessage === 'Username is not correct' ||
          errorMessage === 'Name is not correct'
        ) {
          setError('nameOrUsername', {
            type: 'serverError',
            message: '사용자 정보를 확인해주세요.',
          });
        } else if (errorMessage === "Phone doesn't exist in DB") {
          setError('phone', {
            type: 'serverError',
            message: '사용자 정보를 확인해주세요.',
          });
        }
      },
    },
  );
  const onSubmit = data => {
    saveOtpToLS({ nameOrUsername: data?.nameOrUsername, phone: data?.phone });
    requestSendOtp({ ...data, type: otpType });
    setIsTimeout(false);
    setIsInputReset(true);
  };

  // const onChange = (e) => {
  //   if (e.target.value.length > 0) {
  //     setIsDisable(true);
  //   } else {
  //     setIsDisable(false);
  //   }
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="sign-up-label sign-up-label-name">{firstLabelName}</p>
      <Input
        label=""
        classes="sign-up-input"
        placeholder={firstPlaceholder}
        rule={{
          required: '사용자 정보를 확인해주세요.',
        }}
        name="nameOrUsername"
        register={register}
        error={!!errors.nameOrUsername}
        helperText={errors.nameOrUsername?.message}
      />
      <p className="sign-up-label">휴대폰 번호</p>
      <div className="find-id-flex">
        <div>
          <Input
            // onChange={onChange}
            label=""
            classes="sign-up-input"
            placeholder="휴대폰번호 입력 ('-' 제외)"
            rule={{
              required: '사용자 정보를 확인해주세요.',
            }}
            name="phone"
            inputMode="numeric"
            inputProps={{ inputMode: 'numeric' }}
            register={register}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </div>
        <button
          className={`${
            submitCount || watchAllFields.phone ? '!bg-black !text-white' : ''
          }`}
          type="submit"
          disabled={!watchAllFields.phone}
        >
          인증번호 전송
        </button>
      </div>
    </form>
  );
}

export default RequestSendOtpForm;
