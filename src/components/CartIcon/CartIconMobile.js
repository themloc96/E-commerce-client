import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useShoppingCartContext } from '../../contexts/ShoppingCartProvider';
import styles from '../../styles/components/mobile-header-base.module.scss';
import { shippingCartListFn } from '../../apis/shipping.api';
import { useAuthContext } from '../../contexts/AuthProvider';

function CartIconMobile() {
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
      className={styles.shoppingCart}
      role="button"
      tabIndex={0}
      onClick={() => navigate('/cart')}
    >
      <img src="/assets/cart/shopping.svg" alt="" />
      {data?.list.length > 0 && (
        <div className={styles.number}>
          <span>{data?.list.length}+</span>
        </div>
      )}
    </div>
  );
}

export default CartIconMobile;
