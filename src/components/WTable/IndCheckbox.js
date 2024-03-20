import React from 'react';
import '../../styles/components/wtable.scss';

export function IndCheckbox({ indeterminate, className = '', ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`ind-checkbox ${className} cursor-pointer`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
}
