import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../../utils/helpers';
import { useShoppingCartContext } from '../../../contexts/ShoppingCartProvider';

export default function CartBottom({
  totalAmount,
  isDisableBtnOrder,
  productList,
}) {
  const shoppingCartCtx = useShoppingCartContext();
  const { setProducts } = shoppingCartCtx;
  const navigate = useNavigate();
  setProducts(productList);
  return (
    <div className="cart-bottom">
      <div className="total-amount-wrap">
        <span className="text">결제 예정금액</span>
        <img src="/assets/icons/sum-icon.png" alt="sum-icon" />
        <span className="value">{formatNumber(totalAmount)}원</span>
      </div>
      <div className="cart-bottom-cart-action">
        <button
          className="view-more-product-btn"
          onClick={() => navigate('/order/keyin-smart-lock')}
        >
          <span>상품 더 보기</span>
        </button>
        <button
          className="buy-btn"
          disabled={isDisableBtnOrder}
          onClick={() => navigate('/cart/order')}
        >
          <span>주문하기</span>
        </button>
      </div>
    </div>
  );
}
