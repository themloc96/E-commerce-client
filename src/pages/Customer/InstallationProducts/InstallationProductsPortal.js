import React from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import FieldSearch from '../../../components/Input/FieldSearch';
import InstallationProductTable from './components/InstallationProductTable';

import MobileHeader from '../../../components/core/mobile-header';
import '../../../styles/customer/installation-products.scss';
import useProducts from './hooks';
import LoadingBox from '../../../components/Loading/LoadingBox';

export default function InstallationProductsPortal({ onClose, setValue }) {
  // HOOK HANDLE FETCH API AND CHANGE STATE
  const {
    products,
    handleChangeChecked,
    handleChangeSearchValue,
    handleSearch,
    handleKeyDown,
    isLoading,
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
  return createPortal(
    <>
      <MobileHeader name="설치 제품 선택" onBack={onClose} />
      <div className="installation-products">
        <Container>
          <FieldSearch
            onClick={handleSearch}
            onChange={handleChangeSearchValue}
            onKeyDown={handleKeyDown}
            placeholder="품번/모델명을 입력해주세요."
          />
          {isFetching ? (
            <div className='mt-6'>
              <LoadingBox />
            </div>
          ) : (
            <>
              <InstallationProductTable
                listData={products}
                handleChangeChecked={handleChangeChecked}
              />
              <div className="installation-btn-wrap">
                <Button
                  fullWidth
                  variant="outline-gray"
                  onClick={handleSelectProduct}
                >
                  <span>제품선택</span>
                </Button>
              </div>
            </>
          )}
        </Container>
      </div>
    </>,
    document.getElementById('root'),
  );
}
