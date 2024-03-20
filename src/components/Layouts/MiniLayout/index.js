/* eslint-disable import/no-named-default */
import React from 'react';
import { Outlet } from 'react-router-dom';

import { default as BaseHeader } from '../../core/header-base';
import MobileHeader from '../../core/mobile-header';
import { useWindowDimensions } from '../../../hooks';
import styles from '../../../styles/components/layout.module.scss';
import Footer from '../../core/footer';
import Header from '../../core/header';

// eslint-disable-next-line react/function-component-definition
const Minilayout = props => {
  const {
    name = '',
    renderWithoutFooter = false,
    className = '',
    headerType = 'baseHeader',
  } = props;
  const { width } = useWindowDimensions();
  return (
    <div className={className || ''}>
      {width > 768 && (
        <div className={styles.headerBaseWrapper}>
          {headerType === 'baseHeader' && (
            <div className={styles.headerBaseWrapper}>
              <BaseHeader />
            </div>
          )}
          {headerType === 'header' && <Header />}
        </div>
      )}
      {width <= 768 && <MobileHeader name={name || ''} />}
      <Outlet />
      {renderWithoutFooter ? null : <Footer />}
    </div>
  );
};

export { Minilayout };
