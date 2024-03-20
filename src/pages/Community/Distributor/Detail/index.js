import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useToggleModal } from '../../../../hooks';
// funtion
import { useAuthContext } from '../../../../contexts/AuthProvider';
// styles
import '../../../../styles/community/distributor/distributor-detail.scss';
import { downloadFile, formateDate2 } from '../../../../utils/helpers';

import PostDeleteModal from '../components/PostDeleteModal';
// api
import {
  creaetCommentFn,
  deleteCommentFn,
  getLikesFn,
  getPostDetailFn,
  updateCommentFn,
} from '../../../../apis/post.api';
import { getBusinessesInfoFn } from '../../../../apis/business.api';
import { getMeFn } from '../../../../apis/user.api';

function Page() {
  const { isOpen, onClose, onToggle } = useToggleModal();
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser } = state;
  const location = useLocation();
  const path = location.pathname;
  // 보여지지 않는 항목
  const [commentSelected, setCommentSelected] = useState(null);
  const [editIdx, setEditIdx] = useState();
  const [commentId, setCommentId] = useState(0);
  // 보여지는 항목
  const [createdAt, setCreatedAt] = useState('');
  const [title, setTitle] = useState('');
  const [textComment, setTextComment] = useState('');
  const [editTextComment, setEditTextComment] = useState('');
  // 플레그
  const [heart, setHeart] = useState();
  const [postModifyFlag, setPostModifyFlag] = useState(false);
  const [createCommentFlag, setCreateCommentFlag] = useState(false);
  const [modifyCommentFlag, setModifyCommentFlag] = useState(false);
  const [deleteCommentFlag, setDeleteCommentFlag] = useState(false);
  const [modifyInputFlag, setModifyInputFlag] = useState(false);
  const [isTexting, setIsTexting] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  // 경로 설정
  const listPath = path.split('/', 3).join('/');
  const pathChannl = path.split('/', 3).pop();
  const likeFlag = pathChannl === 'interview';
  const pathCategory = path.split('/', 4).pop();
  const postId = path.split('/').pop();

  const textareaRef = useRef(null);
  const buttonsGroupRef = useRef(null);
  const postRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  const { data: myBusinessInfo } = useQuery(['get-my-business-info'], () =>
    getBusinessesInfoFn(),
  );

  const { data: myInfo } = useQuery(['get-my-info'], () => getMeFn());

  const { data, refetch } = useQuery(
    [path],
    () => {
      return getPostDetailFn(postId, pathChannl.toUpperCase(), '');
    },
    {
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setTitle(_data?.postTitle);
        if (currentUser)
          setPostModifyFlag(
            currentUser.id === _data.memberId && pathChannl === 'agency_news',
          );
        setCreatedAt(formateDate2(_data.createdAt));
        setModifyInputFlag(false);
      },
    },
  );

  useQuery(
    [heart],
    () => {
      if (heart !== undefined) return getLikesFn(postId, heart);
      return '';
    },
    {
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        refetch();
      },
    },
  );

  useQuery(
    [createCommentFlag],
    () => {
      return creaetCommentFn(postId, textComment);
    },

    {
      enabled: createCommentFlag,
      onError: error => {
        setTextComment('');
        setCreateCommentFlag(false);
        setIsTexting(false);
      },
      onSuccess: _data => {
        setCreateCommentFlag(false);
        setTextComment('');
        setIsTexting(false);
        refetch();
      },
    },
  );

  useQuery(
    [modifyCommentFlag],
    () => {
      return updateCommentFn(commentId, editTextComment);
    },

    {
      enabled: modifyCommentFlag,
      onError: error => {
        console.log(error);
        setModifyCommentFlag(false);
      },
      onSuccess: _data => {
        setModifyCommentFlag(false);
        setEditIdx(undefined);
        setCommentId(0);
        setEditTextComment('');
        refetch();
      },
    },
  );

  useQuery(
    [deleteCommentFlag],
    () => {
      return deleteCommentFn(commentId);
    },

    {
      enabled: deleteCommentFlag,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setDeleteCommentFlag(false);
        setEditIdx(undefined);
        setCommentId(0);
        refetch();
      },
    },
  );

  useEffect(() => {
    if (isTexting || editTextComment) {
      textareaRef?.current?.focus();
      textareaRef?.current?.setSelectionRange(
        editTextComment.length,
        editTextComment.length,
      );
    }
  }, [isTexting, editTextComment]);

  const onClikeEdit = e => {
    setModifyInputFlag(!modifyInputFlag);
  };

  const changeToDate = datetime => {
    const now = moment(new Date());
    const duration = moment.duration(now.diff(datetime));

    let DateText = '';
    const seconds = Math.floor(duration.asSeconds());
    const minute = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());
    const weeks = Math.floor(duration.asWeeks());
    const month = Math.floor(duration.asMonths());
    const year = Math.floor(duration.asYears());

    if (minute < 1) {
      DateText = `${seconds}초 전`;
    } else if (hours < 1) {
      DateText = `${minute}분 전`;
    } else if (hours < 24) {
      DateText = `${hours}시간 전`;
    } else if (weeks < 1) {
      DateText = `${days}일 전`;
    } else if (month < 1) {
      DateText = `${weeks}주 전`;
    } else if (year < 1) {
      DateText = `${month}달 전`;
    } else {
      DateText = `${year}년 전`;
    }
    return DateText;
  };

  const onSelectComment = (id, userId, idx, comment) => {
    if (editIdx !== idx) setModifyInputFlag(false);
    if (!(editIdx === idx && modifyInputFlag)) {
      setCommentId(id);
      setEditIdx(idx);
      setEditTextComment(comment);
      setCommentSelected(prevState => (prevState === id ? null : id));
    }
  };

  const getBorderName = type => {
    switch (type) {
      case 'raonark_story':
        return '라오나크 이야기';
      case 'interview':
        return '이달의 인터뷰';
      case 'agency_news':
        return '대리점 소식';
      case 'quality':
        return '품질 게시판';
      default:
        return null;
    }
  };

  const onClikeHeart = status => {
    setHeart(status);
  };

  const turnOffEditComment = () => {
    setModifyInputFlag(false);
    setEditTextComment('');
  };

  const onClickCommentFlag = (type, id) => {
    if (type === 'modify' && id !== undefined) {
      setCommentSelected(null);
      if (!editTextComment) {
        alert('댓글을 입력해주세요.');
      } else {
        setModifyCommentFlag(true);
        setCommentId(id);
        // setModifyInputFlag(false);
      }
    }
    if (type === 'create') {
      if (!textComment) {
        alert('댓글을 입력해주세요.');
      } else {
        setCreateCommentFlag(true);
      }
    }
    if (type === 'delete') {
      setCommentSelected(null);
      setCommentId(id);
      setDeleteCommentFlag(true);
    }
  };

  const onSelectToModify = item => {
    const { id, commentContent } = item;
    if (modifyInputFlag && commentId === id) {
      onClickCommentFlag('modify', commentId);
    } else {
      setModifyInputFlag(true);
      setCommentId(id);
      setEditTextComment(commentContent);
    }
  };

  const renderLikeStatus = status => {
    if (status === true) {
      return (
        <button onClick={e => onClikeHeart(0)}>
          <img src="/assets/community/heart.png" alt="" />
        </button>
      );
    }
    return (
      <button onClick={e => onClikeHeart(1)}>
        <img src="/assets/community/empty-heart.png" alt="" />
      </button>
    );
  };

  const onFocus = () => {
    setCommentSelected(null);
    setIsTexting(true);
  };

  const onCancelComment = () => {
    setTextComment('');
    setIsTexting(false);
    setModifyInputFlag(false);
    setEditTextComment('');
  };

  const toggleOpen = () => {
    setIsButtonOpen(prevState => !prevState);
    buttonsGroupRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PostDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        deletePostId={postId}
        postChannl={pathChannl}
      />
      <div className="distri-detail keyin-container">
        <div className="distri-detail-title-area">
          <div className="distri-detail-title-area-left">
            <p className="distri-title">{title}</p>
            <div>
              <div>{getBorderName(pathChannl)}</div>
              <div>{createdAt}</div>
            </div>
          </div>
          <div className="distri-detail-title-area-right">
            {postModifyFlag && (
              <div className="edit-delete-buttons">
                <button
                  onClick={() =>
                    navigate(`/community/agency_news/edit/${postId}`)
                  }
                >
                  <p>수정</p>
                </button>
                <button onClick={() => onToggle()}>
                  <p>삭제</p>
                </button>
              </div>
            )}
            {postModifyFlag && (
              <button className="ellipsis-options" onClick={toggleOpen}>
                <img
                  src="/assets/community/ellipsis-vertical-solid.svg"
                  alt=""
                />
              </button>
            )}

            {likeFlag && (
              <div className="heart-number">
                {renderLikeStatus(data?.likesStatus)}
                <p>{data?.likes}</p>
              </div>
            )}
          </div>
        </div>
        <hr className="distri-detail-first-hr" />
        <div className="distri-detail-content-area">
          <div className="content-text content-nobold">
            <div dangerouslySetInnerHTML={{ __html: data?.postContent }} />
            {data?.file && (
              <div style={{ marginTop: '40px', overflowWrap: 'break-word' }}>
                첨부파일 :{' '}
                <button
                  onClick={() => downloadFile(data.file)}
                  style={{
                    textDecoration: 'underline',
                    color: '#0066FF',
                    width: 'fit-content',
                    textAlign: 'start',
                  }}
                >
                  {data?.file.split('/').pop()}
                </button>
              </div>
            )}
          </div>
          <div className="content-text content-nobold-mobile">
            <div dangerouslySetInnerHTML={{ __html: data?.postContent }} />
            {data?.file && (
              <div style={{ marginTop: '40px', overflowWrap: 'break-word' }}>
                첨부파일 :{' '}
                <button
                  onClick={() => downloadFile(data.file)}
                  style={{
                    textDecoration: 'underline',
                    color: '#0066FF',
                    width: '100%',
                    textAlign: 'start',
                  }}
                >
                  {data?.file.split('/').pop()}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="distri-detail-route-area">
          {data?.informStatus !== true && (
            <>
              {data?.postPrevPageTitle && data?.postPrevPageId !== 0 ? (
                <Link
                  to={
                    pathChannl === 'raonark_story' || pathChannl === 'quality'
                      ? `${listPath}/${pathCategory}/${data?.postPrevPageId}`
                      : `${listPath}/${data?.postPrevPageId}`
                  }
                >
                  <div className="move-to previous-article">
                    <img src="/assets/arrow/up-arrow.png" alt="" />
                    <div>이전 글</div>
                    <div style={{ fontWeight: 700 }}>
                      {data?.postPrevPageTitle.length < 28
                        ? data?.postPrevPageTitle
                        : `${data?.postPrevPageTitle.substring(0, 28)}...`}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="move-to previous-article">
                  <img src="/assets/arrow/up-arrow.png" alt="" />
                  <div style={{ fontWeight: 400 }}>이전 글</div>
                  <div>이전 게시글이 존재하지 않습니다.</div>
                </div>
              )}
              <hr />
              {data?.postNextPageTitle && data?.postNextPageId !== 0 ? (
                <Link
                  to={
                    pathChannl === 'raonark_story' || pathChannl === 'quality'
                      ? `${listPath}/${pathCategory}/${data?.postNextPageId}`
                      : `${listPath}/${data?.postNextPageId}`
                  }
                >
                  <div className="move-to next-article">
                    <img src="/assets/arrow/down-arrow.png" alt="" />
                    <div>다음 글</div>
                    <div style={{ fontWeight: 700 }}>
                      {data?.postNextPageTitle.length < 28
                        ? data?.postNextPageTitle
                        : `${data?.postNextPageTitle.substring(0, 28)}...`}{' '}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="move-to next-article">
                  <img src="/assets/arrow/down-arrow.png" alt="" />
                  <div style={{ fontWeight: 400 }}>다음 글</div>
                  <div>다음 게시글이 존재하지 않습니다.</div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="distri-detail-comment-area">
          <div className="post-comment-area">
            <input
              type="text"
              placeholder="댓글을 입력해 주세요."
              value={textComment}
              onChange={e => setTextComment(e.target.value)}
              onFocus={onFocus}
            />
            <button onClick={e => onClickCommentFlag('create')}>등록</button>
          </div>
          <hr />
          <p className="others-cmt-title">
            {data?.commentList !== null ? data?.commentList.length : 0}개의 댓글
          </p>
          <div className="others-cmt">
            {data?.commentList.map((item, idx) =>
              editIdx === idx && modifyInputFlag ? (
                <div className="other-comment-has-border">
                  <div className="comment-content">
                    <input
                      style={{ width: '100%', outline: 'none' }}
                      type="text"
                      placeholder="댓글을 입력해 주세요."
                      value={editTextComment}
                      onChange={e => setEditTextComment(e.target.value)}
                    />
                  </div>
                  <div className="edit-delete-comment-border">
                    <button
                      onClick={e => onClickCommentFlag('modify', item.id)}
                    >
                      <p>등록</p>
                    </button>
                    <button onClick={e => onClikeEdit(e)}>
                      <p>취소</p>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`other-comment${
                    commentSelected === item.id ? ' comment-selected' : ''
                  }`}
                  onClick={() =>
                    onSelectComment(
                      item.id,
                      item.memberId,
                      idx,
                      item.commentContent,
                    )
                  }
                >
                  <div className="comment-name">{item.businessName}</div>
                  <div className="comment-content">
                    <div className="comment-text">{item.commentContent}</div>
                    <div className="comment-time">
                      {changeToDate(item.updatedAt)}
                    </div>
                  </div>
                  {currentUser?.id === item.memberId ? (
                    <div className="edit-delete-comment">
                      <button
                        onClick={e => onClikeEdit(e)}
                        style={{ opacity: '1' }}
                      >
                        <p>수정</p>
                      </button>
                      <button
                        onClick={e => onClickCommentFlag('delete', item.id)}
                        style={{ opacity: '1' }}
                      >
                        삭제
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="distri-detail-comment-area-mobile">
          <div className="post-comment-area" ref={postRef}>
            {isTexting ? (
              <div className="texing-input">
                <div className="comment-name">
                  {myBusinessInfo.businessName}
                </div>
                <textarea
                  value={textComment}
                  onChange={e => setTextComment(e.target.value)}
                  ref={textareaRef}
                />
                <hr />
                <div className="texing-button-group">
                  <button
                    className="register-cmt"
                    onClick={() => onClickCommentFlag('create')}
                  >
                    등록
                  </button>
                  <button className="cancel-cmt" onClick={onCancelComment}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="댓글을 입력해 주세요."
                value={textComment}
                onChange={e => setTextComment(e.target.value)}
                onFocus={onFocus}
              />
            )}
          </div>
          <hr />
          <p className="others-cmt-title">
            {data?.commentList !== null ? data?.commentList.length : 0}개의 댓글
          </p>
          <div className="others-cmt">
            {data?.commentList.map((item, idx) => {
              const updateFlag = modifyInputFlag && commentId === item.id;
              const isMyCmt = myInfo.id === item.memberId;
              return (
                <button
                  className={`other-comment${
                    commentSelected === item.id && !modifyInputFlag
                      ? ' comment-selected'
                      : ''
                  }`}
                >
                  <div className="comment-header">
                    <div className="comment-name">{item.businessName}</div>
                    <div className="comment-time">
                      {changeToDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="comment-content">
                    {isMyCmt ? (
                      <>
                        {updateFlag ? (
                          <textarea
                            value={editTextComment}
                            onChange={e => setEditTextComment(e.target.value)}
                            ref={textareaRef}
                          />
                        ) : (
                          <div className="comment-text">
                            {item.commentContent}
                          </div>
                        )}
                        <hr />
                        <div className="texing-button-group">
                          <button
                            className="register-cmt"
                            onClick={() => onSelectToModify(item)}
                          >
                            {updateFlag ? '등록' : '수정'}
                          </button>
                          <button
                            className="cancel-cmt"
                            onClick={() =>
                              updateFlag
                                ? turnOffEditComment()
                                : onClickCommentFlag('delete', item.id)
                            }
                          >
                            {updateFlag ? '취소' : '삭제'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="comment-text">{item.commentContent}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="distri-detail-list-button-mobile" ref={buttonsGroupRef}>
          {isButtonOpen ? (
            <div className="has-comment-selected">
              <button onClick={() => onToggle()}>삭제</button>
              <button
                onClick={() =>
                  navigate(`/community/agency_news/edit/${postId}`)
                }
              >
                수정
              </button>
            </div>
          ) : (
            <div>
              <Link to={listPath}>
                <button>목록으로</button>
              </Link>
            </div>
          )}
        </div>
        <div className="distri-detail-list-button">
          <Link to={listPath}>
            <button>목록으로</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Page;
