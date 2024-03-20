import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import FieldSearch from '../../../components/Input/FieldSearch';
import InstallationProductTable from './components/InstallationProductTable';

import '../../../styles/customer/installation-products.scss';
import useProducts from './hooks';
import { SELECT_PRODUCT_LS } from '../constants';
import FullScreenLoader from '../../../components/Loading/FullScreenLoader';

export default function InstallationProductsPage() {
  const navigate = useNavigate();
  // HOOK HANDLE FETCH API AND CHANGE STATE
  const {
    products,
    handleChangeChecked,
    handleChangeSearchValue,
    handleSearch,
    handleKeyDown,
    isLoading,
  } = useProducts();

  const handleSelectProduct = () => {
    const selectedProduct = products?.find(item => item.checked);
    if (selectedProduct) {
      localStorage.setItem(SELECT_PRODUCT_LS, JSON.stringify(selectedProduct));
    }
    navigate(-1);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="installation-products">
      <Container>
        <FieldSearch
          onClick={handleSearch}
          onChange={handleChangeSearchValue}
          onKeyDown={handleKeyDown}
          placeholder="품번/모델명을 입력해주세요."
        />
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
      </Container>
    </div>
  );
}
