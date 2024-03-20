import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import Button from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { generateUId, isValidExtensionFileV2 } from '../../../../utils/helpers';
import { uploadBusinessClientFileFn } from '../../../../apis/upload.api';

function UploadFile({ errors, setError, clearErrors, onChangeFile, register }) {
  const [selectedFile, setSelectedFile] = useState();
  const { mutate: uploadBusinessClient, isLoading } = useMutation(
    formData => uploadBusinessClientFileFn(formData),
    {
      onSuccess: data => {
        onChangeFile(data[0]);
      },
      onError: error => {
        alert('오류가 발생하였습니다.');
      },
    },
  );

  const handleSelectedFile = event => {
    event.preventDefault();
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setSelectedFile('');
      return;
    }
    if (!isValidExtensionFileV2(file)) {
      setError('installationImage', {
        type: 'custom',
        message: '업로드 불가 확장자입니다',
      });
      setSelectedFile('');
      onChangeFile(null);
      return;
    }
    clearErrors('installationImage');
    const formData = new FormData();
    formData.append('files', file);
    uploadBusinessClient(formData);
    setSelectedFile(file.name);
  };

  const handleRemoveSelectedFile = () => setSelectedFile('');

  return (
    <div className="flex gap-[5px] md:gap-[10px] md:mt-[10px] flex-wrap flex-col md:flex-row">
      <div
        className={`flex md:flex-col md:items-start md:flex-1 customer-label-input${
          errors.installationImage ? '' : ' items-center'
        }`}
      >
        <label
          className="flex-1 md:mb-[8px] md:flex-none md:pt-[0px] pt-[15px]"
          htmlFor="고객번호"
        >
          설치사진
        </label>
        <label
          className="text-black/[0.5] mb-[5px] md:mb-[4px] hidden md:block !f16Regular"
          htmlFor="고객번호"
        >
          설치 사진을을 업로드 해주세요.
        </label>
        <div className="relative md:w-full customer-file">
          <Input
            classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 md:!mt-2 !bg-[#e7e8ea] !pl-[16px] !border-0 !f12Regular md:!f16Regular !text-black/[0.5]"
            label=""
            name="installationImage"
            type="text"
            placeholder="사진을 업로드 해주세요."
            value={selectedFile}
            error={!!errors.installationImage}
            helperText={errors.installationImage?.message}
            register={register}
            disabled
          />
          {selectedFile && (
            <button
              className="absolute top-[50%] translate-y-[-50%] right-[12px]"
              onClick={handleRemoveSelectedFile}
            >
              <img alt="close" src="/assets/app/close.svg" />
            </button>
          )}
        </div>
      </div>
      <div
        className={`flex justify-end md:items-end${
          errors.installationImage ? ' upload-file-button' : ''
        }`}
      >
        <label
          htmlFor="upload"
          className={`upload-file-label ${
            isLoading ? '!cursor-not-allowed' : ''
          }`}
        >
          <Button
            className="upload-file w-[187px] md:w-[193px] !h-[30px] md:!h-[60px] !border-black !border-opacity-50"
            variant={isLoading ? 'disabled' : 'outline-gray'}
            isLoading={isLoading}
          >
            {isLoading ? (
              <span className="text-white">Loading&hellip;</span>
            ) : (
              <span className="md:!f20Medium">파일첨부</span>
            )}
          </Button>
        </label>
        {!isLoading && (
          <input
            type="file"
            key={generateUId()}
            id="upload"
            name="upload"
            onChange={handleSelectedFile}
            hidden
          />
        )}
      </div>
    </div>
  );
}

export default UploadFile;
