import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
// component
import AllStoryTableList from './components/AllStoryTableList';
import Container from '../../../../components/Container';
import Pagination from '../../../../components/Pagination';
import LoadingBox from '../../../../components/Loading/LoadingBox';
// style
import '../../../../styles/community/story/all-story.scss';
import '../../../../styles/community/story/main.scss';

// hook
import { useQueryParams } from '../../../../hooks';
// api
import { searchPostFn } from '../../../../apis/post.api';

function index({ categoryType }) {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { filterParamsObj } = useQueryParams();

  const [storyList, setStoryList] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);

  const refInput = useRef('');

  const { isLoading, data, isFetching } = useQuery(
    ['v1/post/search', filterParamsObj, searchFlag, categoryType],
    () => {
      return searchPostFn({
        page: search ? 0 : Number(filterParamsObj?.page || 0),
        channel: 'RAONARK_STORY',
        title: search,
        category: categoryType,
        sort: "SORT_DESC",
      });
    },
    {
      keepPreviousData: true,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setSearchFlag(false);
        setStoryList(_data?.data?.list);
      },
    },
  );

  const handleGoToPage = pageNumber => {
    navigate({
      hash,
      search: `?page=${pageNumber}`,
    });
  };

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
    <div className="all-story">
      <div className="all-story-search">
        <div className="search">
          <input
            className="input-search"
            placeholder="제목을 입력해주세요."
            defaultValue={refInput.current.value}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={e => onClickSearch(e)}>
            <img src="/assets/icons/search.png" alt="Search" />
          </button>
        </div>
      </div>
      <Container className="employee-container">
        <div
          className={`all-story-content ${isFetching ? 'section-loading' : ''}`}
        >
          {isLoading ? (
            <LoadingBox />
          ) : (
            <AllStoryTableList
              storyList={storyList}
              curPage={Number(data?.metaData?.currentPage)}
            />
          )}
          {storyList?.length === 0 && (
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
            data?.metaData?.currentPage < Number(data?.metaData?.totalPages) - 1
          }
        />
      </Container>
    </div>
  );
}

export default index;
