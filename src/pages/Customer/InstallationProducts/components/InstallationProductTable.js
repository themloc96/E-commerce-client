import React from 'react';
import { IndCheckbox } from '../../../../components/WTable/IndCheckbox';
import { useWindowDimensions } from '../../../../hooks';
import { formatNumber } from '../../../../utils/helpers';

function InstallationProductTable({ listData, handleChangeChecked }) {
  const { width } = useWindowDimensions();
  return (
    <div className="installation-products-table-wrap">
      <table>
        <tr>
          <th>{null}</th>
          <th>No</th>
          <th>품번</th>
          <th>{width > 768 ? '모델명' : '품명'}</th>
          <th>{width > 768 ? '단가(원)' : '단가'}</th>
        </tr>
        {listData?.map((item, index) => {
          const { id, checked, code, modelName, price } = item;
          return (
            <tr key={id}>
              <td className="td-1">
                <IndCheckbox
                  onChange={e => {
                    handleChangeChecked(e?.target?.checked, id);
                  }}
                  checked={checked}
                />
              </td>
              <td className="font-roboto">{index + 1}</td>
              <td className="font-roboto">{code}</td>
              <td>{modelName}</td>
              <td className="font-roboto">{formatNumber(price)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default InstallationProductTable;
