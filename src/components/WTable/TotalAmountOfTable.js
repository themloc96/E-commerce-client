import React from 'react';
import '../../styles/components/wtable.scss';
import { useWindowDimensions } from '../../hooks';

function TotalAmountOfTable({
  totalAmountValue,
  elementText,
  isCheckDataEmpty,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isCustomStyleNotData =
    isDesktop && !totalAmountValue && !isCheckDataEmpty;
  const isUpdatePadding = isCustomStyleNotData ? '326px' : '290px';

  return (
    <div className="w-table">
      <div
        style={{
          paddingRight: isDesktop && isUpdatePadding,
        }}
        className="total-amount"
      >
        <div className="total-amount-text">{elementText}</div>
        <div className="total-amount-img">
          <img
            className="pc-only-current"
            alt="sum"
            src="/assets/app/sum-dark.svg"
          />
        </div>
        <div className="total-amount-value">{totalAmountValue}</div>
      </div>
    </div>
  );
}

export default TotalAmountOfTable;
