import React, { useState } from 'react';
import { Input } from '../Input';
import Button from '../Button';
import {
  downloadFile,
  generateUId,
  getFileName,
  isValidExtensionFileV2,
} from '../../utils/helpers';

const _defaultProps = {
  errors: {},
  setError: () => {},
  clearErrors: () => {},
  onChangeFile: () => {},
  register: () => {},
  uploadFileMutation: {},
  fieldName: '',
};

function UploadFile({
  errors,
  setError,
  clearErrors,
  onChangeFile,
  register,
  uploadFileMutation,
  fieldName,
  placeholder,
  buttonText,
  fileDefault,
  handleDeleteFile,
}) {
  const [selectedFiles, setSelectedFiles] = useState('');

  const handleSelectedFile = event => {
    event.preventDefault();
    const files = event.target.files && event.target.files[0];
    const formData = new FormData();

    if (!files || files.length === 0) {
      return;
    }

    if (!isValidExtensionFileV2(files)) {
      setError(fieldName, {
        type: 'custom',
        message: '업로드 불가 확장자입니다',
      });
      return;
    }

    clearErrors(fieldName);
    setSelectedFiles(files.name);
    formData.append('files', files);
    uploadFileMutation.mutate(formData);
  };

  const downloadAttachment = (e, url) => {
    e.preventDefault();
    downloadFile(url);
  };

  const handleRemoveSelectedFile = (e, index) => {
    e.preventDefault();
    setSelectedFiles('');
    const filesRemaining = fileDefault.map(item => item.name);
    if (handleDeleteFile) {
      handleDeleteFile(filesRemaining);
    }
  };

  const getKey = index => {
    return index + 1;
  };

  const renderDefaultFiles = () => {
    return fileDefault.map((file, index) => {
      return (
        <div className="file-item" key={getKey(index)}>
          <div className="wrapper-btn-file">
            <div
              key={index.toString}
              className="relative md:w-full customer-file"
            >
              <Input
                classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 !pl-[16px] !f12Regular md:!f16Regular !text-black/[0.5] text-over"
                label=""
                name={fieldName}
                type="text"
                placeholder={placeholder}
                value={getFileName(file.name)}
                disabled
              />
            </div>
          </div>
          <div
            className={`flex justify-end md:items-end${
              errors[fieldName] ? ' upload-file-button' : ''
            }`}
          >
            <label
              className={`upload-file-label ${
                uploadFileMutation.isLoading ? '!cursor-not-allowed' : ''
              }`}
            >
              <Button
                onClick={e => downloadAttachment(e, file.name)}
                className="w-[187px] md:w-[193px] !h-[30px] md:!h-[60px] !border-black !border-opacity-50 btn-addFile"
                variant="outline-gray"
              >
                <span className="md:!f20Medium"> 다운로드</span>
              </Button>
            </label>
          </div>
        </div>
      );
    });
  };

  const renderInput = () => {
    return (
      <div className="file-item">
        <div className="wrapper-btn-file">
          <div className="relative md:w-full customer-file">
            <Input
              classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 !pl-[16px] !f12Regular md:!f16Regular !text-black/[0.5] text-over"
              label=""
              name={fieldName}
              type="text"
              placeholder={placeholder}
              value={selectedFiles}
              disabled
            />
            <button
              className="absolute top-[55%] translate-y-[-50%] right-[12px]"
              onClick={e => handleRemoveSelectedFile(e)}
            >
              {selectedFiles.length !== 0 && (
                <img alt="close" src="/assets/app/close.svg" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex justify-end md:items-end${
            errors[fieldName] ? ' upload-file-button' : ''
          }`}
        >
          <label
            htmlFor="upload"
            className={`upload-file-label ${
              uploadFileMutation.isLoading ? '!cursor-not-allowed' : ''
            }`}
          >
            <Button
              className="upload-file w-[187px] md:w-[193px] !h-[30px] md:!h-[60px] !border-black !border-opacity-50 btn-addFile"
              variant={
                uploadFileMutation.isLoading ? 'disabled' : 'outline-gray'
              }
              isLoading={uploadFileMutation.isLoading}
            >
              {uploadFileMutation.isLoading ? (
                <span className="text-white">Loading&hellip;</span>
              ) : (
                <span className="md:!f20Medium">{buttonText}</span>
              )}
            </Button>
          </label>
          {!uploadFileMutation.isLoading && (
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
  };

  return (
    <div className="flex gap-[5px] md:gap-[10px] md:mt-[10px] flex-wrap flex-col md:flex-row w-full block-attachment">
      <div
        className={`wrapper-files flex md:flex-col md:items-start md:flex-1 customer-label-input${
          errors[fieldName] ? '' : ' items-center'
        }`}
      >
        {renderDefaultFiles()}
        {!uploadFileMutation.isSuccess ? (
          <div className="file-item">
            <div className="wrapper-btn-file">
              <div className="relative md:w-full customer-file">
                <Input
                  classes="!w-[187px] md:!w-full h-[35px] md:h-[60px] !mt-0 !pl-[16px] !f12Regular md:!f16Regular !text-black/[0.5] text-over"
                  label=""
                  name={fieldName}
                  type="text"
                  placeholder={placeholder}
                  value=""
                  disabled
                />
              </div>
            </div>
            <div
              className={`flex justify-end md:items-end${
                errors[fieldName] ? ' upload-file-button' : ''
              }`}
            >
              <label
                htmlFor="upload"
                className={`upload-file-label ${
                  uploadFileMutation.isLoading ? '!cursor-not-allowed' : ''
                }`}
              >
                <Button
                  className="upload-file w-[187px] md:w-[193px] !h-[30px] md:!h-[60px] !border-black !border-opacity-50 btn-addFile"
                  variant={
                    uploadFileMutation.isLoading ? 'disabled' : 'outline-gray'
                  }
                  isLoading={uploadFileMutation.isLoading}
                >
                  {uploadFileMutation.isLoading ? (
                    <span className="text-white">Loading&hellip;</span>
                  ) : (
                    <span className="md:!f20Medium">{buttonText}</span>
                  )}
                </Button>
              </label>
              {!uploadFileMutation.isLoading && (
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
        ) : (
          renderInput()
        )}
      </div>
    </div>
  );
}

UploadFile.defaultProps = _defaultProps;
export default UploadFile;
