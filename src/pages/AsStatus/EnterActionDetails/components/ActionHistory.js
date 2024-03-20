import { useState } from 'react';
import ViewDetailProductButton from '../../../../components/Shared/ViewDetailProductButton';

function ActionHistory({ actionHistory }) {
  const [isOpenItem, setIsOpenItem] = useState(true);

  return (
    <div className="item-information">
      <div className="title">
        <h2
          onClick={() => {
            setIsOpenItem(!isOpenItem);
          }}
        >
          A/S 조치내역
          <i className={!isOpenItem ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenItem && (
        <div className="registration-block">
          <div className="row">
            <div className="registration-number">
              <div className="label">모델명</div>
              <div className="wrapper-field">
                <div className="field">
                  <input disabled defaultValue={actionHistory.productModelName} />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">제품명</div>
              <div className="wrapper-field">
                <div className="field submit">
                  <input
                    disabled
                    defaultValue={
                      actionHistory.productName.length < 17
                        ? actionHistory.productName
                        : `${actionHistory.productName.substring(0, 17)}...`
                    }
                  />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label">상담유형</div>
              <div className="wrapper-field">
                <div className="field">
                  <input disabled defaultValue={actionHistory.consultationType} />
                </div>
              </div>
            </div>
          </div>
          <div className="registration-number">
            <div className="label-detailed-symptoms">대표증상</div>
            <div className="wrapper-field">
              <div className="field full">
                <input
                  disabled
                  defaultValue={actionHistory.representativeSymptom || ''}
                />
              </div>
            </div>
          </div>

          <div className="registration-number">
            <div className="label-detailed-symptoms">세부증상</div>
            <div className="wrapper-field">
              <div className="field full">
                <input disabled defaultValue={actionHistory.detailedSymptom || ''} />
              </div>
            </div>
          </div>

          <div className="registration-number">
            <div className="label-consulting-details">처리내용</div>
            <div className="wrapper-field">
              <div className="field full">
                <textarea
                  disabled
                  className="height"
                  defaultValue={actionHistory.asActionDetail || ''}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ActionHistory;
