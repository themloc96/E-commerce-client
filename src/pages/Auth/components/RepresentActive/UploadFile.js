/* eslint-disable react/jsx-no-useless-fragment */
import React, { Fragment, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { useWindowDimensions } from '../../../../hooks';
import { Input } from '../../../../components/Input';
import { uploadRepesentActiveFileFn } from '../../../../apis/upload.api';
import { isValidExtensionFile } from '../../../../utils/helpers';

function UploadFile({
  onChangeFile,
  submitCount,
  isInvalid,
  setError,
  clearErrors,
}) {
  const { width } = useWindowDimensions();
  const [selectedFile, setSelectedFile] = useState();
  // const { enqueueSnackbar } = useSnackbar();
  // API upload file mutation
  const { mutate: uploadRepesentActiveFile, isError } = useMutation(
    formData => uploadRepesentActiveFileFn(formData),
    {
      onSuccess: data => {
        onChangeFile(data[0]);
      },
      onError: error => {
        alert('오류가 발생하였습니다.');
        // enqueueSnackbar(error?.response?.data?.message, {
        //   variant: 'error',
        // });
      },
    },
  );

  const handleSelectedFile = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setSelectedFile('');
      onChangeFile(null);
      return;
    }
    if (!isValidExtensionFile(file)) {
      setError('businessFile', {
        type: 'custom',
        message: '사업자 등록증을 업로드 해주세요.',
      });
      setSelectedFile('');
      onChangeFile(null);
      return;
    }
    clearErrors('businessFile');
    const formData = new FormData();
    formData.append('file', file);
    uploadRepesentActiveFile(formData);
    setSelectedFile(file.name);
  };
  return (
    <>
      {width <= 600 ? (
        <>
          <div className="join-003">
            <p className="sign-up-label">증빙자료</p>
            <p className="description-label">
              사업자 등록증을 업로드 해주세요.
            </p>
          </div>
          <div className="find-id-flex join-003">
            <div className="file-uploaded-div">
              {/* UPLOAD FILE  */}
              <Input
                style={{ marginTop: '0' }}
                label=""
                classes="sign-up-input"
                placeholder={selectedFile}
                disabled
                helperText="사업자 등록증을 업로드 해주세요."
                error={isInvalid}
              />
              {selectedFile && (
                <button
                  className="close-file-selected"
                  onClick={handleSelectedFile}
                >
                  <img
                    style={{ marginTop: '10px' }}
                    alt="close"
                    src="/assets/app/close.svg"
                  />
                </button>
              )}
            </div>
            <label htmlFor="upload" className="upload-file-label">
              <button style={{ marginTop: '0' }} className="upload-file">
                업로드
              </button>
            </label>
            <input
              type="file"
              key={Math.random().toString(36)}
              // name="file"
              id="upload"
              name="upload"
              onChange={handleSelectedFile}
              hidden
            />
          </div>
        </>
      ) : (
        <>
          <div className="find-id-flex join-003 mt-[30px]">
            <div>
              <p className="sign-up-label" style={{ margin: '0 0 10px' }}>
                증빙자료
              </p>
              <p
                className={`description-label ${
                  isInvalid ? '!text-error' : ''
                }`}
              >
                사업자 등록증을 업로드 해주세요.
              </p>
            </div>
            <label htmlFor="upload" className="upload-file-label">
              <button className="upload-file !bg-black text !text-white">
                업로드
              </button>
            </label>
            <input
              type="file"
              key={Math.random().toString(36)}
              // name="file"
              id="upload"
              name="upload"
              onChange={handleSelectedFile}
              hidden
            />
          </div>
          {selectedFile && (
            <div className="file-uploaded-div">
              <Input
                label=""
                classes="sign-up-input"
                placeholder={selectedFile}
                disabled
              />
              <button onClick={handleSelectedFile}>
                <img alt="close" src="/assets/app/close.svg" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default UploadFile;
