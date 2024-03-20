import React, { useState } from 'react';
import { formatCost } from '../../../../utils/helpers';
import { Input } from '../../../../components/Input';
import { useWindowDimensions } from '../../../../hooks';

export default function MaterialSection({
  productMaterials,
  handleChangeItems,
  handleChangeChecked,
  handleChangeAllChecked,
  onToggleMaterial,
  onTogglePortal,
}) {
  const { width } = useWindowDimensions();

  const isCheckedAll =
    productMaterials?.length === 0
      ? false
      : productMaterials?.every(item => item.checked);

  const handleChangeQuantity = (value, uniqueId) => {
    const newValue = value.replace(/[^0-9]/g, '');
    const newMaterials = productMaterials?.map(item => {
      if (item?.uniqueId === uniqueId) {
        return {
          ...item,
          quantity: newValue !== '' ? Number(newValue) : '',
        };
      }
      return item;
    });
    handleChangeItems(newMaterials);
  };

  // 포커스가 벗어났을 때 호출되는 함수
  const handleInputBlur = (value, uniqueId) => {
    if (value === '' || value === '0') {
      const newMaterials = productMaterials?.map(item => {
        if (item?.uniqueId === uniqueId) {
          return {
            ...item,
            quantity: 1,
          };
        }
        return item;
      });
      handleChangeItems(newMaterials);
    }
  };

  const handleDeleteSelectedItems = () => {
    const filteredList = productMaterials?.filter(item => !item?.checked);
    handleChangeItems(filteredList);
  };
  return (
    <div className="estimated-material">
      <div className="title">
        <h2>
          사용 자재
          {/* {width < 767 && (
            <i className={!isOpenCollapse ? 'ico-dropdown' : 'ico-dropup'} />
          )} */}
        </h2>
        {width > 767 && (
          <div className="group-btn">
            <div className="btn">
              <button onClick={onToggleMaterial}>
                <span>추가</span>
              </button>
            </div>
            <div className="btn">
              <button onClick={handleDeleteSelectedItems}>
                <span>삭제</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="line" />
      <div className="registration-table case-warning">
        <table>
          <thead>
            <tr className="header">
              <th className="col-1">
                <input
                  label=""
                  name="customerDetailedAddress"
                  className="styled-checkbox"
                  id="termAll"
                  type="checkbox"
                  value="value2"
                  onChange={handleChangeAllChecked}
                  checked={isCheckedAll}
                  readOnly
                />
                <label htmlFor="termAll" />
              </th>
              <th className="col-2">
                <span>품번</span>
              </th>
              <th className="col-3">
                <span>품명</span>
              </th>
              <th className="col-4">
                <span>수량</span>
              </th>
              <th className="col-5">
                <span>소비자가</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {productMaterials?.map(item => {
              const { id, code, name, checked, quantity, price, uniqueId } =
                item;
              return (
                <tr key={id}>
                  <td className="col-1">
                    <input
                      label=""
                      name="customerDetailedAddress"
                      className="styled-checkbox"
                      id={id}
                      type="checkbox"
                      value="value2"
                      checked={checked}
                      onChange={e =>
                        handleChangeChecked(e?.target?.checked, uniqueId)
                      }
                    />
                    <label htmlFor={id} />
                  </td>
                  <td className="col-2">
                    <span>{code}</span>
                  </td>
                  <td className="col-3">
                    <span>{name}</span>
                  </td>
                  <td className="col-4">
                    <Input
                      classes="!w-[80px] text-center"
                      type="text"
                      label=""
                      name="customerName"
                      placeholder=""
                      onChange={e =>
                        handleChangeQuantity(e?.target?.value, uniqueId)
                      }
                      value={quantity}
                      onBlur={e => handleInputBlur(e?.target.value, uniqueId)}
                    />
                  </td>
                  <td className="col-5">
                    <span>{formatCost(price)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {width < 767 && (
          <div className="group-btn">
            <div className="btn">
              <button onClick={handleDeleteSelectedItems}>
                <span>삭제</span>
              </button>
            </div>
            <div className="btn">
              <button onClick={onTogglePortal}>
                <span>추가</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
