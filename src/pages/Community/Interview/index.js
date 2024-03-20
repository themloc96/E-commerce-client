import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryParams, useWindowDimensions } from '../../../hooks';
// api
import { getLikesFn, searchPostFn } from '../../../apis/post.api';
// styles
import '../../../styles/community/interview/main.scss';
import { formateDate } from '../../../utils/helpers';
import LoadingBox from '../../../components/Loading/LoadingBox';
import Pagination from '../../../components/Pagination';

function Page() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { filterParamsObj } = useQueryParams();

  const [heart, setHeart] = useState();
  const [postId, setPostId] = useState();
  const [changeData, setChangeData] = useState(false);
  const [listData, setListData] = useState([]);
  const { width } = useWindowDimensions();
  const isNotData = listData.length;

  function Style() {
    return (
      <style>
        {`
          @media screen and (max-width: 766px) {
            .bg-bg2, .my-page-container {
              background-color: #fff;
            }
          }
        `}
      </style>
    );
  }

  const { isLoading, data } = useQuery(
    ['v1/post/search', filterParamsObj, changeData],
    () => {
      return searchPostFn({
        ...filterParamsObj,
        channel: 'INTERVIEW',
        size: width > 768 ? 15 : 14,
        sort: 'SORT_DESC',
      });
    },
    {
      keepPreviousData: true,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setListData(_data?.data?.list);
        setChangeData(false);
      },
    },
  );

  useQuery(
    [heart, listData],
    () => {
      if (postId !== undefined) return getLikesFn(postId, heart);
      return '';
    },
    {
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        // setChangeData(true);
      },
    },
  );

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  const onClikeHeart = (e, id, status) => {
    e.preventDefault();
    setPostId(id);
    setHeart(status);
    setListData(prevData => {
      return prevData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            likesStatus: status,
            likes: status ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      });
    });
  };

  const renderLikeStatus = item => {
    if (item.likesStatus) {
      return (
        <button onClick={e => onClikeHeart(e, item.id, 0)}>
          <img src="/assets/community/heart.png" alt="" />
        </button>
      );
    }
    return (
      <button onClick={e => onClikeHeart(e, item.id, 1)}>
        <img src="/assets/community/empty-heart.png" alt="" />
      </button>
    );
  };

  function isValidImageUrl(url) {
    const validExtensions = /\.(png|jpg|jpeg)$/i;
    return validExtensions.test(url);
  }

  return (
    <div className="interview keyin-container">
      <Style />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <div className="interview-title">
            <p>이달의 인터뷰</p>
            <span>라오나크와 함께 성공 이야기</span>
            <p>라오나크와 함께하는 성공 이야기</p>
          </div>
          <div
            className={`interview-list interview-list-pc ${
              isNotData ? '' : '!grid-cols-1'
            } `}
          >
            {isNotData ? (
              listData.map(item => {
                return (
                  <div
                    className="interview-list-card"
                    key={`${item.createdAt}-${item.id}`}
                  >
                    <img
                      style={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        flexShrink: '0',
                      }}
                      src={
                        item.thumbnail && isValidImageUrl(item.thumbnail)
                          ? item.thumbnail
                          : '/assets/products/no-image.png'
                      }
                      alt={item.postTitle || 'thumbnail'}
                      onClick={() => {
                        navigate(`/community/interview/${item.id}`);
                      }}
                    />
                    <div className="products-info">
                      <div className="desc">
                        <button
                          onClick={() => {
                            navigate(`/community/interview/${item.id}`);
                          }}
                        >
                          <span>
                            {item.postTitle.length < 28
                              ? item.postTitle
                              : `${item.postTitle.substring(0, 28)}...`}
                          </span>
                        </button>
                        <div className="reacts">
                          {renderLikeStatus(item)}
                          <p>{item.likes}</p>
                        </div>
                      </div>
                      <div className="date">
                        <span>{formateDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-[1.5rem] py-12">
                게시물이 존재하지 않습니다.
              </div>
            )}
          </div>
          {/* mobile */}
          <div
            className={`interview-list interview-list-mobile ${
              isNotData ? '' : '!grid-cols-1'
            } `}
          >
            {isNotData ? (
              listData.map(item => {
                return (
                  <div
                    className="interview-list-card"
                    key={`${item.id}-${item.createdAt}`}
                  >
                    <div className="interview-list-card-img">
                      <button
                        onClick={() => {
                          navigate(`/community/interview/${item.id}`);
                        }}
                      >
                        <img
                          style={{
                            cursor: 'pointer',
                            objectFit: width < 768 ? 'initial' : 'cover',
                            flexShrink: '0',
                          }}
                          src={
                            item.thumbnail && isValidImageUrl(item.thumbnail)
                              ? item.thumbnail
                              : '/assets/products/no-image.png'
                          }
                          alt={item.postTitle || 'thumbnail'}
                        />
                      </button>
                    </div>
                    <div className="products-info">
                      <div className="desc">
                        <button
                          onClick={() => {
                            navigate(`/community/interview/${item.id}`);
                          }}
                        >
                          <span>
                            {item.postTitle.length < 28
                              ? item.postTitle
                              : `${item.postTitle.substring(0, 28)}...`}
                          </span>
                        </button>
                      </div>
                      <div className="date">
                        <span>{formateDate(item.createdAt)}</span>
                        <div className="reacts">
                          {renderLikeStatus(item)}
                          <p>{item.likes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-[1.5rem] py-12">
                게시물이 존재하지 않습니다.
              </div>
            )}
          </div>
          <Pagination
            onPrevPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) - 1)
            }
            onNextPage={() =>
              handleGoToPage(Number(data?.metaData?.currentPage) + 1)
            }
            totalPages={
              data?.metaData?.totalPages ? data?.metaData?.totalPages : 1
            }
            onChangePage={handleGoToPage}
            curPage={Number(data?.metaData?.currentPage) + 1}
            canPrevPage={data?.metaData?.currentPage > 0}
            canNextPage={
              data?.metaData?.currentPage <
              Number(data?.metaData?.totalPages) - 1
            }
          />
        </>
      )}
    </div>
  );
}

export default Page;
