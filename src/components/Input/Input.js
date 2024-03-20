/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import '../../styles/components/input.scss';

// eslint-disable-next-line react/function-component-definition
const Input = React.forwardRef((props, ref) => {
  const {
    // numberonly,
    classes,
    label = 'ninefive',
    error = false,
    helperText = 'error message',
    sublabel,
    isLabel = true,
    register,
    name,
    disabled = false,
    rule = {},
    defaultValue,
    noHelperText = false,
    isActionDelete = false,
    isActionShowPwd = false,
    onHandleCheckViewType = () => {},
    onHandleDeleteValue = () => {},
    viewType,
    ...rest
  } = props;
  const [isFocus, setIsFocus] = useState(false);
  const width = window.innerWidth;

  const renderImage = () => {
    if (width <= 767 && viewType === 'text')
      // a small visible icon
      return <img className='viewIcon' alt="viewImage2" src="/assets/icons/pw_view_icon_2.png" />;
    if (width <= 767 && viewType === 'password')
      // an invisible little icon
      return <img className='viewIcon' alt="viewImage1" src="/assets/icons/pw_view_icon.png" />;
    if (width > 767 && viewType === 'text')
      // an big invisible icon
      return <img alt="viewImage4" src="/assets/icons/pw_view_icon_2@2x.png" />;
    // big invisible icon
    return <img alt="viewImage3" src="/assets/icons/pw_view_icon@2x.png" />;
  };

  return (
    <>
      {isLabel && (
        <label className="common-input-label" htmlFor={label}>
          {label}
        </label>
      )}
      {sublabel && (
        <p className="f12Regular text-textSecondary2 common-input-sublabel">
          {sublabel}
        </p>
      )}
      <div className="wrap-input-error">
        {register && (
          <div style={{ position: 'relative' }}>
            <input
              ref={ref}
              {...register(name, rule)}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
              className={`${classes || ''} common-input ${
                isFocus
                  ? 'border-textSecondary1'
                  : 'border-textSecondary1/[0.3]'
              } ${error ? 'text-error !border-error' : ''}`}
              disabled={disabled}
              onKeyPress={e => {
                e.key === 'Enter' && e.preventDefault();
              }}
              {...rest}
            />
            {isActionDelete && (
              <button onClick={() => onHandleDeleteValue()} type="button">
                {width > 767 ? (
                  <img
                    alt="deleteImage"
                    className="icon-delete"
                    src="/assets/icons/close_16px@2x.png"
                  />
                ) : (
                  <img alt="deleteImage" src="/assets/icons/close_16px.png" />
                )}
              </button>
            )}
            {isActionShowPwd && (
              <button
                type="button"
                className="view-button"
                onClick={() => onHandleCheckViewType()}
              >
                {renderImage()}
              </button>
            )}
          </div>
        )}
        {!register && (
          <input
            ref={ref}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => {
              setIsFocus(false);
            }}
            className={`common-input ${classes || ''} ${
              isFocus ? 'border-textSecondary1' : 'border-textSecondary1/[0.3]'
            } ${error ? 'text-error !border-error' : ''}`}
            disabled={disabled}
            onKeyPress={e => {
              e.key === 'Enter' && e.preventDefault();
            }}
            {...rest}
            defaultValue={defaultValue}
          />
        )}
        {error && helperText && !noHelperText && (
          <p className="f12Regular md:f16Regular text-error mt-[10px] ml-[10px] md:ml-[0px]">
            {helperText}
          </p>
        )}
      </div>
    </>
  );
});

export default Input;
