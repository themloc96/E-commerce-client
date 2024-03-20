import React, { useEffect, useRef, useState } from 'react';

function ImageUpload({
  fileName,
  setErrorMessageImage = () => {},
  setFile = () => {},
}) {
  const [selectedFile, setSelectedFile] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  useEffect(() => {
    if (fileName.length > 0) {
      setSelectedFile(fileName);
    }
  }, [fileName]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setErrorMessageImage('파일 크기는 50MB 미만이어야 합니다.');
      return;
    }
    setErrorMessageImage('');
    setSelectedFile(file?.name);
    setFile(file);
  };

  return (
    <div className="wrapper-image">
      <div className="distri-post-title">파일첨부</div>
      <div className="distri-post-img">
        <p className="post-img-name">{selectedFile}</p>
        <button className="post-img-btn" onClick={handleClick}>
          파일 업로드
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
    </div>
  );
}

export default ImageUpload;
