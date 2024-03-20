import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// COMPs
import Container from '../../../components/Container';
import LoadingBox from '../../../components/Loading/LoadingBox';
import Pagination from '../../../components/Pagination';
import FieldSearch from '../../../components/Input/FieldSearch';

import { searchPostFn } from '../../../apis/post.api';
import { serviceTabs, serviceTabsUrlHash } from '../../../constants';
import { useQueryParams, useWindowDimensions } from '../../../hooks';
import '../../../styles/as-status/service-note.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { formateDate2, getCategoryType } from '../../../utils/helpers';

function ServiceNote() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { filterParamsObj } = useQueryParams();
  const [search, setSearch] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [serviceTab, setServiceTab] = useState('ALL');

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}
          `}
      </style>
    );
  }

  const handleChangeCurrentTab = (e, tab, hashURL) => {
    navigate({ hash: hashURL });
    setServiceTab(tab);
  };

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

  const { isLoading, data } = useQuery(
    ['v1/post/search', filterParamsObj, searchFlag, serviceTab],
    () => {
      return searchPostFn({
        page: search ? 0 : Number(filterParamsObj?.page || 0),
        channel: 'QUALITY',
        title: search,
        category: serviceTab === 'ALL' ? undefined : serviceTab,
        sort: 'SORT_DESC'
      });
    },
    {
      keepPreviousData: true,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setSearchFlag(false);
      },
    },
  );

  // search
  const onClickSearch = e => {
    setSearchFlag(true);
  };

  const handleKeyDown = event => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      setSearch(event.target.value);
      setSearchFlag(true);
    }
  };

  return (
    <>
      <Style />
      <div>
        <Container className={`${storeStyles.container} wrapper-service-note`}>
          <div
            className={`${storeStyles['keyin-header']} service-note-heading`}
          >
            <span className="!text-textSecondary4">품질 게시판</span>
          </div>
          <FieldSearch
            placeholder="제목을 입력해주세요."
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={onClickSearch}
          />
          <div className="wrapper-tab">
            <button
              onClick={e =>
                handleChangeCurrentTab(
                  e,
                  serviceTabs.ALL,
                  serviceTabsUrlHash.ALL,
                )
              }
              className={`tab ${
                serviceTab === serviceTabs.ALL ? 'active' : ''
              }`}
            >
              <span>전체</span>
            </button>
            <button
              onClick={e =>
                handleChangeCurrentTab(
                  e,
                  serviceTabs.OPERATE,
                  serviceTabsUrlHash.OPERATE,
                )
              }
              className={`tab ${
                serviceTab === serviceTabs.OPERATE ? 'active' : ''
              }`}
            >
              <span>운영관련</span>
            </button>
            <button
              onClick={e =>
                handleChangeCurrentTab(
                  e,
                  serviceTabs.QUALITY_TECHNOLOGY,
                  serviceTabsUrlHash.QUALITY_TECHNOLOGY,
                )
              }
              className={`tab ${
                serviceTab === serviceTabs.QUALITY_TECHNOLOGY ? 'active' : ''
              }`}
            >
              <span>품질/기술</span>
            </button>
          </div>
          {isLoading ? (
            <LoadingBox />
          ) : (
            <div className="content">
              {width > 767 ? (
                <div className="wrapper-table">
                  <table style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="header">
                        <th className="col-1">
                          <span>No</span>
                        </th>
                        <th className="col-2">
                          <span>모델명</span>
                        </th>
                        <th className="col-3">
                          <span>제목</span>
                        </th>
                        <th className="col-4">
                          <span>등록일</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data?.list.map((item, index) => {
                        const {
                          id,
                          category,
                          postProductModel,
                          postTitle,
                          createdAt,
                        } = item;
                        return (
                          <tr key={id}>
                            <td className="col-1">
                              <span>
                                {Number(data?.metaData?.currentPage) * 10 +
                                  index +
                                  1}
                              </span>
                            </td>
                            <td className="col-2">
                              <span>{postProductModel}</span>
                            </td>
                            <td className="col-3">
                              <div className="wrapper">
                                <div className="btn">
                                  <span>{getCategoryType(category)}</span>
                                </div>
                                <div className="txt">
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/as/quality/${category.toLowerCase()}/${id}`,
                                      );
                                    }}
                                  >
                                    <span>
                                      {postTitle.length < 28
                                        ? postTitle
                                        : `${postTitle.substring(0, 28)}...`}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="col-4">
                              <span>{formateDate2(createdAt)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="wrapper-block">
                  {data?.data?.list.map(item => {
                    const { id, category, postTitle, createdAt } = item;
                    return (
                      <div className="block">
                        <div className="block-title">
                          <button className="title-button">
                            {getCategoryType(category)}
                          </button>
                          <button
                            className="icon-button"
                            onClick={() => {
                              navigate(
                                `/as/quality/${category.toLowerCase()}/${id}`,
                              );
                            }}
                          >
                            <i className="icon" />
                          </button>
                        </div>
                        <div className="block-txt">
                          <button
                            onClick={() => {
                              navigate(
                                `/as/quality/${category.toLowerCase()}/${id}`,
                              );
                            }}
                          >
                            <span>
                              {postTitle.length < 28
                                ? postTitle
                                : `${postTitle.substring(0, 28)}...`}
                            </span>
                          </button>
                        </div>
                        <div className="block-date">
                          <span>{formateDate2(createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
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
        </Container>
      </div>
    </>
  );
}

export default ServiceNote;
