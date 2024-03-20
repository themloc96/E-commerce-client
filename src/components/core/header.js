import { useEffect, useState } from 'react';
import '../../styles/components/header.css';
import { Link } from 'react-router-dom';
import DrawerMenu from '../DrawerMenu/index';
import Logo from '../Logo';
import Container from '../Container';

function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : 'auto';
  }, [openMenu]);
  const handleLogoClick = event => {
    event.preventDefault();
    // If you are not logged in => Go to landing page when clicking logo
    // router.push('/keyin');
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, null, '/');
    // If you are logged in => Click the logo to go to the main page
  };
  const windowWidth = window.innerWidth;

  const sigUpStatus = localStorage.getItem('sigUp') || '';

  return (
    <Container>
      <div className="keyin-header">
        <div className="keyin-logo">
          <button
            className="keyin-button"
            style={{ p: 0, m: 0 }}
            onClick={handleLogoClick}
          >
            <Logo isDark />
          </button>
        </div>
        {windowWidth <= 600 && !sigUpStatus ? (
          <button
            className="menu-header-icon"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <img
              alt="toggle-options"
              src={`/assets/app/${
                openMenu ? 'close.svg' : 'toggle-options.svg'
              }`}
            />
          </button>
        ) : (
          <div className="keyin-link keyin-link-light">
            <a
              href="https://keyin.life/kr/main/index.do"
              target="_blank"
              rel="noreferrer"
              className="keyin-introduce"
            >
              Keyin 소개
            </a>
            <hr />
            {/* Redirect login page */}
            <Link to="/auth">
              <span>로그인</span>
            </Link>
          </div>
        )}
      </div>
      <hr className="hr-header" />
      {openMenu && <DrawerMenu />}
    </Container>
  );
}

export default Header;
