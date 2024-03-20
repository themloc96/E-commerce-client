import React from 'react';
import { createPortal } from 'react-dom';
import MobileHeader from '../../core/mobile-header';

function PortalWrapper({children, onClose, headerLabel = 'label here'}) {
  return createPortal(
    <>
      <MobileHeader name={headerLabel} onBack={onClose} />
      {children}
    </>,
    document.getElementById('root'),
  );
}

export default PortalWrapper;
