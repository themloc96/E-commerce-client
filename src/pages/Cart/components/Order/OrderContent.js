import React from 'react';
import { Input } from '../../../../components/Input';
import { paymentMethods } from '../../../../constants/jsonData/purchase';
import { useAuthContext } from '../../../../contexts/AuthProvider';
import { formatCost, formatNumber, isNumeric } from '../../../../utils/helpers';

function OrderContent(props) {
  const {
    isMobile,
    isDisabled,
    order,
    onToggleBuyerInformation,
    isOpenBuyerInformation,
    onToggleRecipientInformation,
    isOpenRecipientInformation,
    onTogglePaymentInformation,
    isOpenPaymentInformation,
    onSelectPaymentMethod,
    onChangeBuyerMethod,
    onChangeRecipientMethod,
    onInputMileagePointMethod,
    onCalculatePaymentAmountMethod,
    onChangeAddressMethod,
    onBuyMethod,
    useMileage,
    setUseMileage,
    // selectedPaymentMethod,
  } = props;
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { mileagePoint } = state;
  const formattedPrice = (price = 0) => {
    return price.toLocaleString();
  };
  const totalAmountToPay =
    (order?.payment?.totalPrice ?? 0) -
    (order?.payment?.mileagePointUsage ?? 0);
  return (
    <div className="order-content">
      <div className="cart-content order-buyer">
        <button
          onClick={isMobile === 'PC' ? () => {} : onToggleBuyerInformation}
        >
          <div className="cart-content-header">
            <div>구매자 정보</div>
            <img
              className={`${isOpenBuyerInformation ? '' : 'icon-below'}`}
              src="/assets/icons/btn_arrow_18px@2x.png"
              alt=""
            />
          </div>
        </button>
        {isOpenBuyerInformation && (
          <div className="recipient">
            <div>
              <Input
                disabled
                label="이름"
                placeholder="이름을 입력해 주세요."
                value={order?.buyer?.name || ''}
                // onChange={event => onChangeBuyerMethod(event, 'name')}
              />
            </div>

            <div className="title-input title-input-1">
              <Input
                disabled
                label="이메일"
                placeholder="이메일을 입력해 주세요."
                value={order?.buyer?.email || ''}
                // onChange={event => onChangeBuyerMethod(event, 'email')}
              />
            </div>

            <div className="title-input">
              <Input
                disabled
                label="휴대폰 번호"
                placeholder="휴대폰 번호를 입력해 주세요."
                value={order?.buyer?.phone || ''}
                // onChange={event => onChangeBuyerMethod(event, 'phone')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="cart-content order-info">
        <button
          onClick={isMobile === 'PC' ? () => {} : onToggleRecipientInformation}
        >
          <div className="cart-content-header">
            <div>받는사람 정보</div>
            <img
              className={`${isOpenRecipientInformation ? '' : 'icon-below'}`}
              src="/assets/icons/btn_arrow_18px@2x.png"
              alt=""
            />
          </div>
        </button>
        {isOpenRecipientInformation && (
          <div className="recipient lg:!gap-[22px]">
            <div>
              <Input
                label="이름"
                placeholder="이름을 입력해 주세요."
                value={order?.recipient?.name || ''}
                onChange={event => onChangeRecipientMethod(event, 'name')}
              />
            </div>

            <div className="input">
              <div className="input-btn has-btn lg:flex lg:gap-[12px] lg:items-end">
                <div className="lg:mb-0 md:mb-[15px]">
                  <Input
                    label="배송주소"
                    placeholder="주소"
                    value={order?.recipient?.address || ''}
                    disabled
                    style={{ marginBottom: '7px' }}
                  />
                </div>
                {isMobile === 'PC' ? (
                  <button
                    style={{ marginBottom: '7px' }}
                    onClick={onChangeAddressMethod}
                  >
                    변경
                  </button>
                ) : (
                  ''
                )}
              </div>
              {isMobile === 'mobile' ? (
                <button onClick={onChangeAddressMethod}>변경</button>
              ) : (
                ''
              )}
            </div>
            <div className="md:mt-[-13px] not-label">
              <Input
                isLabel={false}
                placeholder="상세주소를 입력해 주세요."
                value={order?.recipient?.detailedAddress || ''}
                onChange={event =>
                  onChangeRecipientMethod(event, 'detailedAddress')
                }
              />
            </div>

            <div className="input-recipient">
              <Input
                classes="mt-[-2px]"
                label="휴대폰 번호"
                placeholder="휴대폰 번호를 입력해 주세요."
                value={order?.recipient?.phone || ''}
                onChange={event => onChangeRecipientMethod(event, 'phone')}
              />
            </div>
            <div className="input-recipient">
              <Input
                classes="md:!mt-[12px]"
                label="요청사항"
                placeholder="요청사항을 입력하세요."
                value={order?.recipient?.note || ''}
                onChange={event => onChangeRecipientMethod(event, 'note')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="cart-content order-payment">
        <button
          onClick={isMobile === 'PC' ? () => {} : onTogglePaymentInformation}
        >
          <div className="cart-content-header">
            <div>결제정보</div>
            <img
              className={`${isOpenPaymentInformation ? '' : 'icon-below'}`}
              src="/assets/icons/btn_arrow_18px@2x.png"
              alt=""
            />
          </div>
        </button>
        {isOpenPaymentInformation && (
          <div className="recipient">
            <div>
              <Input
                label="총 상품 가격"
                value={formattedPrice(Math.round(order.payment.totalPrice))}
                // value={order?.payment?.totalPrice||''}
                disabled
              />
            </div>
            <div className="input">
              <div className="input-btn has-btn lg:flex lg:gap-[12px] lg:items-end">
                <div>
                  <Input
                    label="마일리지 사용"
                    // numberonly="true"
                    pattern="[0-9]*"
                    placeholder="원"
                    // value={order?.payment?.mileagePointUsage || ''}
                    value={useMileage.toLocaleString('ko-KR')}
                    onInput={e => {
                      if (Number(mileagePoint) >= Number(useMileage)) {
                        setUseMileage(
                          Math.floor(e.target.value.replace(',', '')),
                        );
                      }
                      if (Number(useMileage) >= Number(mileagePoint)) {
                        setUseMileage(formatNumber(mileagePoint));
                      }
                      if (
                        Number(mileagePoint) >=
                        Number(e.target.value.replace(',', ''))
                      ) {
                        setUseMileage(
                          Math.floor(e.target.value.replace(',', '')),
                        );
                      }
                      if (e.target.value === '') {
                        setUseMileage(0);
                      }
                    }}
                  />
                </div>
                {isMobile === 'PC' ? (
                  <button
                    onClick={onCalculatePaymentAmountMethod}
                    disabled={
                      Number(order?.payment?.mileagePointUsage) >
                      Number(order?.payment?.totalPrice)
                    }
                  >
                    사용
                  </button>
                ) : (
                  ''
                )}
              </div>
              {isMobile === 'mobile' ? (
                <button
                  onClick={onCalculatePaymentAmountMethod}
                  disabled={
                    Number(order?.payment?.mileagePointUsage) >
                    Number(mileagePoint)
                  }
                  className="btn-mobile"
                >
                  사용
                </button>
              ) : (
                ''
              )}
            </div>
            {/* <p className="text-warning">보유 마일리지 140,000P</p> */}
            {useMileage > Number(mileagePoint) ? (
              <p className="text-warning">
                보유 마일리지 {formatNumber(mileagePoint)}
              </p>
            ) : (
              ''
            )}
            <div className="pt-[13px] lg:pt-[15px]">
              <Input
                className="common-input lg:!mt-[10px]"
                label="총 결제금액"
                value={formattedPrice(
                  order.payment.paymentAmount || order.payment.totalPrice,
                )}
                disabled
              />
            </div>

            <div className="payment-method">
              <p className="md:pl-[30px] payment-method-heading">결제방법</p>
              <div className="payment-method-list">
                {paymentMethods.map(item => {
                  const { value, label, id, type } = item;
                  return (
                    <button
                      key={value}
                      className={
                        order?.payment?.paymentMethod === value ? 'active' : ''
                      }
                      onClick={() => onSelectPaymentMethod(value, id, type)}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`cart-order-bottom ${
          isOpenPaymentInformation ? 'opened-payment' : ''
        }`}
      >
        <div className="amount">
          <p className="title">총 상품품금액</p>
          <p className="price">
            {
              // formatCost(order?.payment?.totalPrice)
              Math.round(order?.payment?.totalPrice).toLocaleString()
            }
            원
          </p>
        </div>
        <div className="amount">
          <p className="title">마일리지 사용</p>
          <p className="price">
            {formatCost(order?.payment?.mileagePointUsage)}원
          </p>
        </div>
        <div className="amount">
          <p className="title">총 결제 예정금액</p>
          <p className="price">
            {/* {formatCost(
              (order?.payment?.totalPrice ?? 0) -
                (order?.payment?.mileagePointUsage ?? 0)
            )} */}
            {Math.round(totalAmountToPay).toLocaleString()}원
          </p>
        </div>
      </div>
      <div
        className={`cart-order-submit ${
          isOpenPaymentInformation ? 'opened-payment' : ''
        } ${!isDisabled ? ' cart-order-submit-enable' : ''}`}
      >
        <button
          // onClick={() => {
          //   // eslint-disable-next-line no-restricted-globals
          //   location.href = '/my-page#order';
          // }}
          onClick={onBuyMethod}
          disabled={isDisabled}
        >
          주문하기
        </button>
      </div>
    </div>
  );
}

export default OrderContent;
