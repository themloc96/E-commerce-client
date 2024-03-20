import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
// COMPs
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import { Input } from '../../../../components/Input';
import UploadFile from './UploadFile';
import { checkValidBizNumber, getErrorFromServer } from '../../utils';
import { verifyBusinessNumberFn } from '../../../../apis/auth.api';

function VerifyForm(props) {
  const {
    register,
    errors,
    watch,
    setValue,
    isValidBizNumber,
    onVerify,
    setError,
    clearErrors,
    setIsValidBizNumber,
    submitCount,
  } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  // const [address, setAddress] = useState('');
  const bizNumber = watch('businessRegistrationNumber');
  const openMap = useDaumPostcodePopup(postcodeScriptUrl);

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: [`v1/auth/verify-registration-number/${bizNumber}`, bizNumber],
    queryFn: () => {
      return verifyBusinessNumberFn(bizNumber);
    },
    enabled: isEnabled && !!bizNumber,
    onSuccess: () => {
      clearErrors(['businessRegistrationNumber']);
    },
    onError: error => {
      const { message } = getErrorFromServer(error?.response?.data?.message);
      setError('businessRegistrationNumber', {
        type: 'serverError',
        message,
      });
    },
  });

  const onClickBusinessVerification = event => {
    event?.preventDefault();
    if (checkValidBizNumber(bizNumber)) {
      clearErrors('businessRegistrationNumber');
      setIsValidBizNumber(true);
      setIsEnabled(true);
      refetch();
      return;
    }
    setIsEnabled(false);
    setIsValidBizNumber(false);
    setError('businessRegistrationNumber', {
      type: 'custom',
      message: '사업자 등록번호를 확인해주세요.',
    });
  };

  useEffect(() => {
    setIsValidBizNumber(false);
  }, [bizNumber]);

  const handleCompleteDaumMap = data => {
    setValue('businessAddress', data.address);
    clearErrors('businessAddress');
  };

  return (
    <div className="sign-up-container login-join-005">
      <form
        onSubmit={e => {
          e.preventDefault();
          onVerify();
          setIsVerify(true);
        }}
      >
        <p className="sign-up-label pl-unset">사업자 등록번호</p>
        <div className="find-id-flex">
          <div>
            <Input
              pattern="[0-9]*"
              type="number"
              label=""
              classes="sign-up-input !mt-0"
              placeholder="‘-’제외한 번호를 입력해 주세요."
              register={register}
              name="businessRegistrationNumber"
              helperText={errors.businessRegistrationNumber?.message}
              error={!!errors.businessRegistrationNumber}
              onWheel={() => document.activeElement.blur()}
            />
            {isValidBizNumber && isSuccess && !isFetching && (
              <img
                alt="checkbox"
                className="checkbox-icon-input"
                src="/assets/app/checkbox.svg"
              />
            )}
            {isFetching && (
              <div className="checkbox-icon-input">
                <ClipLoader size="25px" color="#fc5000" />
              </div>
            )}
          </div>
          <button
            className={
              submitCount > 0 || bizNumber ? '!bg-black !text-white' : ''
            }
            onClick={onClickBusinessVerification}
          >
            사업자 인증
          </button>
        </div>
        <p className="sign-up-label">상호명</p>
        <Input
          label=""
          classes="sign-up-input"
          placeholder="상호명을 입력해 주세요."
          name="businessName"
          register={register}
          helperText={errors.businessName?.message}
          error={!!errors.businessName}
        />
        <p className="sign-up-label">대표자명</p>
        <Input
          label=""
          classes="sign-up-input"
          placeholder="대표자명을 입력해 주세요."
          name="businessRepresentativeName"
          register={register}
          helperText={errors.businessRepresentativeName?.message}
          error={!!errors.businessRepresentativeName}
        />
        <p className="sign-up-label">사업자 주소</p>
        <div className="find-id-flex">
          <div>
            <Input
              label=""
              classes="sign-up-input !mt-0"
              placeholder="주소"
              register={register}
              name="businessAddress"
              disabled
              helperText=""
              error={!!errors.businessAddress}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              openMap({ onComplete: handleCompleteDaumMap });
            }}
          >
            주소검색
          </button>
        </div>
        <Input
          label=""
          classes="sign-up-input mt-10"
          placeholder="상세주소"
          register={register}
          name="businessDetailedAddress"
          helperText={errors.businessDetailedAddress?.message}
          error={!!errors.businessDetailedAddress}
        />
        <input type="hidden" {...register('businessFile')} />
        <UploadFile
          submitCount={submitCount}
          onChangeFile={file => {
            setValue('businessFile', file, { shouldValidate: isVerify });
          }}
          isInvalid={!!errors.businessFile}
          setError={setError}
          clearErrors={clearErrors}
        />
        <button type="submit" className="sign-up-button">
          다음
        </button>
      </form>
    </div>
  );
}

export default VerifyForm;
