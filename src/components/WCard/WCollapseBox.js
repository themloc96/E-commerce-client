import React, { useCallback, useState } from 'react';
import '../../styles/components/wcollapse-box.scss';
import { useWindowDimensions } from '../../hooks';

function WCollapseBox(props) {
  const { children, className, title, isOpenCollapse } = props;
  const [isOpen, setIsOpen] = useState(isOpenCollapse || false);
  const classChildren = isOpen ? '' : 'hidden';
  const { width } = useWindowDimensions();
  // Actions Func
  const toggleCollapse = useCallback(() => {
    if (width > 786) return;

    setIsOpen(prev => !prev);
  }, [children]);

  return (
    <div className={`${className} wcollapse`}>
      <div
        onClick={toggleCollapse}
        aria-hidden="true"
        className="wcollapse-container"
      >
        <span className="wcollapse-title">{title}</span>
        <div>
          {children && (
            <img
              className={`${isOpen ? '' : 'icon-below'}`}
              src="/assets/icons/btn_arrow_18px@2x.png"
              alt=""
            />
          )}
        </div>
      </div>

      {children && <div className={classChildren}>{children}</div>}
    </div>
  );
}

export default WCollapseBox;
