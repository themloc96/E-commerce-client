import React from 'react';

import Button from '../../../components/Button';
import FieldSearch from '../../../components/Input/FieldSearch';
import ModalComponent from '../../../components/core/modal-base';
import InstallationProductTable from './components/InstallationProductTable';
import useProducts from './hooks';
import LoadingBox from '../../../components/Loading/LoadingBox';

function InstallationProductsModal({ isOpen, onClose, setValue }) {
  const {
    products,
    handleChangeChecked,
    handleChangeSearchValue,
    handleSearch,
    handleKeyDown,
    isFetching,
  } = useProducts();

  const handleSelectProduct = () => {
    const selectedProduct = products?.find(item => item.checked);
    if (selectedProduct) {
      setValue('modelName', selectedProduct.modelName);
      setValue('productId', selectedProduct.id);
    }
    onClose();
    handleChangeChecked(false);
  };

  return (
    <ModalComponent
      className="installation-products-modal"
      isOpen={isOpen}
      closeModal={onClose}
      title="설치 제품 선택"
    >
      <FieldSearch
        onClick={handleSearch}
        onChange={handleChangeSearchValue}
        onKeyDown={handleKeyDown}
        placeholder="품번/모델명을 입력해주세요."
      />
      {isFetching ? (
        <div className="mt-6">
          <LoadingBox />
        </div>
      ) : (
        <>
          <InstallationProductTable
            listData={products}
            handleChangeChecked={handleChangeChecked}
          />
          <Button
            className="installation-btn"
            variant="ghost"
            onClick={handleSelectProduct}
          >
            <span>제품 선택</span>
          </Button>
        </>
      )}
    </ModalComponent>
  );
}

export default InstallationProductsModal;
