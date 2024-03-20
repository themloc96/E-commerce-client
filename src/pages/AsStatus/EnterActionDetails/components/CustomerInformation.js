import { useState } from 'react';
import { useWindowDimensions } from '../../../../hooks';

function CustomerInformation({ customerData }) {
  const { width } = useWindowDimensions();
  const [isOpenCustomer, setIsOpenCustomer] = useState(true);

  return (
    <div className="customer-information">
      <div className="title-customer">
        <h2
          onClick={() => {
            setIsOpenCustomer(!isOpenCustomer);
          }}
        >
          고객 정보
          <i className={!isOpenCustomer ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenCustomer && (
        <div className="registration-block">
          <div className="row">
            <div className="registration-number">
              <div className="label">고객명</div>
              <div className="field">
                <input disabled value={customerData.customerName} />
              </div>
            </div>
            <div className="registration-number">
              <div className="label">
                휴대전화<span className="require">*</span>
              </div>
              <div className="field">
                <input disabled value={customerData.customerPhoneNumber} />
              </div>
            </div>
            <div className="registration-number">
              <div className="label">전화번호</div>
              <div className="field">
                <input
                  disabled
                  value={customerData.customerPhoneSecondNumber}
                />
              </div>
            </div>
          </div>

          <div className="registration-number">
            <div className="label-address">주소</div>
            <div className="field full">
              <input disabled value={customerData.customerAddress} />
            </div>
            {width > 767 && (
              <div className="field full">
                <input
                  disabled
                  value={customerData.customerDetailedAddress}
                  className="spacing-10"
                />
              </div>
            )}
          </div>
          {width < 767 && (
            <div className="registration-number">
              <div className="label-address">주소</div>
              <div className="field full">
                <input disabled value={customerData.customerDetailedAddress} />
              </div>
            </div>
          )}
          <div className="registration-number">
            <div className="label-remember-board">메모</div>
            <div className="field full">
              <input
                disabled
                className="spacing-16"
                value={customerData.customerNote}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerInformation;
