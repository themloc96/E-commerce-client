import React, { Fragment } from 'react';
import { acceptMethods } from '../../../constants/jsonData/store';
import storeStyles from '../../../styles/store/store.module.scss';

function AcceptMethods({
  changeStyles,
  isShownHr,
  deviceName,
  handleChangeAccessMethod,
  currentAccessMethods,
}) {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {acceptMethods?.map(item => {
        const { value, text } = item;
        return (
          <Fragment key={value}>
            <div className={storeStyles.checkbox}>
              <input
                type="checkbox"
                id={`${value} - ${deviceName}`}
                name={value}
                value={value}
                defaultChecked={currentAccessMethods.includes(value)}
                onChange={handleChangeAccessMethod}
              />
              <label htmlFor={`${value} - ${deviceName}`}>{text}</label>
            </div>
            {isShownHr && <hr style={changeStyles(item.value)} />}
          </Fragment>
        );
      })}
    </>
  );
}

export default AcceptMethods;
