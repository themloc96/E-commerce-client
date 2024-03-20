import React from 'react';
import ArrowLeftIcon from '../../../../components/Svg/ArrowLeftIcon';

function Pagination() {
  return (
    <div className="employee-pagination">
      <div>
        <ArrowLeftIcon
          stroke="rgba(51, 51, 51, 0.5)"
          className="prev-btn"
          height={24}
          width={24}
        />
      </div>
      <span>1</span>
      <div>
        <ArrowLeftIcon className="next-btn" height={24} width={24} />
      </div>
    </div>
  );
}

export default Pagination;
