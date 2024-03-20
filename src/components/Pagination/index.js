import React, { memo, useEffect, useState } from 'react';
import '../../styles/components/pagination.scss';

function Pagination(props) {
  const {
    onPrevPage,
    onNextPage,
    curPage = 1,
    canPrevPage,
    canNextPage,
    totalPages = 1,
    onChangePage = () => null,
  } = props;

  const [startWith, setStartWith] = useState(0);

  useEffect(() => {
    if (curPage > startWith + 5) setStartWith(prevState => prevState + 1);
    if (curPage < startWith + 1) setStartWith(prevState => prevState - 1);
  }, [curPage]);

  return (
    <div className="pagination">
      <button onClick={onPrevPage} disabled={!canPrevPage}>
        <svg
          width="19"
          height="19"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m10.75 2-6 6 6 6"
            stroke={!canPrevPage ? 'rgba(51, 51, 51, 0.5)' : '#333333'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {Array.from({ length: totalPages }).map((item, index) => {
        const flag =
          totalPages <= 4 || (index >= startWith && index <= startWith + 4);
        return (
          flag && (
            // eslint-disable-next-line
            <span key={`${curPage}-${index}`} className={curPage === index + 1 ? 'active-pagination' : ''}>
              <button onClick={() => onChangePage(index)}>{index + 1}</button>
            </span>
          )
        );
      })}
      <button onClick={onNextPage} disabled={!canNextPage}>
        <svg
          width="19"
          height="19"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m6.25 14 6-6-6-6"
            stroke={!canNextPage ? 'rgba(51, 51, 51, 0.5)' : '#333333'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default memo(Pagination);
