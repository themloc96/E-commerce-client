import React, { useEffect, useState } from 'react';

import FieldSearch from '../../../../components/Input/FieldSearch';
import LoadingBox from '../../../../components/Loading/LoadingBox';
import ViewDetailProductButton from '../../../../components/Shared/ViewDetailProductButton';
import { IndCheckbox } from '../../../../components/WTable/IndCheckbox';
import ModalComponent from '../../../../components/core/modal-base';
import { formatCost } from '../../../../utils/helpers';
import useMaterials from '../hooks/useMaterials';

function MaterialModal({ isOpen, onClose, onAddToMaterials }) {
  const {
    isFetching,
    isLoading,
    handleSearch,
    handleChangeSearchValue,
    handleKeyDown,
    handleChangeChecked,
    handleChangeAllChecked,
    items: productList,
    handleResetChecked,
  } = useMaterials();

  const isCheckedAll =
    productList?.length === 0 ? false : productList.every(item => item.checked);

  const handleClose = () => {
    handleResetChecked();
    onClose();
  };

  return (
    <ModalComponent
      title="사용 자재 추가"
      isOpen={isOpen}
      className="modal-add-used-material"
      name="add-used-material"
      // styleConfig={styleConfigModalTable}
      closeModal={handleClose}
      styleTitle={{
        fontFamily: 'Noto Sans KR',
        fontSize: '30px',
        fontWeight: '500',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textAlign: 'left',
        color: '#333',
      }}
    >
      <div className="line" />
      <FieldSearch
        onClick={handleSearch}
        onChange={handleChangeSearchValue}
        onKeyDown={handleKeyDown}
        placeholder="모델명을 입력해주세요."
      />
      {isLoading && <LoadingBox />}
      <div className={`content ${isFetching ? 'section-loading' : ''}`}>
        <table>
          <thead>
            <tr className="header">
              <th className="col-1">
                <span className="pl-[28px]">
                  <IndCheckbox
                    onChange={handleChangeAllChecked}
                    checked={isCheckedAll}
                  />
                </span>
              </th>
              <th className="col-2">
                <span>No</span>
              </th>
              <th className="col-3">
                <span>품번</span>
              </th>
              <th className="col-4">
                <span>모델명</span>
              </th>
              <th className="col-5">
                <span>단가(원)</span>
              </th>
              {/* <th className="col-6">
                <span>현재고</span>
              </th> */}
              <th className="col-7">
                <span>제품정보</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {productList?.map(item => {
              const {
                id,
                productCode,
                productName,
                price,
                checked,
                uniqueId,
                defaultProductId,
                defaultProductName,
                public: flag,
              } = item;
              return (
                <tr key={`${id}-${uniqueId}`}>
                  <td className="col-1">
                    <span className="pl-[28px]">
                      <IndCheckbox
                        onChange={e =>
                          handleChangeChecked(e?.target?.checked, uniqueId)
                        }
                        checked={checked}
                      />
                    </span>
                  </td>
                  <td className="col-2">
                    <span>{id}</span>
                  </td>
                  <td className="col-3">
                    <span>{productCode}</span>
                  </td>
                  <td className="col-4">
                    <span>{productName}</span>
                  </td>
                  <td className="col-5">
                    <span>{formatCost(price)}</span>
                  </td>
                  {/* <td className="col-6">
                    <span>3</span>
                  </td> */}
                  <td className="col-7">
                    {flag && (
                      <ViewDetailProductButton
                        productName={defaultProductName}
                        productId={defaultProductId}
                        label="확인"
                        isOpenNewTab
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="btn">
          <button
            onClick={() => {
              const selectedItems = productList
                ?.filter(item => item.checked)
                ?.map(item => {
                  return {
                    id: item?.id,
                    code: item?.productCode,
                    name: item?.productName,
                    quantity: 1,
                    returnStatus: 'DEFAULT',
                    price: item?.price,
                  };
                });
              onAddToMaterials(selectedItems);
              handleClose();
            }}
          >
            <span>자재 추가</span>
          </button>
        </div>
      </div>
    </ModalComponent>
  );
}

export default MaterialModal;
