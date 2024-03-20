import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useWindowDimensions } from '../../../../hooks';

function CustomerListTable({ listData }) {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const isDesktop = width >= 768;
  return (
    <div className="customers-table-wrap">
      <table className="w-full">
        <tr>
          <th>설치일</th>
          <th>고객명</th>
          <th>연락처</th>
          {isDesktop && <th>주소</th>}
          {isDesktop ? <th>모델명</th> : <th>설치 제품</th>}
        </tr>
        {listData?.length > 0 &&
          listData.map(item => {
            // const { createdAt, id, name, contact, product, address } = item;
            const {
              createdAt,
              id,
              clientName,
              clientPhone,
              clientAddress,
              productModelName,
            } = item;
            const parts = createdAt?.split(' ');
            const datePart = parts[0];

            return (
              <tr
                className="cursor-pointer"
                key={id}
                onClick={() => {
                  navigate(`/customers/${id}/edit`);
                }}
              >
                <td>{datePart}</td>
                <td>{clientName}</td>
                <td>{clientPhone}</td>
                {isDesktop && <td>{clientAddress}</td>}
                <td>{productModelName}</td>
              </tr>
            );
          })}
      </table>
    </div>
  );
}

export default CustomerListTable;
