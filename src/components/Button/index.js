/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import '../../styles/components/button.scss';
import { ClipLoader } from 'react-spinners';

function Button(props) {
  const { children, className, variant, fullWidth, isLoading, ...rest } = props;
  const [buttionDisabled, setButtonDisabled] = useState(false);

  if (rest.disabled && buttionDisabled === false) {
    setButtonDisabled(true);
  }
  return (
    <button
      {...rest}
      className={`common-btn ${className || ''} common-btn-${variant} ${
        fullWidth ? 'full-width' : ''
      }${isLoading ? 'loading-btn' : ''}`}
      disabled={isLoading || buttionDisabled}
    >
      {isLoading ? <ClipLoader size="25px" color="#fc5000" /> : null}
      {children}
    </button>
  );
}

Button.defaultProps = {
  variant: 'secondary',
  disabled: false,
};

export default Button;
