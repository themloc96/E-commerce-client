import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
// COMPs
import { IndCheckbox } from '../../components/WTable/IndCheckbox';
import Container from '../../components/Container';
import ProductList from './components/ProductList';
import NoData from '../../components/WTable/NoData';
// STYLEs
import '../../styles/cart/main.scss';
// UTILs
import { formatNumber } from '../../utils/helpers';
import CartBottom from './components/CartBottom';

import { useAuthContext } from '../../contexts/AuthProvider';
import { businessType } from '../../constants';
import {
  shippingCartCountUpdateFn,
  shippingCartDeleteFn,
  shippingCartListFn,
} from '../../apis/shipping.api';

function index() {
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo, currentUser } = state;
  const [products, setProducts] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [cartId, setCartId] = useState(0);
  const [count, setCount] = useState(0);

  const { refetch } =
    currentUser !== undefined
      ? useQuery(
          ['shippingCart', currentUser?.id],
          () => shippingCartListFn(currentUser?.id),
          {
            keepPreviousData: true,
            onError: error => {
              console.log(error);
            },
            onSuccess: _data => {
              if (_data !== null && _data !== undefined) {
                setProducts(
                  _data.list.map(item => ({
                    ...item.productResponseDTO,
                    quantity: item.shippingCartCount,
                    shippingCartId: item.id,
                    checked: true,
                  })),
                );
              }
            },
          },
        )
      : { data: undefined };

  const { mutate: deleteShippingCart } = useMutation(
    idList => shippingCartDeleteFn(idList),
    {
      onSuccess: _data => {
        refetch();
      },
      onError: error => {
        console.log(error);
        refetch();
      },
    },
  );

  useQuery(
    [updateFlag],
    () => {
      return shippingCartCountUpdateFn(cartId, count);
    },
    {
      enabled: updateFlag,
      onError: error => {
        console.log(error);
        setUpdateFlag(false);
        setCartId(0);
        setCount(0);
        refetch();
      },
      onSuccess: _data => {
        setUpdateFlag(false);
        setCartId(0);
        setCount(0);
        refetch();
      },
    },
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalProductChecked = useMemo(() => {
    let total = 0;
    if (!products || products?.length === 0) {
      return 0;
    }
    products.forEach(item => {
      if (item.checked) {
        total += 1;
      }
    });
    return total;
  }, [products]);

  const totalAmount = useMemo(() => {
    if (!products || products.length === 0) {
      return 0;
    }
    return products.reduce((prev, current) => {
      const priceSelected = current.productOptions[0]?.price || 0;
      if (current.checked) {
        const realPrice =
          businessInfo?.businessType === businessType.GENERAL ||
          businessInfo?.businessType === businessType.AS
            ? current.price + Math.round(current.price_vat)
            : current.wholeSalePrice + Math.round(current.wholeSalePrice_vat);
        return (
          prev +
          (realPrice + Math.round(priceSelected * 1.1)) * current.quantity
        );
      }
      return prev;
    }, 0);
  }, [products]);

  const isDisableBtnOrder = useMemo(() => {
    const listProductChecked = products?.filter(t => t.checked);
    return listProductChecked.length <= 0;
  }, [products]);

  const handleChangeChecked = idx => {
    setProducts(prevProducts => {
      return prevProducts.map((product, id) => {
        if (id === idx) {
          return {
            ...product,
            checked: !product.checked,
          };
        }
        return product;
      });
    });
  };

  const handleChangeAllChecked = event => {
    const isChecked = event?.target.checked;
    setProducts(() => {
      return products?.map(item => ({ ...item, checked: isChecked }));
    });
  };

  const isCheckedAll =
    products?.length === 0 ? false : products.every(item => item.checked);

  /**
   * @param {*} id int
   * @param {*} type INCREASE and DESCREASE
   */
  const handleChangeQuantity = (id, type) => {
    if (type > 0) {
      setCartId(id);
      setCount(type);
      setUpdateFlag(true);
    }
  };

  const handleDeleteProductChecked = () => {
    const filterdProducts = products.filter(item => item.checked);
    if (filterdProducts.length > 0)
      deleteShippingCart(filterdProducts.map(item => item.shippingCartId));
  };

  return (
    <>
      <div className="cart">
        <h1 className="cart-heading">장바구니</h1>
        <Container className="cart-container">
          <div className="cart-content">
            <div className="cart-content-header">
              <div className="cart-total-product">
                <div className="self-center w-[22px] h-[22px] md:w-[28px] md:h-[28px]">
                  <IndCheckbox
                    onChange={handleChangeAllChecked}
                    checked={isCheckedAll}
                  />
                </div>
                <span className="ml-[12.5px] lg:ml-[13.5px]">
                  전체선택({totalProductChecked})
                </span>
              </div>
              <button
                className="del-selection-btn"
                onClick={() => handleDeleteProductChecked()}
              >
                <span>선택 삭제</span>
              </button>
            </div>
            <ProductList
              products={products}
              onChangChecked={handleChangeChecked}
              onChangeQuantity={handleChangeQuantity}
            />
            {products.length === 0 && (
              <div className="py-12 text-center text-[1.5rem]">
                장바구니에 상품이 없습니다.
              </div>
            )}
            <div className="total-amount-wrap">
              <span className="text">결제 예정금액</span>
              <img src="/assets/icons/sum-icon.png" alt="sum-icon" />
              <span className="value">{formatNumber(totalAmount)}원</span>
            </div>
          </div>
          <CartBottom
            productList={products.filter(item => item.checked)}
            totalAmount={totalAmount}
            isDisableBtnOrder={isDisableBtnOrder}
          />
        </Container>
      </div>
      {/* )} */}
    </>
  );
}

export default index;
