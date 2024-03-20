import React from 'react';
import { formatShortDate } from '../../../../utils/helper.dateTime';
import { formatNumber } from '../../../../utils/helpers';

function MaterialOrderListTable({ dataList }) {
  return (
    <div className="material-order-list-table-wrap">
      <table>
        <tr>
          <th>No</th>
          <th>요청일</th>
          <th>품명</th>
          <th>수량</th>
          <th>단가</th>
          <th>공급가액</th>
          <th>VAT</th>
          <th>비고</th>
        </tr>
        {dataList?.map((raw, index) => {
          const { updatedAt, asMaterial, quantity, totalPrice, vat } = raw;
          return (
            <tr>
              <td>{index + 1}</td>
              <td>{formatShortDate(updatedAt)}</td>
              <td>{asMaterial.productName}</td>
              <td>{quantity}</td>
              <td>{formatNumber(asMaterial.price)}</td>
              <td>{formatNumber(totalPrice)}</td>
              <td>{formatNumber(vat)}</td>
              <td>{asMaterial.description}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default MaterialOrderListTable;
