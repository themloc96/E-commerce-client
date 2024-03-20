import React from 'react';
import Container from '../../../../components/Container';
import FieldSearch from '../../../../components/Input/FieldSearch';
import useMaterials from '../hooks/useMaterials';

import '../../../../styles/as-status/popup-mobile.scss';
import { formatNumber, generateNameId } from '../../../../utils/helpers';
import LoadingBox from '../../../../components/Loading/LoadingBox';

export default function MaterialMobile({ onTogglePortal, onAddToMaterials }) {
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
    onTogglePortal();
  };

  const onClickProductPage = (id, name) => {
    window.open(`/product/${generateNameId({ id, name })}`);
  };

  return (
    <Container className="wrapper-action-result">
      <div className="popup-add-used-material">
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
                  <input
                    className="styled-checkbox"
                    id="no1"
                    type="checkbox"
                    readOnly
                    defaultValue="value2"
                    checked={isCheckedAll}
                    onChange={handleChangeAllChecked}
                  />
                  <label htmlFor="no1" />
                </th>
                <th className="col-2">
                  <span>No</span>
                </th>
                <th className="col-3">
                  <span>품번</span>
                </th>
                <th className="col-4">
                  <span>품명</span>
                </th>
                <th className="col-5">
                  <span>단가</span>
                </th>
                {/* <th className="col-6">
                  <span>현재고</span>
                </th> */}
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
                } = item;
                return (
                  <tr key={`${id}-${uniqueId}`}>
                    <td className="col-1">
                      <input
                        className="styled-checkbox"
                        id={id}
                        type="checkbox"
                        readOnly
                        defaultValue="value2"
                        onChange={e =>
                          handleChangeChecked(e?.target?.checked, uniqueId)
                        }
                        checked={checked}
                      />
                      <label htmlFor={id} />
                    </td>
                    <td className="col-2">
                      <span>{id}</span>
                    </td>
                    <td className="col-3">
                      <span>{productCode}</span>
                    </td>
                    <td className="col-4">
                      <span>
                        <button
                          style={{
                            width: '48px',
                            textDecoration: 'underline',
                            wordWrap: 'break-word',
                          }}
                          onClick={() =>
                            onClickProductPage(
                              defaultProductId,
                              defaultProductName,
                            )
                          }
                        >
                          {productName}
                        </button>
                      </span>
                    </td>
                    <td className="col-5">
                      <span>{formatNumber(price)}</span>
                    </td>
                    {/* <td className="col-6">
                      <span>1</span>
                    </td> */}
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
      </div>
    </Container>
  );
}
