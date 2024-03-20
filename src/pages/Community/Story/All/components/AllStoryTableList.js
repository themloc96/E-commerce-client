import { useNavigate } from 'react-router-dom';
import React from 'react';
import { formateDate2, getCategoryType } from '../../../../../utils/helpers';

function AllStoryTableList({ storyList, curPage }) {
  const navigate = useNavigate();

  return (
    <div className="all-story-table-wrap">
      <table
        style={{
          tableLayout: 'fixed',
          borderSpacing: '0 10px',
          borderCollapse: 'separate',
        }}
      >
        <thead>
          <tr>
            <th className="all-story-table-col-1">No</th>
            <th className="all-story-table-col-2">구분</th>
            <th className="all-story-table-col-3">제목</th>
            <th className="all-story-table-col-4">등록일</th>
          </tr>
        </thead>
        <tbody>
          {storyList.map((item, index) => {
            const { id, category, postTitle, createdAt, channel } = item;
            return (
              <tr className="all-story--has-border" key={`${id}-${createdAt}`}>
                <td className="td-1">{curPage * 20 + index + 1}</td>
                <td>
                  <div
                    className="division-column"
                    style={{ background: '#333' }}
                  >
                    <span>{getCategoryType(category)}</span>
                  </div>
                </td>
                <td
                  style={{
                    cursor: 'pointer',
                    maxWidth: '10rem',
                    wordBreak: 'break-all',
                  }}
                  onClick={() => {
                    navigate(
                      `/community/raonark_story/${category.toLowerCase()}/${id}`,
                    );
                  }}
                >
                  {postTitle.length < 28
                    ? postTitle
                    : `${postTitle.substring(0, 28)}...`}
                </td>
                <td className="story-date">{formateDate2(createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="story-list-mobile">
        {storyList.map((item, index) => {
          const { id, category, postTitle, createdAt, channel } = item;
          return (
            <div className="story-item" key={`${createdAt}-${id}`}>
              <div className="row-1-story-information">
                <div
                  className="division-story"
                  style={{ backgroundColor: '#333' }}
                >
                  {getCategoryType(category)}
                </div>
                <button
                  onClick={() => {
                    navigate(
                      `/community/raonark_story/${category.toLowerCase()}/${id}`,
                    );
                  }}
                >
                  <img src="/assets/arrow/right-arrow.png" alt="" />
                </button>
              </div>
              <div className="row-2-story-information">
                <button
                  onClick={() => {
                    navigate(
                      `/community/raonark_story/${category.toLowerCase()}/${id}`,
                    );
                  }}
                >
                  {postTitle.length < 28
                    ? postTitle
                    : `${postTitle.substring(0, 28)}...`}
                </button>
              </div>
              <div className="row-3-story-information">
                {formateDate2(createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllStoryTableList;
