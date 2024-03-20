import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { Controller } from 'react-hook-form';

import { Input } from '../../../../components/Input';
import { withDebounce } from '../../../../utils/helpers';
import { verifyBusinessNumberFn } from '../../../../apis/auth.api';

export default function VerifyBusinessNumber({
  register,
  errors,
  setError,
  clearErrors,
  control,
  watch,
  setValue,
  submitCount,
}) {
  const bizNumber = watch('businessRegistrationNumber');
  // query: verify biz number
  /**
   * If the server response the error message existed, We will rely on isError to check
   * if the biz number is valid or not
   * isError = true is existed and otherwise
   */
  const { isError, isFetching, refetch } = useQuery({
    queryKey: [`v1/auth/verify-registration-number/${bizNumber}`, bizNumber],
    queryFn: () => {
      return verifyBusinessNumberFn(bizNumber);
    },
    enabled: !!bizNumber,
    onSuccess: () => {
      setError('businessRegistrationNumber', {
        type: 'serverError',
        message: '등록되지 않은 사업자 등록번호입니다.',
      });
    },
    onError: () => {
      clearErrors(['businessRegistrationNumber']);
    },
  });

  useEffect(() => {
    if (submitCount > 0 && bizNumber) {
      refetch();
    }
  }, [submitCount, bizNumber]);
  return (
    <>
      <p className="sign-up-label">사업자 등록번호</p>
      <div style={{ position: 'relative' }}>
        <Controller
          name="businessRegistrationNumber"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              label=""
              type="number"
              pattern="[0-9]*"
              classes="sign-up-input"
              placeholder="사업자등록 번호를 입력해 주세요."
              register={register}
              name="businessRegistrationNumber"
              helperText={errors.businessRegistrationNumber?.message}
              error={!!errors.businessRegistrationNumber}
              // onChange={withDebounce(event => onChange(event.target.value))}
              onWheel={() => document.activeElement.blur()}
            />
          )}
        />
        {isError && (
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
    </>
  );
}
