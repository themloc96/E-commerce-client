import React from 'react';
import { createPortal } from 'react-dom';

function Popover(props) {
  const { position, coords, className, children } = props;
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      style={{
        left: position === 'right' ? coords.x + coords.width : coords.x,
        top: coords.y + coords.height * 1.5,
      }}
      className={`absolute top-full ${
        position === 'right' ? '-translate-x-full' : ''
      } ${className}`}
    >
      {children}
    </div>,
    document.getElementById('root'),
  );
}
export default Popover;
