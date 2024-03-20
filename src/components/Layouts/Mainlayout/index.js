/* eslint-disable import/no-named-default */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../core/header';
import { default as BaseHeader } from '../../core/header-base';
import Footer from '../../core/footer';
import styles from '../../../styles/components/layout.module.scss';

// eslint-disable-next-line react/function-component-definition
export const Mainlayout = props => {
  const {
    renderWithoutFooter,
    headerType = 'baseHeader',
    className = '',
  } = props;
  return (
    <div className={className || ''}>
      {headerType === 'baseHeader' && (
        <div className={styles.headerBaseWrapper}>
          <BaseHeader />
        </div>
      )}
      {headerType === 'header' && <Header />}
      <div>
        <Outlet />
      </div>
      {renderWithoutFooter ? null : <Footer />}
    </div>
  );
};
