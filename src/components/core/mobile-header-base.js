import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from '../../styles/components/mobile-header-base.module.scss';
import CartIconMobile from '../CartIcon/CartIconMobile';
import Container from '../Container';
import DrawerMenu from '../DrawerMenu';
import Logo from '../Logo';

function MobileHeaderBase({ getListSub }) {
  const [openMenu, setOpenMenu] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (openMenu) {
      document.body.style = 'overflow: hidden';
    } else {
      document.body.style = 'overflow: auto';
    }
    return () => {
      document.body.style = 'overflow: auto';
    };
  }, [openMenu]);

  const showBorderBottom = () => {
    if (pathname !== '/main') {
      return { borderBottomColor: 'rgba(0, 0, 0, 0.2)' };
    }
    if (pathname === '/main' && openMenu) {
      return { borderBottomColor: 'rgba(0, 0, 0, 0.2)' };
    }
    return {};
  };

  return (
    <div className={styles.wrapper}>
      <Container className="h-full">
        <div className={`${styles.content}`} style={showBorderBottom()}>
          <Logo isDark link="/main" onClick={() => setOpenMenu(false)} />
          <div className={styles.headerRight}>
            <CartIconMobile />
            <button onClick={() => setOpenMenu(!openMenu)}>
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
      {openMenu && (
        <DrawerMenu
          handleGetListSubmenu={getListSub}
          setOpenMenu={setOpenMenu}
        />
      )}
    </div>
  );
}

export default MobileHeaderBase;
