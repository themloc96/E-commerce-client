import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
// COMPs
import Button from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import WCollapseBox from '../../../../components/WCard/WCollapseBox';
import { useAuthContext } from '../../../../contexts/AuthProvider';
import { formatShortDate } from '../../../../utils/helper.dateTime';
import InputModel from '../../InstallationProducts/InputModel';
import schema from '../../schema';
import InstallationDate from './InstallationDate';
import UploadFile from './UploadFile';

function EditCustomerForm({ customer, updateCustomer, isLoading }) {
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;

  const {
    clientDetailAddress,
    clientPhone,
    clientSecondPhone,
    clientAddress,
    clientPostNumber,
    clientNote,
    productSerial,
    installationDate,
    installationImage,
    clientName,
    clientNumber,
    product,
  } = customer;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema()),
  });

  const openMap = useDaumPostcodePopup(postcodeScriptUrl);
  const handleCompleteDaumMap = data => {
    const { zonecode, address } = data;
    setValue('clientPostNumber', zonecode);
    setValue('clientAddress', address);
  };

  useEffect(() => {
    reset({
      ...customer,
      installationImage: customer?.installationImage.split('/').pop(),
      installationDate: formatShortDate(installationDate),
      modelName: product?.modelName,
      productId: product?.id,
      businessId: businessInfo?.id,
    });
  }, [customer, product, businessInfo]);

  const onSubmit = data => {
    updateCustomer({
      ...data,
      installationDate: `${formatShortDate(
        data?.installationDate,
      )}T00:00:00.000Z`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="customer-content">
        <WCollapseBox
          className="md:mb-[86px] mb-[28px]"
          title="고객 정보"
          isOpenCollapse
        >
          <div className="customer-info">
            <div className="mb-[12px] flex gap-[12px] md:gap-[10px] flex-wrap flex-col md:flex-row">
              <div className="flex items-center md:flex-col md:items-start customer-label-input">
                <label
                  className="flex-1 mb-[2px] md:flex-none"
                  htmlFor="고객번호"
                >
                  고객번호
                </label>
                <Input
                  classes="!w-[187px] md:!w-[193.5px] h-[35px] md:h-[60px] !mt-0 md:!mt-2 !bg-[#e7e8ea] !border-0"
                  label=""
                  name="clientNumber"
                  type="text"
                  // value="233021-00001"
                  register={register}
                  disabled
                />
              </div>
              <div
                className={`flex md:flex-col md:items-start customer-label-input${
                  errors.clientName ? '' : ' items-center'
                }`}
              >
                <label
                  className="flex-1 mb-[2px] md:flex-none md:ml-[2px] md:pt-[0px] pt-[15px]"
                  htmlFor="고객명"
                >
                  고객명
                </label>
                <Input
                  classes="!w-[187px] md:!w-[193.5px] h-[35px] md:h-[60px] !mt-0 md:!mt-2 !text-opacity-0"
                  label=""
                  name="clientName"
                  type="text"
                  defaultValue="홍범영"
                  helperText={errors.clientName?.message}
                  error={!!errors.clientName}
                  register={register}
                />
              </div>
              <div
                className={`flex md:flex-col md:items-start min-content customer-label-input${
                  errors.clientPhone ? '' : ' items-center'
                }`}
              >
                <label
                  className="flex-1 mb-[2px] md:flex-none md:pt-[0px] pt-[15px]"
                  htmlFor="고객명"
                >
                  휴대전화
                </label>
                <Input
                  classes="!w-[187px] md:!w-[193.5px] h-[35px] md:h-[60px] !mt-0 md:!mt-2"
                  label=""
                  name="clientPhone"
                  type="text"
                  defaultValue="01033371363"
                  helperText={errors.clientPhone?.message}
                  error={!!errors.clientPhone}
                  register={register}
                />
              </div>
              <div className="flex items-center md:flex-col md:items-start customer-label-input">
                <label
                  className="flex-1 mb-[2px] md:flex-none"
                  htmlFor="고객명"
                >
                  전화번호
                </label>
                <Input
                  classes="!w-[187px] md:!w-[193.5px] h-[35px] md:h-[60px] !mt-0 md:!mt-2"
                  label=""
                  name="clientSecondPhone"
                  type="text"
                  defaultValue="01033371363"
                  noHelperText
                  error={!!errors.clientSecondPhone}
                  register={register}
                />
              </div>
            </div>

            <div className="mb-[12px] flex gap-[12px] md:gap-[10px] flex-wrap flex-col">
              <div className="flex gap-[5px] md:gap-[8px] md:mt-[10px] flex-wrap flex-col md:flex-row">
                <div className="flex items-center md:flex-col md:items-start customer-label-input  md:flex-1">
                  <label
                    className="flex-1 mb-[2px] md:flex-none"
                    htmlFor="고객번호"
                  >
                    우편번호
                  </label>
                  <Input
                    classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 md:!mt-2 !bg-[#e7e8ea] !border-0"
                    label=""
                    name="clientPostNumber"
                    type="text"
                    disabled
                    value="06712"
                    helperText={errors.clientPostNumber?.message}
                    error={!!errors.clientPostNumber}
                    register={register}
                  />
                </div>
                <div className="flex justify-end md:items-end">
                  <Button
                    className="w-[187px] md:w-[157px] !h-[30px] md:!h-[60px] !border-black !border-opacity-50"
                    variant="outline-gray"
                    onClick={e => {
                      e?.preventDefault();
                      openMap({ onComplete: handleCompleteDaumMap });
                    }}
                  >
                    <span className="!f14Regular md:!f18Regular">주소검색</span>
                  </Button>
                </div>
              </div>
              <div
                className={`flex customer-label-input${
                  errors.clientAddress ? '' : ' items-center'
                }`}
              >
                <label
                  className="flex-1 f12Regular mb-[2px] md:hidden md:pt-[0px] pt-[15px]"
                  htmlFor="고객번호"
                >
                  주소
                </label>
                <Input
                  classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 !bg-[#e7e8ea] !border-0"
                  label=""
                  name="clientAddress"
                  type="text"
                  value="서울특별시 강서구 화곡동 1056-7"
                  noHelperText
                  error={!!errors.clientAddress}
                  register={register}
                  disabled
                />
              </div>
              <div className="flex items-center md:flex-col md:items-start customer-label-input">
                <label
                  className="flex-1 mb-[2px] md:flex-none md:hidden"
                  htmlFor="고객명"
                >
                  상세주소
                </label>
                <Input
                  classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0"
                  label=""
                  name="clientDetailAddress"
                  type="text"
                  defaultValue="101호"
                  noHelperText
                  error={!!errors.clientDetailAddress}
                  register={register}
                />
              </div>
            </div>

            <div className="md:mt-[20px] flex items-center md:flex-col md:items-start customer-label-input">
              <label className="flex-1 mb-[2px] md:flex-none" htmlFor="고객명">
                메모
              </label>
              <Input
                classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 md:!mt-2"
                label=""
                name="clientNote"
                type="text"
                noHelperText
                error={!!errors.clientNote}
                register={register}
              />
            </div>
          </div>
        </WCollapseBox>
        {/* INSTALLATION INFO */}
        <WCollapseBox title="설치 정보" isOpenCollapse>
          <div className="customer-info flex flex-col gap-[12px]">
            <div className="flex gap-[12px] md:gap-[11px] flex-wrap flex-col md:flex-row">
              <div
                className={`flex md:flex-col md:items-start customer-label-input${
                  errors.modelName ? '' : ' items-center'
                }`}
              >
                <label
                  className="flex-1 mb-[2px] md:flex-none md:ml-[0px] md:pt-[0px] pt-[15px]"
                  htmlFor="고객명"
                >
                  모델명
                </label>
                <InputModel
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              </div>
              <div
                className={`flex md:flex-col md:items-start customer-label-input${
                  errors.productSerial ? '' : ' items-center'
                }`}
              >
                <label
                  className="flex-1 mb-[2px] md:flex-none md:pt-[0px] pt-[15px]"
                  htmlFor="고객명"
                >
                  S/N
                </label>
                <Input
                  classes="!w-[187px] md:!w-[396px] h-[35px] md:h-[60px] !mt-0 md:!mt-2 md:!pl-[20px] !font-normal"
                  label=""
                  name="productSerial"
                  type="text"
                  placeholder="시리얼 번호를 입력해주세요."
                  helperText={errors.productSerial?.message}
                  error={!!errors.productSerial}
                  register={register}
                />
              </div>
              <InstallationDate
                register={register}
                errors={errors}
                setValue={setValue}
              />
            </div>
            <UploadFile
              onChangeFile={file => {
                setValue('installationImage', file || null);
              }}
              errors={errors}
              register={register}
              setError={setError}
              clearErrors={clearErrors}
            />
          </div>
        </WCollapseBox>
      </div>
      <Button
        className="md:!h-[66px] mt-[40px] md:mt-[58px] !w-[312px] md:!w-[384px] mx-auto md:mr-auto !border"
        fullWidth
        type="submit"
        variant={isLoading ? 'disabled' : 'secondary'}
        isLoading={isLoading}
      >
        {isLoading ? (
          <span className="text-white">Loading&hellip;</span>
        ) : (
          <span className="md:!f20Medium">수정</span>
        )}
      </Button>
    </form>
  );
}

export default EditCustomerForm;
