import { useState } from 'react';
import DropdownSurcharge from './DropdownSurcharge';
import { formatNumber } from '../../../../utils/helpers';

function AsCost({ asCost, surchargeList }) {
  const [isOpenAsCost, setIsOpenAsCost] = useState(true);

  const asSurchargeTypes = new Set(
    asCost?.surchargeList?.map(item => item.asSurchargeType),
  );

  const updateListOption = surchargeList?.map(item => {
    if (asSurchargeTypes.has(item?.surchargeType)) {
      return { ...item, isActive: true };
    }
    return { ...item, isActive: false };
  });

  return (
    <div className="as-cost">
      <div className="title">
        <h2
          onClick={() => {
            setIsOpenAsCost(!isOpenAsCost);
          }}
        >
          {!isOpenAsCost ? 'A/S 비용' : 'A/S 비용'}
          <i className={!isOpenAsCost ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenAsCost && (
        <div className="registration-block">
          <div className="registration-number">
            <div className="label-customer-name">비용총액(원)</div>
            <div className="wrapper-field">
              <div className="field full">
                <input
                  placeholder=""
                  value={formatNumber(
                    asCost.travelFee + asCost.materialFee + asCost.surchargeFee,
                  )}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="registration-number">
              <div className="label-travel-expenses">출장비</div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    placeholder=""
                    value={formatNumber(asCost.travelFee)}
                    disabled
                  />
                </div>
                <div className="add-item">
                  <img src="../../../../assets/icons/icon-add.png" alt="" />
                </div>
              </div>
            </div>

            <div className="registration-number">
              <div className="label-travel-expenses">자재비</div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    placeholder=""
                    value={formatNumber(asCost.materialFee)}
                    disabled
                  />
                </div>
                <div className="add-item">
                  <img src="../../../../assets/icons/icon-add.png" alt="" />
                </div>
              </div>
            </div>
            <div className="registration-number">
              <div className="label-travel-expenses">할증료</div>
              <div className="wrapper-field">
                <div className="field">
                  <input
                    placeholder=""
                    value={formatNumber(asCost.surchargeFee)}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <DropdownSurcharge
            totalSurchargeAmount={asCost?.surchargeTotalFee}
            placeHolderText=""
            options={updateListOption.map(item => {
              return {
                ...item,
                label: item.surchargeType,
                value: item.surchargeType,
              };
            })}
          />
        </div>
      )}
    </div>
  );
}
export default AsCost;
