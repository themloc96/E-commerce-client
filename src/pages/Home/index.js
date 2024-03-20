import React, { useState, useRef } from 'react';
import '../../styles/home/main.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { debounce } from 'lodash';
import homeStyles from '../../styles/home/main.module.scss';
import Logo from '../../components/Logo';
import Container from '../../components/Container';
import { useAuthContext } from '../../contexts/AuthProvider';
import { useWindowDimensions } from '../../hooks';

function Page() {
  const [inProp, setInProp] = useState(true);
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { width } = useWindowDimensions();
  const mobileType = navigator.userAgent.toLowerCase();

  function Style() {
    return (
      <style>
        {`
        .keyin-root-main{background-image: url('/assets/keyins_matte.png')}

        //Transition
        .keyin-main-transition-enter {
            transform: translateY(-100%);
            -webkit-transform: translateY(-100%);
        }

        .keyin-main-transition-enter-active {
            transform: translateY(0);
            -webkit-transform: translateY(0);
            -webkit-transition: all 1000ms ease-in-out;
            -moz-transition: all 1000ms ease-in-out;
            -o-transition: all 1000ms ease-in-out;
            transition: all 1000ms ease-in-out;
        }

        .keyin-main-transition-exit {
            transform: translateY(0);
            -webkit-transform: translateY(0);
        }

        .keyin-main-transition-exit-active {
            transform: translateY(-100%);
            -webkit-transform: translateY(-100%);
            -webkit-transition: all 1000ms ease-in-out;
            -moz-transition: all 1000ms ease-in-out;
            -o-transition: all 1000ms ease-in-out;
            transition: all 1000ms ease-in-out;
        }
        @media(max-width:600px){
            .keyin-root-main{background-image: url('/assets/keyins_matte_m.png'); background-position-y: bottom;}
        }
        `}
      </style>
    );
  }
  //   const router = useRouter();
  // #region action
  /**
   * Tuong.TT 2023-04-28
   * Function check auth and router page
   * @param {*} event
   */
  const handleLogoClick = event => {
    event.preventDefault();
    // If you are not logged in => Go to landing page when clicking logo
    if (state?.isAuthenticated) {
      navigate('/main');
    } else {
      // router.push('/keyin');
      // eslint-disable-next-line no-restricted-globals
      navigate('/');
    }
    // If you are logged in => Click the logo to go to the main page
  };
  /**
   * Tuong.TT 2023-06-08: debounce function for call redirect page auth
   */
  const handleRedirectAuth = debounce(() => {
    navigate('/auth');
  }, 700);

  const handleStart = event => {
    event.preventDefault();
    setInProp(false);
    // const timer = setInterval(() => {
    //   navigate('/auth');
    //   return () => clearInterval(timer);
    // }, 300);

    // Tuong.TT 2023-06-08: fix '시작하기' button function err
    handleRedirectAuth();
  };

  if (state?.isAuthenticated) return <Navigate to="/main" />;

  // #endregion
  return (
    <>
      <Style />
      <CSSTransition
        classNames="keyin-main-transition"
        nodeRef={nodeRef}
        in={inProp}
        timeout={1000}
      >
        <main ref={nodeRef} className="keyin-root-main">
          <Container>
            <div className={homeStyles['keyin-main']}>
              <div className={homeStyles['keyin-header']}>
                <div className={homeStyles['keyin-logo']}>
                  <button
                    className={homeStyles['keyin-button']}
                    onClick={handleLogoClick}
                  >
                    {/* <img alt="logo" src="/assets/logos/keyin.png" /> */}
                    <Logo />
                  </button>
                </div>
                <div className={homeStyles['keyin-link']}>
                  <a
                    href="https://keyin.life/kr/main/index.do"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Keyin 소개
                  </a>
                  <hr />
                  {/* Redirect login page */}
                  <Link to="/auth">
                    <span>로그인</span>
                  </Link>
                </div>
              </div>
              <hr />
              <div className={`${homeStyles['keyin-banner']}`}>
                <div className={homeStyles['keyin-sologan']}>
                  <span>Keyin Your Life.</span>
                  <span>당신의 삶을 키인하세요.</span>
                </div>
                <div className={homeStyles['keyin-title']}>
                  <span>
                    라오나크 공식
                    <br />
                    도·소매 전문 플랫폼
                  </span>
                </div>
                <div className={homeStyles['keyin-action']}>
                  <button onClick={handleStart}>
                    <span style={{ paddingRight: '0.3rem' }}>시작하기</span>
                  </button>
                  {width > 768 && (
                    <div className={homeStyles['fl-banner']}>
                      <Link to="/auth">
                        <img
                          className="!h-full"
                          src="/assets/fl_banner.png"
                          alt="fl banner"
                        />
                      </Link>
                    </div>
                  )}
                </div>
                <div className={homeStyles['keyin-apps']}>
                  {!(
                    mobileType.includes('raonark_iphone') ||
                    mobileType.includes('raonark_ipad') ||
                    mobileType.includes('raonark_ipod')
                  ) && (
                    <>
                      <a href="#">
                        <img
                          alt="google-play"
                          src="/assets/app/google-play.png"
                        />
                      </a>
                      <a href="#">
                        <img
                          alt="apple-store"
                          src="/assets/app/apple-store.png"
                        />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </main>
      </CSSTransition>
      {/* <FooterComponent /> */}
    </>
  );
}

export default Page;
