import { useState } from 'react';
import ViewDetailProductButton from '../../../../components/Shared/ViewDetailProductButton';

function ItemInformation({ itemInformation }) {
  const [isOpenItem, setIsOpenItem] = useState(true);

  return (
    <div className="item-information">
      <div className="title">
        <h2
          onClick={() => {
            setIsOpenItem(!isOpenItem);
          }}
        >
          품목 정보
          <i className={!isOpenItem ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenItem && (
        <div className="registration-block">
          <div className="row">
            <div className="registration-number">
              <div className="label">
                모델명<span className="require">*</span>
              </div>
              <div className="wrapper-field">
                <div className="field">
                  <input disabled value={itemInformation.productModelName} />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">제품명</div>
              <div className="wrapper-field">
                <div className="field submit">
                  <input
                    disabled
                    value={
                      itemInformation.productName.length < 8
                        ? itemInformation.productName
                        : `${itemInformation.productName.substring(0, 8)}...`
                    }
                  />
                  <button className="">
                    <span>제품정보</span>
                  </button>
                  <ViewDetailProductButton
                    label="제품정보"
                    productName={itemInformation.productName}
                    productId={itemInformation?.productId}
                    isOpenNewTab
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">상담유형</div>
              <div className="wrapper-field">
                <div className="field">
                  <input disabled value={itemInformation.consultationType} />
                </div>
              </div>
            </div>
          </div>

          <div className="registration-number">
            <div className="label-consulting-details">상담내역</div>
            <div className="wrapper-field">
              <div className="field full">
                <textarea
                  disabled
                  className="height"
                  value={itemInformation.consultationContent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ItemInformation;
