/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// COMPs
import CartIconDesktop from '../CartIcon/CartIconDesktop';
import Container from '../Container';
import Logo from '../Logo';
import MobileHeaderBase from './mobile-header-base';
import headerStyles from '../../styles/components/header.module.scss';

// hook
import { useWindowDimensions } from '../../hooks';

// utils
import { getActiveMenuItem, getActiveSubMenuItem } from './utils';
import { formatNumber, callComingSoon } from '../../utils/helpers';

// context
import { useAuthContext } from '../../contexts/AuthProvider';

// constant
import { menuItems } from './constants';
import { businessType } from '../../constants';

function Header() {
  const location = useLocation();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { mileagePoint, businessInfo, currentUser } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeMenuItemHover, setActiveMenuItemHover] = useState(null);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : 'auto';
  }, [openMenu]);
  const getListSub = value => {
    const tab = menuItems.filter(t => t.value === value);
    return tab && tab.length > 0 ? tab[0].sub : [];
  };

  const listmenuItem = useMemo(() => {
    // todo: 2차 개발 범위 권한 해제
    if (
      currentUser?.businessType !== 'AS_AGENCY' &&
      (currentUser?.asengineer === false ||
        currentUser?.memberType !== 'ACCOUNT' ||
        currentUser?.previousMemberType !== 'ACCOUNT')
    ) {
      return menuItems.filter(b => b.value !== 'a-s-management') || [];
    }
    return menuItems;
  }, [businessInfo, menuItems]);

  const handleOnMouseOver = () => {
    setShowMenu(true);
  };
  const handleOnMouseOut = () => {
    setShowMenu(false);
  };

  const pathname = location?.pathname;
  const activeMenuItem = getActiveMenuItem({
    menuList: listmenuItem,
    pathname,
  });
  const activeSubMenuItem = getActiveSubMenuItem({
    menuItem: activeMenuItem,
    pathname,
  });

  const showBorderBottom = () => {
    if (pathname !== '/main') {
      return {};
    }
    if (!openMenu && window.innerWidth <= 992) {
      return { border: '0' };
    }
    if (!showMenu && window.innerWidth > 992) {
      return { border: '0' };
    }
    return {};
  };

  const onMouseEnterSubHeader = path => {
    setActiveMenuItemHover(
      getActiveMenuItem({
        menuList: listmenuItem,
        pathname: path,
      }),
    );
  };

  const onMouseLeaveSubHeader = () => {
    setActiveMenuItemHover(null);
  };

  const onClickSubMenuItem = link => {
    setShowMenu(false);
    navigate(link);
  };

  return (
    <>
      {width > 992 && (
        <div className={headerStyles['keyin-gnb-header-relative']}>
          <div
            className={`${headerStyles['keyin-gnb-header']} ${
              openMenu ? headerStyles['white-header'] : ``
            }`}
          >
            <Container>
              <div className={headerStyles['keyin-main']}>
                <div
                  className={`${headerStyles['keyin-header']}`}
                  style={showBorderBottom()}
                >
                  <div className={headerStyles['keyin-logo']}>
                    <button
                      className={headerStyles['keyin-button']}
                      onClick={handleOnMouseOut}
                    >
                      <Logo isDark link="/main" />
                    </button>
                  </div>
                  <div className={headerStyles['keyin-nav']}>
                    <div
                      onMouseOver={handleOnMouseOver}
                      onFocus={handleOnMouseOver}
                      onBlur={handleOnMouseOut}
                    >
                      {listmenuItem.map(menuItem => {
                        const { value, text, link } = menuItem;
                        return (
                          <button
                            key={value}
                            className={
                              (activeMenuItem || activeMenuItemHover)?.value ===
                              value
                                ? headerStyles['keyin-active']
                                : ''
                            }
                          >
                            {text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className={headerStyles['keyin-link']}>
                    <button className={headerStyles['keyin-point-badge']}>
                      <Link to="/mileage">
                        <div className={headerStyles['keyin-ellipse']}>P</div>
                        <span className={headerStyles.number}>
                          {formatNumber(mileagePoint)}
                        </span>
                      </Link>
                    </button>
                    <hr />
                    <CartIconDesktop />
                    <hr />
                    <Link
                      to="/my-page#order"
                      className={headerStyles['keyin-account']}
                    >
                      <div className={headerStyles.icon}>
                        <img src="/assets/account/user.png" alt="" />
                      </div>
                      <span className={headerStyles.title}>마이페이지</span>
                    </Link>
                  </div>
                  <div
                    className={headerStyles['keyin-shopping-cart-mobile']}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate('/cart')}
                  >
                    <div className={headerStyles.icon}>
                      <img src="/assets/cart/shopping.svg" alt="" />
                      {/* <span className={headerStyles.number}>10+</span> */}
                    </div>
                  </div>
                  <button
                    className={headerStyles['keyin-menu']}
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <img
                      src={`/assets/app/${
                        openMenu ? 'close.svg' : 'toggle-options.svg'
                      }`}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </Container>
            <div
              className={headerStyles['keyin-gnb-menu']}
              style={
                showMenu === true ? { display: 'block' } : { display: 'none' }
              }
              onMouseOver={handleOnMouseOver}
              onFocus={handleOnMouseOver}
              onMouseOut={handleOnMouseOut}
              onBlur={handleOnMouseOut}
            >
              <Container className={`${headerStyles['keyin-container']}`}>
                <div className={headerStyles['keyin-nav-sub-menu']}>
                  <div className={headerStyles['product-order']}>
                    {getListSub('product-order')?.map(t => {
                      return (
                        <button
                          key={t.value}
                          onMouseEnter={() => onMouseEnterSubHeader(t.link)}
                          onMouseLeave={onMouseLeaveSubHeader}
                          className={
                            activeSubMenuItem?.value === t.value
                              ? headerStyles['keyin-sub-active']
                              : ''
                          }
                          onClick={() => {
                            onClickSubMenuItem(t.link);
                          }}
                          onTouchStart={e => {
                            e.stopPropagation();
                            onClickSubMenuItem(t.link);
                          }}
                        >
                          <Link to={t.link}>{t.text}</Link>
                        </button>
                      );
                    })}
                  </div>
                  <div className={headerStyles.community}>
                    {getListSub('community')?.map(t => {
                      return (
                        <button
                          key={t.value}
                          onMouseEnter={() => onMouseEnterSubHeader(t.link)}
                          onMouseLeave={onMouseLeaveSubHeader}
                          className={
                            activeSubMenuItem?.value === t.value
                              ? headerStyles['keyin-sub-active']
                              : ''
                          }
                          onClick={() => {
                            // todo: 2차 개발 범위
                            onClickSubMenuItem(t.link);
                          }}
                          onTouchStart={e => {
                            e.stopPropagation();
                            onClickSubMenuItem(t.link);
                          }}
                        >
                          <Link to={t.link}>{t.text}</Link>
                        </button>
                      );
                    })}
                  </div>
                  {/* todo: 2차 개발 범위 권한 해제 */}
                  {/* {currentUser?.businessType === 'AS_AGENCY' &&
                    (currentUser?.asengineer ||
                      currentUser?.memberType === 'ACCOUNT' ||
                      currentUser?.previousMemberType === 'ACCOUNT') && (
                      <div className={headerStyles['a-s-management']}>
                        {getListSub('a-s-management')?.map(t => {
                          return (
                            <button
                              key={t.value}
                              onMouseEnter={() => onMouseEnterSubHeader(t.link)}
                              onMouseLeave={onMouseLeaveSubHeader}
                              className={
                                activeSubMenuItem?.value === t.value
                                  ? headerStyles['keyin-sub-active']
                                  : ''
                              }
                              onClick={() => {
                                onClickSubMenuItem(t.link);
                              }}
                              onTouchStart={e => {
                                e.stopPropagation();
                                onClickSubMenuItem(t.link);
                              }}
                            >
                              <Link to={t.link}>{t.text}</Link>
                            </button>
                          );
                        })}
                      </div>
                    )} */}
                </div>
              </Container>
            </div>
          </div>
          <div
            className={headerStyles['keyin-gnb-backdrop']}
            style={
              showMenu === true ? { display: 'block' } : { display: 'none' }
            }
          />
        </div>
      )}
      {width <= 992 && <MobileHeaderBase getListSub={getListSub} />}
    </>
  );
}

export default Header;
