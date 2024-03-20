import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useShoppingCartContext } from '../../contexts/ShoppingCartProvider';
import headerStyles from '../../styles/components/header.module.scss';
import { useAuthContext } from '../../contexts/AuthProvider';
import { shippingCartListFn } from '../../apis/shipping.api';

function CartIconDesktop() {
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { currentUser } = state;

  const { data } = useQuery(
    ['shippingCart', currentUser?.id],
    () => shippingCartListFn(currentUser?.id),
    {
      keepPreviousData: true,
      onError: error => {
        console.log(error);
      },
      // onSuccess: _data => {
      //   console.log(_data);
      // },
    },
  );

  return (
    <div
      className={headerStyles['keyin-shopping-cart']}
      role="button"
      tabIndex={0}
      onClick={() => navigate('/cart')}
    >
      <div className={headerStyles.icon}>
        <img src="/assets/cart/shopping.svg" alt="" />
        {data?.list.length > 0 && (
          <span className={headerStyles.number}>{data?.list.length}+</span>
        )}
      </div>
      <span className={headerStyles.title}>장바구니</span>
    </div>
  );
}

export default CartIconDesktop;
