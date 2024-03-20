import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formateDate2, getCategoryType } from '../../../../../utils/helpers';

function DistributorListTable({ distributorList, curPage }) {
  const navigate = useNavigate();
  return (
    <div className="distributor-list-table-wrap">
      <table
        style={{
          tableLayout: 'fixed',
          borderSpacing: '0 10px',
          borderCollapse: 'separate',
        }}
      >
        <thead>
          <tr>
            <th className="distributor-list-table-col-1">No</th>
            <th className="distributor-list-table-col-3">제목</th>
            <th className="distributor-list-table-col-2">글쓴이</th>
            <th className="distributor-list-table-col-4">등록일</th>
          </tr>
        </thead>
        <tbody>
          {distributorList.map((item, index) => {
            const { createdAt, id, postTitle, postMaker, informStatus } = item;
            const informStatusCount = distributorList.filter(
              raw => raw.informStatus,
            ).length;
            return (
              <tr
                key={`${id}-${createdAt}`}
                className="distributor-list--has-border"
                onClick={() => {
                  navigate(`/community/agency_news/${id}`);
                }}
              >
                <td className="td-1">
                  {informStatus
                    ? '공지'
                    : curPage * 20 + index + 1 - informStatusCount}
                </td>
                <td>
                  {postTitle.length < 28
                    ? postTitle
                    : `${postTitle.substring(0, 28)}...`}
                </td>
                <td>{postMaker}</td>
                <td className="distribute-date">{formateDate2(createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="distributor-list-mobile">
        {distributorList.map((item, index) => {
          const { createdAt, id, postTitle, category, informStatus } = item;
          return (
            <button
              key={`${createdAt}-${id}`}
              className="distributor-item"
              onClick={() => {
                navigate(`/community/agency_news/${id}`);
              }}
            >
              <div className="row-1-distributor-information">
                {informStatus === true && (
                  <div
                    className="division-distributor"
                    style={{ backgroundColor: '#333' }}
                  >
                    공지
                  </div>
                )}
                <img src="/assets/arrow/right-arrow.png" alt="" />
              </div>
              <div className="row-2-distributor-information">
                {postTitle.length < 28
                  ? postTitle
                  : `${postTitle.substring(0, 28)}...`}
              </div>
              <div className="row-3-distributor-information">
                {formateDate2(createdAt)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DistributorListTable;
