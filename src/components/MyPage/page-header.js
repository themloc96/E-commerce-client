import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import { menuTabs } from './constants';
import { businessType } from '../../constants';
import '../../styles/my-page/page-header.scss';

function PageHeader({ currentLink = '/my-page#order' }) {
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;
  const newMenuTabs =
    businessInfo?.businessType === businessType.AGENCY ||
    businessInfo?.businessType === businessType.AS_AGENCY
      ? menuTabs
      : menuTabs?.filter(item => item.link !== '/my-page#partner');
  return (
    <div className="page-header">
      <h1 className="page-header-title">마이 페이지</h1>
      <div className="tab-button-outer">
        <div className="tab-button-inner">
          {newMenuTabs.map(item => {
            const { name, link } = item;

            return (
              <button
                key={link}
                className={currentLink === link ? 'active' : ''}
                onClick={() => {
                  // todo: 2차 개발 범위
                  // if (name === '고객관리') {
                  //   alert('페이지 준비중 입니다.')
                  //   return;
                  // }
                  navigate(link);
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
