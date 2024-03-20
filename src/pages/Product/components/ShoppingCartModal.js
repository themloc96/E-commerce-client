import React, { forwardRef, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '../../../components/core/modal-base';
import { useOnClickOutside } from '../../../hooks';
import '../../../styles/product/main.scss';

function ShoppingCartModal(props) {
  const navigate = useNavigate();
  const { isOpen, onClose } = props;
  const ref = useRef();
  
  useOnClickOutside(ref, () => onClose());
  const onRedirectToCart = () => navigate('/cart');

  return (
    <ModalComponent
      refs={ref}
      className="shopping-cart-modal"
      isOpen={isOpen}
      closeModal={onClose}
    >
      <h3 className="shopping-cart-modal-title">
        장바구니에 상품이 담겼습니다.
      </h3>
      <button
        className="shopping-cart-modal-go-to-cart-btn"
        onClick={onRedirectToCart}
      >
        <span className="text-primary">장바구니 바로가기</span>
      </button>
    </ModalComponent>
  );
}

ShoppingCartModal.propTypes = {};

export default forwardRef(ShoppingCartModal);
