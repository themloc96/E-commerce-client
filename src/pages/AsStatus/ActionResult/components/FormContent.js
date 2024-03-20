/* eslint-disable no-extra-boolean-cast */
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import { uploadASFileFn } from '../../../../apis/upload.api';
import { Input } from '../../../../components/Input';
import SelectRepresentSymptyomList from '../../../../components/Select/SelectRepresentSymptyomList';
import SelectSymptyomDetailList from '../../../../components/Select/SelectSymptyomDetailList';
import ViewDetailProductButton from '../../../../components/Shared/ViewDetailProductButton';
import UploadFile from '../../../../components/UploadFile';
import { useWindowDimensions } from '../../../../hooks';
import { feeTypes } from '../../../../constants/jsonData/after-service';
import SelectAsType from '../../../../components/Select/SelectAsType';
import { asFeeTypeObj } from '../../../../constants/enum/material';

function FormContent({ register, afterService, control, errors, setValue }) {
  const { width } = useWindowDimensions();
  const [isFolded, setIsFolded] = useState({
    isOpenReceiptInfo: false,
    isOpenItem: false,
    isOpenApplication: false,
    isOpenMaterial: false,
  });

  const uploadFileMutation = useMutation(formData => uploadASFileFn(formData), {
    onSuccess: data => {
      const newData = [...(afterService.asFile || []), ...data];
      setValue('asfiles', newData);
    },
    onError: error => {
      alert('오류가 발생하였습니다.');
    },
  });

  const handleDeleteFile = files => {
    setValue('asfiles', files);
  };

  return (
    <>
      <div className="customer-information">
        <div className="title-customer">
          <h2>고객 정보</h2>
        </div>
        <div className="line" />
        <div className="registration-block">
          <div className="row">
            <div className="registration-number">
              <div className="label">고객명</div>
              <div className="field">
                <Input
                  label=""
                  name="customerName"
                  register={register}
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div className="registration-number">
              <div className="label">
                휴대전화<span className="require">*</span>
              </div>
              <div className="field">
                <Input
                  label=""
                  name="customerPhoneNumber"
                  register={register}
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div className="registration-number">
              <div className="label">전화번호</div>
              <div className="field">
                <Input
                  label=""
                  name="customerPhoneSecondNumber"
                  register={register}
                  placeholder=""
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="registration-number">
            <div className="label-address">주소</div>
            <div className="field full">
              <Input
                label=""
                name="customerAddress"
                register={register}
                placeholder=""
                disabled
              />
            </div>
          </div>
          <div className="registration-number">
            {width < 767 && <div className="label-address">상세주소</div>}
            <div className="field full">
              <Input
                label=""
                name="customerDetailedAddress"
                register={register}
                placeholder=""
                className="spacing-10"
                disabled
              />
            </div>
          </div>
          <div className="registration-number">
            <div className="label-remember-board">메모</div>
            <div className="field full">
              <Input
                label=""
                name="customerNote"
                register={register}
                placeholder=""
                className="spacing-16"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <div className="item-information">
        <div className="title">
          <h2
            onClick={() => {
              setIsFolded({
                ...isFolded,
                isOpenItem: !isFolded.isOpenItem,
              });
            }}
          >
            품목 정보
            <i
              className={!isFolded.isOpenItem ? 'ico-dropdown' : 'ico-dropup'}
            />
          </h2>
        </div>
        <div className="line" />
        {!isFolded.isOpenItem && (
          <div className="registration-block">
            <div className="row">
              <div className="registration-number">
                <div className="label">
                  모델명 <span className="require">*</span>
                </div>
                <div className="wrapper-field">
                  <div className="field">
                    <Input
                      label=""
                      name="productModelName"
                      register={register}
                      placeholder=""
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="registration-number">
                <div className="label">제품명</div>
                <div className="wrapper-field">
                  <div className="field submit relative">
                    <Input
                      label=""
                      name="ProductName"
                      register={register}
                      placeholder=""
                      disabled
                      value={
                        afterService?.productName.length < 8
                          ? afterService?.productName
                          : `${afterService?.productName.substring(0, 8)}...`
                      }
                    />
                    <ViewDetailProductButton
                      productName={afterService?.productName}
                      productId={afterService?.productId}
                      label="제품정보"
                      isOpenNewTab
                    />
                  </div>
                </div>
              </div>
              <div className="registration-number">
                <div className="label">상담유형</div>
                <div className="wrapper-field">
                  <div className="field">
                    <Input
                      label=""
                      name="consultationType"
                      register={register}
                      placeholder=""
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="application-type">
        <div className="title">
          <h2
            onClick={() => {
              setIsFolded({
                ...isFolded,
                isOpenApplication: !isFolded.isOpenApplication,
              });
            }}
          >
            접수유형
            <i
              className={
                !isFolded.isOpenApplication ? 'ico-dropdown' : 'ico-dropup'
              }
            />
          </h2>
        </div>
        <div className="line" />
        {!isFolded.isOpenApplication && (
          <div className="registration-block">
            <div className="row">
              <div className="registration-number">
                <div className="label">
                  {width < 767 ? '접수유형' : '접수명'}
                </div>
                <div className="wrapper-field">
                  <div className="field">
                    <Input
                      label=""
                      name="asReceiptType"
                      register={register}
                      placeholder=""
                      disabled
                    />
                  </div>
                </div>
              </div>
              {/* <div className="registration-number">
                <div className="label">
                  {width < 767 ? '유/무상' : '유/무상'}
                </div>
                <div className="wrapper-field">
                  <div className="field">
                    <div className="select">
                      <div className="selected">
                        <span>{afterService?.asFeeType} </span>
                        <i className="ico-dropdown" />
                        <Controller
                          name="asFeeType"
                          control={control}
                          render={({ field: { value } }) => {
                            const feeType = feeTypes?.find(
                              item => item.value === afterService?.asFeeType,
                            );
                            return (
                              <Input
                                label=""
                                placeholder=""
                                disabled
                                value={feeType?.label}
                                classes="active"
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="registration-number">
                <div className="label">유/무상</div>
                <div className="wrapper-field">
                  <div className="field">
                    <SelectAsType
                      fieldName="asFeeType"
                      rules={{ required: true }}
                      control={control}
                      errors={errors}
                      defaultValue={asFeeTypeObj[afterService.asFeeType]}
                    />
                  </div>
                </div>
              </div>
              <div className="registration-number">
                <div className="label">
                  {width < 767 ? '시리얼넘버(S/N)' : '시리얼넘버(S/N)'}
                </div>
                <div className="wrapper-field">
                  <div className="field">
                    <Input
                      label=""
                      name="serialNumber"
                      register={register}
                      // classes="active"
                      placeholder=""
                      value="입력"
                    />
                  </div>
                </div>
              </div>
            </div>
            {width < 767 && (
              <>
                <div className="registration-number">
                  <div className="label">설치일지</div>
                  <div className="wrapper-field">
                    <div className="field">
                      <Input
                        label=""
                        name="customerDetailedAddress"
                        register={register}
                        placeholder=""
                        value="2023.03.10"
                      />
                    </div>
                  </div>
                </div>
                <div className="registration-number">
                  <div className="label">제조년월</div>
                  <div className="wrapper-field">
                    <div className="field">
                      <Input
                        label=""
                        name="customerDetailedAddress"
                        register={register}
                        placeholder=""
                        value="2023.03"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="registration-number">
              <div className="label-representative-symptoms">대표증상</div>
              <div className="wrapper-field">
                <div className="field select-full">
                  <SelectRepresentSymptyomList
                    fieldName="representativeSymptom"
                    rules={{ required: true }}
                    control={control}
                    errors={errors}
                    defaultValue={afterService.representativeSymptom}
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label-detailed-symptoms">세부증상</div>
              <div className="wrapper-field">
                <div className="field select-full">
                  <SelectSymptyomDetailList
                    fieldName="detailedSymptom"
                    rules={{ required: true }}
                    control={control}
                    errors={errors}
                    defaultValue={afterService.detailedSymptom}
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label-consulting-details">처리내용</div>
              <div className="wrapper-field">
                <div
                  className={`field full ${
                    !!errors.asActionDetail ? '!border-error' : ''
                  }`}
                >
                  <textarea
                    className="outline-none"
                    {...register('asActionDetail', { required: true })}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label-attachment">파일첨부</div>
              <div className="wrapper-field field-attachment">
                <UploadFile
                  placeholder=""
                  fieldName="asFile"
                  uploadFileMutation={uploadFileMutation}
                  register={register}
                  buttonText="업로드"
                  fileDefault={
                    afterService?.asFile.map(item => {
                      return {
                        name: item,
                      };
                    }) || []
                  }
                  handleDeleteFile={handleDeleteFile}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FormContent;
