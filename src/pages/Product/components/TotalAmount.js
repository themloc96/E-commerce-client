import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../../utils/helpers';

export default function TotalAmount(props) {
  const {
    onToggle,
    onAddToCart,
    totalAmount,
    optionPrice,
    quantityValue,
    selectedOption,
    moveFlag,
  } = props;

  const checkSelectedOption = () => {
    if (selectedOption === null || selectedOption === undefined) {
      alert('옵션을 선택해 주세요.');
      return false;
    }
    return true;
  };
  return (
    <section className="product-total-amount mt-[24px] lg:mt-[29px] pb-[41.5px]">
      <div className="flex justify-between">
        <span className="f18Medium lg:f20Medium">총 상품 금액</span>
        <div
          className="font-semibold text-primary mr-[17px] lg:mr-[-2px] lg:mt-0"
          style={{ lineHeight: 1 }}
        >
          <span data-testid="total-amount" className="lg:mr-1 txt-total">
            {formatNumber(
              (totalAmount + Math.round(optionPrice * 1.1)) * quantityValue,
            )}
          </span>
          <span className="font-normal text-[19px] txt-sub-total">원</span>
        </div>
      </div>
      <div className="flex justify-between btn-group">
        <button
          onClick={() => {
            if (checkSelectedOption() === false) return;
            onAddToCart();
            onToggle();
          }}
        >
          <span>장바구니 담기</span>
        </button>
        <button
          className="shopping-cart-btn"
          onClick={() => {
            if (checkSelectedOption() === false) return;
            onAddToCart();
            moveFlag();
          }}
        >
          <span>주문하기</span>
        </button>
      </div>
    </section>
  );
}
