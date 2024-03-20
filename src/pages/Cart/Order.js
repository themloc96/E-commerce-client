/* eslint import/no-unresolved: 2 */
import React, { useEffect, useReducer, useState, useMemo } from 'react';
import '../../styles/cart/order.scss';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import * as yup from 'yup';
import moment from 'moment/moment';
import { useWindowDimensions } from '../../hooks';
import { reducer } from '../../utils/Reducer';
// COMPs
import RightSide from './components/Order/RightSide';
import OrderContent from './components/Order/OrderContent';
import Container from '../../components/Container';
import { useShoppingCartContext } from '../../contexts/ShoppingCartProvider';
import { useAuthContext } from '../../contexts/AuthProvider';
import { createOrderFn } from '../../apis/order.api';
import { createShippingFn } from '../../apis/shipping.api';
import { updateProductsToCartLS } from '../../utils/shoppingCart';
import { shippingStatus, businessType } from '../../constants';
import {
  shippingMethod,
  shippingMethodUpdated,
} from '../../constants/jsonData/purchase';
import { REACT_APP_PORTONE_MERCHANT_ID } from '../../constants/AppConfig';
import { getPortOnePaymentsFn } from '../../apis/portOne.api';

function Order() {
  const open = useDaumPostcodePopup();
  const location = useLocation();
  const today = moment();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(width < 1024 ? 'mobile' : 'PC');
  const [lockButton, setLockButton] = useState(false);
  const [useMileage, setUseMileage] = useState(0);

  const [order, setOrder] = useState({
    buyer: {
      name: null,
      email: null,
      phone: null,
    },
    recipient: {
      name: null,
      address: null,
      detailedAddress: null,
      phone: null,
      note: null,
    },
    payment: {
      totalPrice: 0,
      mileagePointUsage: 0,
      paymentAmount: 0,
      paymentMethod: 'MS',
      pgId: null,
      payType: null,
    },
  });
  const { state } = useAuthContext();
  const { currentUser, businessInfo, mileagePoint } = state;
  const shoppingCartCtx = useShoppingCartContext();
  const { products, setProducts } = shoppingCartCtx;

  // #region
  const { mutate: addShipping } = useMutation(
    shippingData => createShippingFn(shippingData),
    {
      onSuccess: data => {
        if (data) {
          const filterdProducts = products.filter(item => !item.checked);
          setProducts(filterdProducts);
          updateProductsToCartLS(filterdProducts);
          localStorage.removeItem('mPayInfo');

          navigate('/my-page#order');
        }
      },
      onError: () => {
        setLockButton(false);
        console.log('Failure to buy!');
        // enqueueSnackbar('Failure to buy!', {
        //   variant: 'error',
        // });
      },
    },
  );

  const { mutate: createOrder } = useMutation(
    orderData => createOrderFn(orderData),
    {
      onSuccess: data => {
        if (data) {
          const shipping = {
            orderId: data?.id,
            address: order?.recipient?.address || null,
            detailedAddress:
              order?.recipient?.detailedAddress || order?.recipient?.address,
            shippingMethod: shippingMethodUpdated[0].value || null,
            shippingStatus: shippingStatus.IN_PROGRESS,
            phone: order?.recipient?.phone || null,
            note: order?.recipient?.note || null,
            invoice: null,
            name: order?.recipient?.name || null,
            courier: '',
          };
          addShipping(shipping);
        }
      },
      onError: () => {
        setLockButton(false);
        console.log('Failure to buy!');
        // enqueueSnackbar('Failure to buy!', {
        //   variant: 'error',
        // });
      },
    },
  );

  // #endregion

  const PaymentHistoryPortOne = async impUid => {
    const portoneHistory = await getPortOnePaymentsFn(impUid);
    return portoneHistory;
  };

  useEffect(() => {
    /* eslint-disable */
    // 모바일 결제 시 동작
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);

    const imp_uid = urlParams.get('imp_uid');
    const merchant_uid = urlParams.get('merchant_uid');
    const error_msg = urlParams.get('error_msg');

    if (imp_uid && !error_msg) {
      const productInfo = JSON.parse(localStorage.getItem('mPayInfo'));

      // 포트원 단건 결제 조회
      const portoneHistory = PaymentHistoryPortOne(imp_uid);

      portoneHistory.then(data => {
        const payInfo = {
          ...productInfo,
          paymentHistory: {
            paymentOrderNumber: merchant_uid,
            paymentNumber: imp_uid,
            paymentAmount: data.payment_amount,
            paymentMethod: data.payment_method,
            paymentProvider: data.payment_provider,
            paymentPgNumber: data.payment_pg_number,
            paymentType: data.payment_type,
            paymentStatus: 'PAYMENT_COMPLETED',
          },
        };
        createOrder(payInfo);
      });
    } else {
      if (products.length === 0) navigate('/cart');
    }
    /* eslint-enable */
  }, [products, location.search, location.pathname]);

  useEffect(() => {
    if (currentUser) {
      const newOrder = { ...order };
      newOrder.buyer.name = currentUser?.name || null;
      newOrder.buyer.email = currentUser?.email || null;
      newOrder.buyer.phone = currentUser?.phone || null;
      newOrder.recipient.name = currentUser?.name || null;
      newOrder.recipient.phone = currentUser?.phone || null;
      setOrder(newOrder);
    }
  }, [currentUser]);

  useEffect(() => {
    if (businessInfo) {
      const newOrder = { ...order };
      newOrder.recipient.address = businessInfo?.businessAddress || null;
      newOrder.recipient.detailedAddress =
        businessInfo?.businessDetailedAddress || null;
      setOrder(newOrder);
    }
  }, [businessInfo]);

  // list product checked
  const listProductChecked = useMemo(() => {
    return products.filter(t => t.checked);
  }, [products]);

  useEffect(() => {
    if (listProductChecked.length > 0) {
      const newOrder = { ...order };
      newOrder.payment.totalPrice = listProductChecked?.reduce(
        (prev, current) => {
          const currentPrice = current?.price || 0;
          const currentPriceSelected = current?.productOptions[0].price || 0;
          const realPrice =
            businessInfo?.businessType === businessType.GENERAL ||
            businessInfo?.businessType === businessType.AS
              ? currentPrice
              : current.wholeSalePrice;
          const realVat =
            businessInfo?.businessType === businessType.GENERAL ||
            businessInfo?.businessType === businessType.AS
              ? Math.round(current.price_vat)
              : Math.round(current.wholeSalePrice_vat);
          return (
            prev +
            (realPrice + Math.round(currentPriceSelected * 1.1) + realVat) *
              current.quantity
          );
        },
        0,
      );
      setOrder(newOrder);
    }
  }, [listProductChecked]);

  const checkDisabledBtn = useMemo(() => {
    let check = false;
    if (order?.recipient?.name === null || order?.recipient?.phone === null) {
      check = true;
    }
    return check;
  }, [order]);

  const [stateCardOrder, setCardOrder] =
    width < 1024
      ? useReducer(reducer, {
          isOpenInformation: true,
          isOpenRecipientInformation: false,
          isOpenBuyerInformation: false,
          isOpenPaymentInformation: false,
          // selectedPaymentMethod: '월말정산',
        })
      : useReducer(reducer, {
          isOpenInformation: true,
          isOpenRecipientInformation: true,
          isOpenBuyerInformation: true,
          isOpenPaymentInformation: true,
          // selectedPaymentMethod: '월말정산',
        });
  const {
    isOpenBuyerInformation,
    isOpenRecipientInformation,
    isOpenPaymentInformation,
    selectedPaymentMethod,
  } = stateCardOrder;
  const handleOpenInformation = () => {
    setCardOrder({
      isOpenInformation: !stateCardOrder.isOpenInformation,
      isDefault: !stateCardOrder.isDefault,
    });
  };
  const handleRecipientInformation = () => {
    setCardOrder({
      isOpenRecipientInformation: !stateCardOrder.isOpenRecipientInformation,
      isDefault: false,
    });
  };
  const handleBuyerInformation = () => {
    setCardOrder({
      isOpenBuyerInformation: !stateCardOrder.isOpenBuyerInformation,
      isDefault: false,
    });
  };
  const handlePaymentInformation = () => {
    setCardOrder({
      isOpenPaymentInformation: !stateCardOrder.isOpenPaymentInformation,
      isDefault: false,
    });
  };
  const handleSelectPaymentMethod = (value, id, type) => {
    // setCardOrder({
    //   selectedPaymentMethod: value,
    // });
    if (value !== 'NP' && value !== 'P' && value !== 'AT') {
      const newOrder = { ...order };
      newOrder.payment.paymentMethod = value;
      newOrder.payment.pgId = id;
      newOrder.payment.payType = type;
      setOrder(newOrder);
    } else {
      alert('서비스 준비중 입니다.');
    }
  };

  const handleEditBuyerMethod = (event, property) => {
    const newOrder = { ...order };
    newOrder.buyer[property] = event.target.value || null;
    setOrder(newOrder);
  };

  const handleEditRecipientMethod = (event, property) => {
    const newOrder = { ...order };
    const phoneRegExp = /^[0-9]+$/;
    const phoneSchema = yup.string().matches(phoneRegExp);
    const inputValue = event.target.value;
    const isValidPhone = phoneSchema.isValidSync(inputValue);

    if (property === 'phone') {
      if (isValidPhone) {
        newOrder.recipient[property] = inputValue;
      }
      if (!isValidPhone) {
        event.preventDefault();
      }
      if (inputValue === '') {
        newOrder.recipient[property] = null;
      }
    } else {
      // property is name, detailedAddress, note
      newOrder.recipient[property] = inputValue;
    }

    setOrder(newOrder);
  };

  const handleEditMileagePointUsageMethod = event => {
    const newOrder = { ...order };
    const mileagePointUsage = event.target.validity.valid
      ? event.target.value
      : newOrder.payment.mileagePointUsage;
    newOrder.payment.mileagePointUsage = mileagePointUsage;
    setOrder(newOrder);
  };

  const handleCalculatePaymentAmountMethod = event => {
    event.preventDefault();
    if (useMileage > order.payment.totalPrice) {
      alert('사용하려는 마일리지가 총 상품 가격보다 많습니다.');
      order.payment.mileagePointUsage = 0;
      setUseMileage(0);
      return;
    }
    if (useMileage > mileagePoint) {
      alert('사용하려는 마일리지가 보유 마일리지보다 많습니다.');
      order.payment.mileagePointUsage = 0;
      setUseMileage(0);
      return;
    }
    const newOrder = { ...order };
    newOrder.payment.mileagePointUsage = useMileage;
    newOrder.payment.paymentAmount =
      newOrder.payment.mileagePointUsage > newOrder.payment.totalPrice
        ? 0
        : newOrder.payment.totalPrice - newOrder.payment.mileagePointUsage;
    setOrder(newOrder);
  };

  const handleCompleteDaumPostCode = data => {
    const newOrder = { ...order };
    newOrder.recipient.address = data.address || null;
    // 230718 14:44 Junyoung Park : If I change the address, I have to enter a new detailed address, so I changed it to a blank
    newOrder.recipient.detailedAddress = '';
    setOrder(newOrder);
  };

  const handleChangeDaumPostCode = event => {
    event.preventDefault();
    open({ onComplete: handleCompleteDaumPostCode });
  };

  const generateOrderCode = length => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const getPriceType = () => {
    if (
      businessInfo?.businessType === businessType.GENERAL ||
      businessInfo?.businessType === businessType.AS
    ) {
      return 'PRICE'; // 일반단가
    }
    return 'WHOLESALE_PRICE'; // 도매단가
  };

  const onClickPayment = orderInfo => {
    if (!window.IMP && orderInfo) return;
    const impInfo = window.IMP;
    impInfo.init(REACT_APP_PORTONE_MERCHANT_ID);

    const tomorrow = today.clone().add(1, 'day');
    const formattedTomorrow = tomorrow.format('YYYY-MM-DD');
    if (
      orderInfo.pgId !== null &&
      orderInfo.totalAmount - orderInfo.mileagePointUsage > 0
    ) {
      const payData = {
        pg: orderInfo.pgId,
        pay_method: orderInfo.payType,
        merchant_uid: orderInfo.orderCode,
        amount: orderInfo.totalAmount - orderInfo.mileagePointUsage,
        name:
          listProductChecked.length === 1
            ? listProductChecked[0].name
            : `${listProductChecked[0].name} 외 ${
                listProductChecked.length - 1
              }개`,
        buyer_name: order.buyer.name,
        buyer_tel: order.buyer.phone,
        buyer_email: order.buyer.email,
        vbank_due: formattedTomorrow,
        digital: false,
        m_redirect_url: isMobile === 'mobile' ? window.location.href : '',
        bypass: {
          nice_v2: {
            NPDisableScroll: 'Y',
          },
        },
      };

      if (isMobile === 'mobile') {
        const mPayInfo = {
          priceType: orderInfo.priceType,
          orderCode: orderInfo.orderCode,
          paymentMethod: orderInfo.paymentMethod,
          pgId: orderInfo.pgId,
          payType: orderInfo.payType,
          totalAmount: orderInfo.totalAmount,
          mileagePointUsage: orderInfo.mileagePointUsage,
          orderDetails: orderInfo.orderDetails,
          shippingCartIdList: orderInfo.shippingCartIdList,
        };

        localStorage.setItem('mPayInfo', JSON.stringify(mPayInfo));
        setLockButton(false);
      }

      impInfo.request_pay(payData, async res => {
        if (!res.error_code && !res.error_msg) {
          // 포트원 단건 결제 조회
          const portoneHistory = await getPortOnePaymentsFn(res.imp_uid);

          const PayInfo = {
            priceType: orderInfo.priceType,
            orderCode: orderInfo.orderCode,
            paymentMethod: orderInfo.paymentMethod,
            pgId: orderInfo.pgId,
            payType: orderInfo.payType,
            totalAmount: orderInfo.totalAmount,
            mileagePointUsage: orderInfo.mileagePointUsage,
            orderDetails: orderInfo.orderDetails,
            shippingCartIdList: orderInfo.shippingCartIdList,
            paymentHistory: {
              paymentOrderNumber: res.merchant_uid,
              paymentNumber: res.imp_uid,
              paymentAmount: portoneHistory.payment_amount,
              paymentMethod: portoneHistory.payment_method,
              paymentProvider: portoneHistory.payment_provider,
              paymentPgNumber: portoneHistory.payment_pg_number,
              paymentType: portoneHistory.payment_type,
              paymentStatus: 'PAYMENT_COMPLETED',
            },
          };
          createOrder(PayInfo);
        } else {
          if (res.error_msg && res.error_code !== 'F400') {
            alert(res.error_msg);
          }
          setLockButton(false);
        }
      });
    } else if (
      orderInfo.paymentMethod === 'MS' ||
      orderInfo.totalAmount - orderInfo.mileagePointUsage === 0
    ) {
      createOrder(orderInfo);
    } else {
      console.log('결제 오류');
      setLockButton(false);
    }
  };

  const onClickSubmit = event => {
    event.preventDefault();
    if (lockButton === false) {
      setLockButton(true);

      const phoneNumberPattern = /^01[016789][0-9]{8}$/;
      const isPhoneNumberMatch = phoneNumberPattern.test(
        order?.recipient?.phone ?? '',
      );
      if (isPhoneNumberMatch === false) {
        alert('전화번호를 확인해주세요.');
        setLockButton(false);
        return;
      }
      // location.href='/my-page#order';
      const orderCreate = {
        priceType: getPriceType(),
        orderCode: generateOrderCode(10),
        paymentMethod: order?.payment?.paymentMethod,
        pgId: order?.payment?.pgId,
        payType: order?.payment?.payType,
        totalAmount: order?.payment?.totalPrice || 0,
        mileagePointUsage: order?.payment?.mileagePointUsage || 0,
        shippingCartIdList: products.map(raw => {
          return raw.shippingCartId;
        }),
        orderDetails: listProductChecked.map(t => {
          const { productOptions } = t;
          return {
            productId: t.id,
            quantity: t.quantity || 0,
            productUnitName: '개',
            productOptionIds: productOptions ? [productOptions[0].id] : [],
          };
        }),
      };
      if (orderCreate.totalAmount - orderCreate.mileagePointUsage < 0) {
        const newOrder = { ...order };
        newOrder.payment.mileagePointUsage = 0;
        setOrder(newOrder);
        setLockButton(false);
        alert('사용하려는 마일리지가 총 상품 가격보다 많습니다.');
        return;
      }
      if (
        businessInfo?.businessType === 'GENERAL' &&
        order?.payment?.paymentMethod === 'MS'
      ) {
        setLockButton(false);
        alert('대리점 계약 후 사용 가능한 결제방식입니다.');
        return;
      }
      onClickPayment(orderCreate);
    }
  };

  useEffect(() => {
    if (width < 1024) {
      setIsMobile('mobile');
    } else {
      setIsMobile('PC');
    }
  }, []);

  return (
    <Container
      className={`card-order ${stateCardOrder.isDefault ? 'default' : ''}`}
    >
      <h1 className="cart-heading">주문하기</h1>
      <div className="cart-container">
        <RightSide
          order={order}
          listProduct={listProductChecked || []}
          isMobile={isMobile}
          isDisabled={checkDisabledBtn}
          onOpenInformation={handleOpenInformation}
          isOpenInformation={stateCardOrder.isOpenInformation}
          onBuyMethod={onClickSubmit}
          typeBusiness={businessInfo ? businessInfo.businessType : ''}
        />
        <OrderContent
          isMobile={isMobile}
          isDisabled={checkDisabledBtn}
          order={order}
          onToggleBuyerInformation={handleBuyerInformation}
          isOpenBuyerInformation={isOpenBuyerInformation}
          onToggleRecipientInformation={handleRecipientInformation}
          isOpenRecipientInformation={isOpenRecipientInformation}
          onTogglePaymentInformation={handlePaymentInformation}
          isOpenPaymentInformation={isOpenPaymentInformation}
          onSelectPaymentMethod={handleSelectPaymentMethod}
          onChangeBuyerMethod={handleEditBuyerMethod}
          onChangeRecipientMethod={handleEditRecipientMethod}
          onInputMileagePointMethod={handleEditMileagePointUsageMethod}
          onCalculatePaymentAmountMethod={handleCalculatePaymentAmountMethod}
          onChangeAddressMethod={handleChangeDaumPostCode}
          onBuyMethod={onClickSubmit}
          useMileage={useMileage}
          setUseMileage={setUseMileage}
          // selectedPaymentMethod={selectedPaymentMethod}
        />
      </div>
    </Container>
  );
}

export default Order;
