import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryParams } from '../../../../hooks';
import LoadingBox from '../../../../components/Loading/LoadingBox';
// api
import { searchPostFn } from '../../../../apis/post.api';

import { useDebounce } from '../../../../hooks/useDebounce';

// component
import DistributorListTable from './components/DistributorListTable';
import Container from '../../../../components/Container';
import Pagination from '../../../../components/Pagination';

// style
import '../../../../styles/community/distributor/distributor-list.scss';
import '../../../../styles/community/distributor/main.scss';

// hook

function index() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [distributorList, setDistributorList] = useState([]);
  const { filterParamsObj } = useQueryParams();
  const [search, setSearch] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);

  const refInput = useRef('');

  const { isLoading, data } = useQuery(
    ['v1/post/search', filterParamsObj, searchFlag],
    () => {
      return searchPostFn({
        page: search ? 0 : Number(filterParamsObj?.page || 0),
        channel: 'AGENCY_NEWS',
        inform: true,
        title: search,
      });
    },
    {
      keepPreviousData: true,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setSearchFlag(false);
        setDistributorList(_data?.data?.list);
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
    <div className="distributor-list">
      <div className="distributor-list-search">
        <div className="search">
          <input
            className="input-search"
            placeholder="검색어를 입력해주세요."
            defaultValue={refInput.current.value}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={refInput}
          />
          <button onClick={e => onClickSearch(e)}>
            <img src="/assets/icons/search.png" alt="Search" />
          </button>
        </div>
      </div>
      <Container className="employee-container">
        <div className="distributor-list-content">
          <div className="distributor-list-content-header">
            <p>대리점 게시판</p>
            <button
              onClick={() => {
                navigate(`/community/agency_news/create`);
              }}
            >
              글쓰기
            </button>
          </div>
          <hr className="distributor-list-content-hr" />
          {isLoading ? (
            <LoadingBox />
          ) : (
            <DistributorListTable
              distributorList={distributorList}
              curPage={Number(data?.metaData?.currentPage)}
            />
          )}
          {distributorList?.length === 0 && (
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
