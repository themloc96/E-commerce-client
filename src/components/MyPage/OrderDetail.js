import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import '../../styles/my-page/main.scss';
import { useLocation, Link, useParams } from 'react-router-dom';
import { myPageTabs, shippingStatus, businessType } from '../../constants';
import {
  formateDate,
  formatCost,
  productOptionsText,
  setOnErrorImage,
  getMobileType,
} from '../../utils/helpers';
import TransactionStatement from './order-transaction-statement';
import ModalComponent from '../core/modal-base';
import Container from '../Container';

import {
  getOrderByIdFn,
  getShippingByOrderIdFn,
  getOrderBillingByOrderIdFn,
} from '../../apis/order.api';
import { paymentMethods } from '../../constants/jsonData/purchase';
import { ORDER_STATUS } from '../../constants/jsonData/order';
import { useAuthContext } from '../../contexts/AuthProvider';
import printComponent from '../../utils/printComponent';

function OrderDetail() {
  // snackBar
  const { enqueueSnackbar } = useSnackbar();
  const [myPageTab] = useState(myPageTabs.ORDER_MANAGEMENT);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const { slug } = useParams();

  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            .keyin-container {width: 100%;margin-left: auto;box-sizing: border-box;margin-right: auto;display: block;padding-left: 16px;padding-right: 16px;}
            .keyin-main {display: flex;flex-direction: column;width: 100%;height: 100%; //margin-bottom: 2.125rem;}
            .keyin-header { display: flex; padding-top: 2.5rem;align-items: start; border-bottom: 0.063rem solid rgba(0, 0, 0, 0.2);}
            .keyin-logo {width: auto; height: auto;margin-left: -0.03rem;}
            .keyin-link {color: #000000; display: flex; font-size: 1.25rem;  font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: left;padding-right: 0.1rem; align-items: start;margin-top: -0.6rem;}
            .keyin-link hr { margin: 0.55rem 1.25rem; width: 0.063rem;height: 1.625rem;flex-grow: 0;background-color: #CCCCCC;border-right-width: 0;-webkit-flex-shrink: 0;-ms-flex-negative: 0;flex-shrink: 0;border-width: 0;border-style: solid;border-color: #F2F4F7;}
            .keyin-link a:-webkit-any-link {color: #000000;cursor: pointer;text-decoration: none;} 
            .keyin-nav {display: flex; flex-grow: 1!important;height: 100%;padding-left: 4.53123vw;}
            .keyin-nav button {font-family: 'Noto Sans KR'; background: none;border: none;padding: 0px;font-size: 1.125rem;font-weight: 500;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: center;color: #000000;margin-left: 1rem;margin-top:-0.31rem; padding-bottom: 2.6rem;}
            .keyin-active{ border-bottom: 0.2rem solid!important;color: #fc5000!important;margin-top: -0.09rem!important;}
            .keyin-nav button:nth-child(n + 2) {  margin-left: 8.1rem;margin-right: 0.25rem;}
            .keyin-shopping-cart {display: flex; flex-direction: column; align-items: center;}
            .keyin-shopping-cart .title {font-size: 1.125rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #333333; margin-top: -0.4rem;}
            .keyin-shopping-cart .icon {position: relative;}
            .keyin-shopping-cart .icon .number {display: flex;flex-flow: row wrap;-webkit-box-pack: center;place-content: center;-webkit-box-align: center;align-items: center;position: absolute;box-sizing: border-box;font-weight: 500;font-size: 0.729167vw;width: 1.4585vw;line-height: 1;padding: 9px 2.8px 9.8px 2px;margin: 0 5.3px 17.5px 33px;height: 1.4585vw;border-radius: 0.729167vw;z-index: 1;transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;background-color: #fc5000;color: rgb(255, 255, 255);top: 0px;right: 0px;transform: scale(1) translate(65%, -30%);transform-origin: 100% 0%;}
            .keyin-account {display: flex; flex-direction: column; align-items: center;margin-right: -0.2rem;}
            .keyin-account .title {font-size: 1.125rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #333333;margin-top: -0.2rem;}
            .keyin-account .icon {position: relative;}
            .keyin-account .icon .number {display: flex;flex-flow: row wrap;-webkit-box-pack: center;place-content: center;-webkit-box-align: center;align-items: center;position: absolute;box-sizing: border-box;font-weight: 500;font-size: 0.729167vw;width: 1.4585vw;line-height: 1;padding: 9px 2.8px 9.8px 2px;margin: 0 5.3px 17.5px 33px;height: 1.4585vw;border-radius: 0.729167vw;z-index: 1;transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;background-color: #fc5000;color: rgb(255, 255, 255);top: 0px;right: 0px;transform: scale(1) translate(60%, -35%);transform-origin: 100% 0%;}
            .keyin-point-badge{flex-grow: 0;display: flex;justify-content: flex-start;align-items: center;width: 7.75rem;height: 2.25rem;gap: 10px;border-radius: 60px;background-color: #fc5000;vertical-align: middle;margin-top: 0.3rem;}
            .keyin-point-badge .keyin-ellipse{width: 1.5rem;height: 1.5rem;flex-grow: 0;border-radius: 18px;background-image: linear-gradient(147deg, #fff278 7%, #ffd232 94%);flex-grow: 0;font-size: 1rem;font-weight: bold;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: center;color: #fc5000;margin-left: 0.25rem;}
            .keyin-point-badge .number{flex-grow: 0;font-family: Roboto;font-size: 1.25rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: left;color: #fff;margin-left: -0.15rem;}
            .keyin-menu { display: none;margin-bottom: 1.25rem;}
            #product-order{background-color: #FFFFFF}

            .keyin-footer {display: flex;flex-direction: column;}
            .keyin-footer .keyin-info {padding-left: 1.6875rem; padding-top: 3.75rem; padding-bottom:3.75rem;}
            .keyin-address{font-size: 1rem;font-weight: normal;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000; padding-top: 1.14rem;}
            .keyin-contact{display: flex; align-items:baseline; font-size: 1rem;font-weight: normal;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000;font-family: Roboto; padding-top: 0.5rem}
            .keyin-contact hr{margin: 0 13px; width: 0.063rem;height: 0.75rem;flex-grow: 0;background-color: #a1a1a1;border-right-width: 0;-webkit-flex-shrink: 0;-ms-flex-negative: 0;flex-shrink: 0;border-width: 0;}
            .keyin-copyright{font-size: 1rem;font-weight: 500;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000;  padding-top: 1.2rem;}          

            @media(max-width:1200px){
              .keyin-nav button:nth-child(n + 2) {
                margin-left: 3.1rem;
              }
            }

            @media(max-width:992px){
              .keyin-menu { display: block;}
              .keyin-nav {display: none;}
              .keyin-link {display: none;}
              .keyin-logo{flex-grow: 1!important;}
            }

            @media(max-width:768px){
              .keyin-parent{background-color: #f5f7fb;}
              // .keyin-header{padding-top: 1.35rem;border-bottom: 0.15rem solid rgba(0, 0, 0, 0.2);}
              .keyin-logo{margin-top: -0.2rem;}
              .keyin-link{font-size: 0.875rem;}
              .keyin-menu{margin-bottom: 0.8rem;}

              .keyin-address{font-size: 0.75rem;}
              .keyin-contact{font-size: 0.75rem;}
              .keyin-copyright{font-size: 0.75rem;}
              .keyin-contact hr {margin: 0 0.625rem;height: 0.625rem};
            }

            @media(max-width:624px){
              .keyin-container{max-width: 35.625rem}
            }

            @media(max-width:600px){
              // .keyin-container{max-width: 30rem}
              .keyin-main hr{transform: rotate(-360deg);height: 0.125rem;margin-top: 1.288rem;}
              .keyin-link {padding-right:0.27rem; padding-top: 0.2rem;}
              .keyin-link hr{width: 0.063rem;height: 0.938rem;background-color: #CCCCCC;margin: 0.2rem 0.625rem 0 0.79rem;}
              .keyin-logo button img {width: 6rem; height: 1.2128rem;}
            
              .keyin-footer .keyin-info{padding-left: 0.438rem;padding-right: 0.438rem; padding-top: 3.75rem; padding-bottom:5.125rem; text-align: center;}
              .keyin-footer-logo img{width: 6rem;}
              .keyin-address{text-align:center;}
              .keyin-contact{text-align:center;justify-content: center;}
              .keyin-copyright{text-align:center;}
            }

            // @media(max-width:500px){
            //   .keyin-container{max-width: 28.5rem}
            // }

            // @media(max-width:470px){
            //   .keyin-container{max-width: 26.5rem}
            // }

            // @media(max-width:440px){
            //   .keyin-container{max-width: 24.5rem} 
            // }

            // @media(max-width:430px){
            //   .keyin-container{max-width: 23rem}
            // }

            // @media(max-width:400px){
            //   .keyin-container{max-width: 21rem}
            // }
          `}
      </style>
    );
  }

  // #region
  const { isLoading, data } = useQuery(
    [`v1/order/${slug}`, slug],
    () => getOrderByIdFn(slug || null),
    {
      keepPreviousData: true,
      retry: 0,
      onError: error => {
        console.log(error);
        console.log('Something went wrong!');
        // enqueueSnackbar('Something went wrong!', {
        //   variant: 'error',
        // });
      },
    },
  );

  const { data: dataShipping } = useQuery(
    [`v1/order/shipping/${slug}`, slug],
    () => getShippingByOrderIdFn(slug || null),
    {
      keepPreviousData: true,
      retry: 0,
    },
  );

  const { data: dataBilling } = useQuery(
    [`v1/order/billing/${slug}`, slug],
    () => getOrderBillingByOrderIdFn(slug || null),
    {
      keepPreviousData: true,
      retry: 0,
      onError: error => {
        console.log(error);
        console.log('getOrderBillingByOrderIdFn went wrong!');
      },
    },
  );

  const dataBillingNew = useMemo(() => {
    const bill = { ...dataBilling };
    if (bill && bill.order) {
      bill.order.orderDetails = bill?.order?.orderDetails?.map(item => ({
        ...item,
        totalPrice: (item.quantity || 0) * (item.unitPrice || 0),
        totalPriceVAT: Math.floor(
          (item.quantity || 0) * (item.unitPrice || 0) * 0.1,
        ),
      }));
    }
    return bill;
  }, [dataBilling]);

  const orderShipping = useMemo(() => {
    const dataShippingNew =
      dataShipping?.list.filter(
        t => t.shippingStatus === shippingStatus.IN_PROGRESS,
      ) || [];
    return dataShippingNew?.length > 0 ? dataShippingNew[0] : null;
  }, [dataShipping]);
  // #endregion

  const totalAmount = useMemo(() => {
    if (!data || data?.orderDetails.length === 0) {
      return 0;
    }

    const sum = data?.orderDetails.reduce((prev, current) => {
      return (
        prev +
        (current.unitPrice + (current.productOptions[0]?.price ?? 0)) *
          1.1 *
          current.quantity
      );
    }, 0);
    return Math.floor(sum);
  }, [data?.orderDetails]);

  const renderOrderStatus = () => {
    return ORDER_STATUS[data?.orderStatus];
  };

  const renderPaymentMethod = keyword => {
    return paymentMethods.find(item => item.value === keyword).label;
  };

  const renderSumProductPrice = () => {
    return formatCost(
      data.orderDetails.reduce((acc, order) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        return acc + order.unitPrice * order.quantity;
      }, 0),
    );
  };

  const iframe =
    '<iframe id="ifmcontentstoprinttransaction" style="height: 0px; width: 0px; position: absolute"></iframe>';

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }
  if (!data?.id) return null;

  return (
    <>
      <Container>
        <Style />
        <div
          className={
            location.pathname === `/my-page/order-detail/${slug}`
              ? 'my-page oder-detail'
              : 'my-page'
          }
        >
          <p className="my-page-title">마이 페이지</p>
          <div className="tab-button-container">
            <div className="tab-button">
              <button
                className={
                  myPageTab === myPageTabs.ORDER_MANAGEMENT ? 'active' : ''
                }
              >
                <Link to="/my-page#order">주문관리</Link>
              </button>
              {(businessInfo?.businessType === 'AGENCY' ||
                businessInfo?.businessType === 'AS_AGENCY') && (
                <button
                  className={
                    myPageTab === myPageTabs.PARTNER_MANAGEMENT ? 'active' : ''
                  }
                >
                  <Link to="/my-page#partner">파트너 관리</Link>
                </button>
              )}
              <button
                className={myPageTab === myPageTabs.CALCULATE ? 'active' : ''}
              >
                <Link to="/my-page#calculate">정산</Link>
              </button>
              <button
                className={
                  myPageTab === myPageTabs.CUSTOMER_MANAGEMENT ? 'active' : ''
                }
              >
                <Link to="/my-page#customer">고객관리</Link>
              </button>
              <button
                className={
                  myPageTab === myPageTabs.ACCOUNT_MANAGEMENT ? 'active' : ''
                }
              >
                <Link to="/my-page#account">계정관리</Link>
              </button>
            </div>
          </div>
          <div>
            <div className="order-details-main-title">주문상세</div>
            <div
              className="my-page-content-container order-product-container"
              style={{ marginTop: 32 }}
            >
              <div className="order-date-container">
                <div className="date">
                  <p>
                    주문일자 <span className="span-1">|</span>
                    <span className="span-2" style={{ marginRight: 30 }}>
                      {/* 2023.03.28 */}
                      {data?.createdAt.split(' ')[0].replace(/-/g, '.')}
                    </span>
                  </p>
                  <p>
                    주문번호 <span className="span-1">|</span>
                    <span className="span-2">
                      {/* 20230328001-01 */}
                      {data.orderCode || ''}
                    </span>
                  </p>
                </div>
              </div>
              {/* <div className="product-container">
                <div className="product-info-left">
                  <img alt="product" src="/assets/products/smart-lock.png" />
                  <div className="product-infomation">
                    <p className="line-1">
                      <span>[키인S] 키인S 도어락 현관 </span>
                      <span>현관문 현관문 디지털</span>
                    </p>
                    <p className="line-2">
                      지문인식 전자번호키 즉시잠김 보조키 라오나크
                    </p>
                    <p className="product-choosing">
                      옵션 2. 기본상품 + 플러스핑거
                    </p>
                    <p className="price">239,000원 / 1개</p>
                  </div>
                </div>
                <div className="delivery">
                  <p>배송출발</p>
                  <button>배송조회</button>
                </div>
              </div>
              <div className="product-container">
                <div className="product-info-left">
                  <img alt="product" src="/assets/products/smart-lock.png" />
                  <div className="product-infomation">
                    <p className="line-1">
                      <span>[키인S] 키인S 도어락 현관 </span>
                      <span>현관문 현관문 디지털</span>
                    </p>
                    <p className="line-2">
                      지문인식 전자번호키 즉시잠김 보조키 라오나크
                    </p>
                    <p className="product-choosing" style={{ lineHeight: 1.7 }}>
                      옵션 2. 기본상품 + 플러스핑거
                    </p>
                    <p className="price">239,000원 / 1개</p>
                  </div>
                </div>
                <div className="delivery">
                  <p>배송출발</p>
                  <button>배송조회</button>
                </div>
              </div> */}
              {data?.orderDetails.map(dt => {
                const thumbnail = dt.product.productThumbnail
                  ? dt.product.productThumbnail
                  : '/assets/products/no-image.png';
                // const priceQuantity = dt.unitPrice * dt.quantity;
                const { product } = dt;
                const priceQuantity = Math.floor(
                  (dt.unitPrice + (dt.productOptions[0]?.price ?? 0)) *
                    1.1 *
                    dt.quantity,
                );
                return (
                  <div className="product-container" key={dt?.product?.id}>
                    <div className="product-info-left">
                      <img
                        id={`product-${dt?.product?.id}`}
                        src={thumbnail}
                        alt={dt?.product?.name}
                        onError={() =>
                          setOnErrorImage(`product-${dt?.product?.id}`)
                        }
                      />
                      <div className="product-infomation">
                        <p className="line-1">
                          <span>{dt?.product?.name} </span>
                          {/* <span>현관문 현관문 디지털</span> */}
                        </p>
                        {/* <p className="line-2">
                            지문인식 전자번호키 즉시잠김 보조키 라오나크
                          </p> */}
                        <p
                          className="product-choosing"
                          style={{ lineHeight: 1.7 }}
                        >
                          {/* 옵션 2. 기본상품 + 플러스핑거 */}
                          {dt?.productOptions.length > 0
                            ? productOptionsText(
                                dt?.productOptions[0].label,
                                dt?.productOptions[0].price,
                              )
                            : ''}
                        </p>
                        <p className="price">
                          {dt.unitPrice ? formatCost(priceQuantity) : 0}원 /
                          수량 {dt.quantity}
                          {dt.productUnitName}
                        </p>
                      </div>
                    </div>
                    <div className="delivery">
                      <p>{renderOrderStatus()}</p>
                      {data?.orderStatus === 'DP' ? (
                        <button>배송조회</button>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="my-page-content-container order-detail">
              <div className="order-detail-infomation recipient-information">
                <p className="type-info-title">받는사람 정보</p>
                <div className="order-info">
                  <div className="order-info-key line-1 mt-[-4px] md:mt-unset">
                    이름
                  </div>
                  {/* <div className="order-info-value line-1 mt-[-4px] md:mt-unset">홍범영</div> */}
                  <div className="order-info-value line-1 mt-[-4px] md:mt-unset">
                    {orderShipping?.name || ''}
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key line-2">배송주소</div>
                  <div className="order-info-value line-2">
                    {/* 서울특별시 강서구 화곡동 1056-7 */}
                    {orderShipping?.address || ''}
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key">휴대폰 번호</div>
                  {/* <div className="order-info-value">010-0000-0000</div> */}
                  <div className="order-info-value">
                    {orderShipping?.phone || ''}
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key">배송 요청사항</div>
                  {/* <div className="order-info-value">배송 전 연락주세요</div> */}
                  <div className="order-info-value">
                    {orderShipping?.note || ''}
                  </div>
                </div>
              </div>
              <div className="order-detail-infomation payment-information">
                <div className="payment-information-title">
                  <p className="type-info-title">결제정보</p>
                  <button className="pc" onClick={() => setOpenModal(true)}>
                    거래명세서
                  </button>
                </div>
                <div className="order-info">
                  <div className="order-info-key">총 상품가격</div>
                  <div className="order-info-value">
                    <span className="number">{formatCost(totalAmount)}</span>원
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key">마일리지 사용</div>
                  <div className="order-info-value">
                    <span className="number">
                      {formatCost(data.mileagePointUsage) || '0'}
                    </span>
                    원
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key">총 결제금액</div>
                  <div className="order-info-value">
                    <span className="number">
                      {/* {data.totalAmount ? formatCost(data.totalAmount) : 0} */}
                      {formatCost(totalAmount - (data?.mileagePointUsage ?? 0))}
                    </span>
                    원
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-key line-1 mt-[-4px] md:mt-unset">
                    결제 방법
                  </div>
                  <div className="order-info-value line-1 mt-[-4px] md:mt-unset">
                    {renderPaymentMethod(data.paymentMethod) || ''}
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-bottom" style={{ display: 'none' }}>
              <button className="mobile">거래명세서</button>
            </div>
          </div>
        </div>
      </Container>
      <ModalComponent
        // title="마케팅 수신 동의"
        className="transaction-statement-modal"
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
      >
        <div className="print-button">
          {getMobileType() === 'default' && (
            <button
              onClick={() =>
                printComponent(
                  'transaction-statement',
                  'ifmcontentstoprinttransaction',
                  () => setOpenModal(false),
                )
              }
            >
              인쇄
            </button>
          )}
        </div>
        <div id="transaction-statement">
          <TransactionStatement billing={dataBillingNew} />
        </div>
      </ModalComponent>
      <div dangerouslySetInnerHTML={{ __html: iframe }} />
    </>
  );
}

export default OrderDetail;
