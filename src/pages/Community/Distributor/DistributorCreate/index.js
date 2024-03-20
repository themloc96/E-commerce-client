import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
// styles
import '../../../../styles/community/distributor/distributor-create.scss';
import Editor from '../components/Editor';
import {
  createdPostFn,
  getPostDetailFn,
  updatedPostFn,
  uploadCommunityFilesFn,
} from '../../../../apis/post.api';
import { useAuthContext } from '../../../../contexts/AuthProvider';
import ImageUpload from '../components/ImageUpload';

function Page() {
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser } = state;
  // path
  const location = useLocation();
  const path = location.pathname;
  const mode = path.split('/', 4).pop();
  const postId = mode === 'edit' ? path.split('/').pop() : undefined;
  const titleMode =
    mode === 'edit' ? '대리점 게시판 수정하기' : '대리점 게시판 글쓰기';
  const buttonMode = mode === 'edit' ? '수정하기' : '작성하기';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMessageImage, setErrorMessageImage] = useState('');
  const [file, setFile] = useState({});

  useQuery(
    [postId],
    () => {
      return getPostDetailFn(postId, 'AGENCY_NEWS', '');
    },
    {
      enabled: postId !== undefined,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setTitle(_data.postTitle);
        setContent(_data.postContent);
        setFileName(_data.file.split('/').pop());
      },
    },
  );

  const { mutate: createdPost } = useMutation(
    newItem => createdPostFn(newItem),
    {
      onSuccess: data => {
        navigate('/community/agency_news');
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const { mutate: updatedPost } = useMutation(
    updateItem => updatedPostFn(postId, updateItem),
    {
      onSuccess: data => {
        navigate(`/community/agency_news/${postId}`);
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const { mutate: uploadCommunityFile } = useMutation(
    formData => uploadCommunityFilesFn(formData),
    {
      onSuccess: data => {
        const postObj = {
          postChannel: 'AGENCY_NEWS',
          postCategory: 'NO_USE',
          postTitle: title,
          postContent: content,
          informStatus: false,
          memberId: currentUser.id,
          postFile: data.length > 0 ? data[0] : '',
          postThumbnail: '',
          postProductModel: '',
        };
        if (mode === 'edit') {
          updatedPost(postObj);
          return;
        }
        createdPost(postObj);
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  const handleChangeContent = value => {
    setContent(value);
  };

  const onClickCreatePost = () => {
    if (title.length === 0) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (content.length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (errorMessageImage) {
      alert(errorMessageImage);
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      formData.append('folder', 'AGENCY_NEWS');
      formData.append('thumbnail', false);
    }

    if (file) {
      uploadCommunityFile(formData);
    } else {
      const postObj = {
        postChannel: 'AGENCY_NEWS',
        postCategory: 'NO_USE',
        postTitle: title,
        postContent: content,
        informStatus: false,
        memberId: currentUser.id,
        postFile: '',
        postThumbnail: '',
        postProductModel: '',
      };

      if (mode === 'edit') {
        updatedPost(postObj);
        return;
      }
      createdPost(postObj);
    }
  };

  return (
    <div className="distri-create keyin-container">
      <div className="distri-create-title-area">
        <div className="distri-create-title-area-left">
          <p className="distri-title">{titleMode}</p>
        </div>
      </div>
      <div className="distri-create-post-area">
        <p className="distri-post-title">제목</p>
        <div className="post-comment-area">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength="50"
          />
        </div>
        <p className="distri-post-title distri-post-title-textarea">내용</p>
        <Editor
          name="description"
          onChange={handleChangeContent}
          value={content}
        />
        <ImageUpload
          setErrorMessageImage={setErrorMessageImage}
          setFile={setFile}
          fileName={fileName}
        />
      </div>
      <div className="distri-create-list-button">
        <button
          onClick={() =>
            mode === 'edit'
              ? navigate(`/community/agency_news/${postId}`)
              : navigate('/community/agency_news')
          }
        >
          취소
        </button>
        <button
          onClick={() => {
            onClickCreatePost();
          }}
        >
          {buttonMode}
        </button>
      </div>
    </div>
  );
}

export default Page;
