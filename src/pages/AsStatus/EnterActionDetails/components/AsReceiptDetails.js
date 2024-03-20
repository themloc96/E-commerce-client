import { useState } from 'react';
import { useWindowDimensions } from '../../../../hooks';

function AsReceiptDetails({ asReceiptDetail }) {
  const { width } = useWindowDimensions();
  const [isOpenAsReceipt, setIsOpenAsReceipt] = useState(true);
  const asDispatchCategory =
    asReceiptDetail.asDispatchCategory === 'GENERAL' ? '출동접수' : '긴급출동';
  const installationDate = asReceiptDetail.installationDate
    ? asReceiptDetail.installationDate.split('-')
    : '';
  const formattedDate = `${installationDate[0]}-${installationDate[1]}`;

  return (
    <div className="as-receipt-details">
      <div className="title">
        <h2
          onClick={() => {
            setIsOpenAsReceipt(!isOpenAsReceipt);
          }}
        >
          {width < 767 ? 'A/S 접수내역' : 'A/S 접수 내역'}
          <i className={!isOpenAsReceipt ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenAsReceipt && (
        <div className="registration-block">
          <div className="row">
            <div className="registration-number">
              <div className="label">접수유형</div>
              <div className="wrapper-field">
                <div className="field">
                  <input disabled value={asReceiptDetail.asReceiptType} />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">유/무상</div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    disabled
                    value={
                      asReceiptDetail.asFeeType === 'FREE' ? '무상' : '유상'
                    }
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">시리얼 넘버(S/N)</div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    disabled
                    value={`${
                      width < 767
                        ? asReceiptDetail.serialNumber || ''
                        : asReceiptDetail.serialNumber || ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="registration-number">
              <div className="label">
                {width < 767 ? '설치일자' : '출동구분'}
              </div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    disabled
                    // value="일반"
                    value={`${
                      width < 767
                        ? asReceiptDetail.installationDate || ''
                        : asDispatchCategory || ''
                    }`}
                  />
                </div>
              </div>
            </div>
            {width < 767 && (
              <div className="registration-number">
                <div className="label">출동구분</div>
                <div className="wrapper-field">
                  <div className="field">
                    <input disabled value={asDispatchCategory || ''} />
                  </div>
                </div>
              </div>
            )}

            <div className="registration-number">
              <div className="label">
                {width < 767 ? '제조년월' : '설치일자'}
              </div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    disabled
                    // value=""
                    value={`${
                      width < 767
                        ? formattedDate
                        : asReceiptDetail.installationDate || ''
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">
                {width < 767 ? '대표증상' : '제조년월'}
              </div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    disabled
                    // value="2023.03"
                    value={`${
                      width < 767
                        ? asReceiptDetail.representativeSymptom
                        : asReceiptDetail.manufactureDate || ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="registration-number">
            <div className="label-detailed-symptoms">
              {width < 767 ? '세부증상' : '대표증상'}
            </div>
            <div className="wrapper-field">
              <div className="field full">
                <input
                  disabled
                  value={
                    width < 767
                      ? asReceiptDetail.detailedSymptom || ''
                      : asReceiptDetail.representativeSymptom || ''
                  }
                />
              </div>
            </div>
          </div>
          {width > 767 && (
            <div className="registration-number">
              <div className="label-detailed-symptoms">세부증상</div>
              <div className="wrapper-field">
                <div className="field full">
                  <input
                    disabled
                    value={asReceiptDetail.detailedSymptom || ''}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default AsReceiptDetails;
