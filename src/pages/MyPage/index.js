import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// COMPs
import Container from '../../components/Container';
import CustomersPage from '../../components/MyPage/customers';
import OrderManagement from '../../components/MyPage/order-management';
import PageHeader from '../../components/MyPage/page-header';
import PartnerManagement from '../../components/MyPage/partner-management';
import Settlement from '../../components/MyPage/settlement';
import AccountManagement from './AccountManagement/index';

import '../../styles/my-page/main.scss';
import { myPageTabs, myPageTabsUrlHash } from '../../constants';
import { useAuthContext } from '../../contexts/AuthProvider';

function Page() {
  const [myPageTab, setMyPageTab] = useState('');
  const location = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            .keyin-container {width: 100%;margin-left: auto;box-sizing: border-box;margin-right: auto;display: block;padding-left: 16px;padding-right: 16px;}
            .keyin-main {display: flex;flex-direction: column;width: 100%;height: 100%; //margin-bottom: 2.125rem;}
            .keyin-header { display: flex; padding-top: 2.5rem;align-items: start; border-bottom: 0.063rem solid rgba(0, 0, 0, 0.2);}
            .keyin-logo {width: auto; height: auto;margin-left: -0.03rem;}
            .keyin-link {color: #000000; display: flex; font-size: 1.25rem;  font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: left;padding-right: 0.1rem; align-items: start;margin-top: -0.6rem;}
            .keyin-link hr { margin: 0.55rem 1.25rem; width: 0.063rem;height: 1.625rem;flex-grow: 0;background-color: #CCCCCC;border-right-width: 0;-webkit-flex-shrink: 0;-ms-flex-negative: 0;flex-shrink: 0;border-width: 0;border-style: solid;border-color: #F2F4F7;}
            .keyin-link a:-webkit-any-link {color: #000000;cursor: pointer;text-decoration: none;} 
            .keyin-nav {display: flex; flex-grow: 1!important;height: 100%;padding-left: 4.53123vw;}
            .keyin-nav button {font-family: 'Noto Sans KR'; background: none;border: none;padding: 0px;font-size: 1.125rem;font-weight: 500;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: center;color: #000000;margin-left: 1rem;margin-top:-0.31rem; padding-bottom: 2.6rem;}
            .keyin-active{ border-bottom: 0.2rem solid!important;color: #fc5000!important;margin-top: -0.09rem!important;}
            .keyin-nav button:nth-child(n + 2) {  margin-left: 8.1rem;margin-right: 0.25rem;}
            .keyin-shopping-cart {display: flex; flex-direction: column; align-items: center;}
            .keyin-shopping-cart .title {font-size: 1.125rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #333333; margin-top: -0.4rem;}
            .keyin-shopping-cart .icon {position: relative;}
            .keyin-shopping-cart .icon .number {display: flex;flex-flow: row wrap;-webkit-box-pack: center;place-content: center;-webkit-box-align: center;align-items: center;position: absolute;box-sizing: border-box;font-weight: 500;font-size: 0.729167vw;width: 1.4585vw;line-height: 1;padding: 9px 2.8px 9.8px 2px;margin: 0 5.3px 17.5px 33px;height: 1.4585vw;border-radius: 0.729167vw;z-index: 1;transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;background-color: #fc5000;color: rgb(255, 255, 255);top: 0px;right: 0px;transform: scale(1) translate(65%, -30%);transform-origin: 100% 0%;}
            .keyin-account {display: flex; flex-direction: column; align-items: center;margin-right: -0.2rem;}
            .keyin-account .title {font-size: 1.125rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: right;color: #333333;margin-top: -0.2rem;}
            .keyin-account .icon {position: relative;}
            .keyin-account .icon .number {display: flex;flex-flow: row wrap;-webkit-box-pack: center;place-content: center;-webkit-box-align: center;align-items: center;position: absolute;box-sizing: border-box;font-weight: 500;font-size: 0.729167vw;width: 1.4585vw;line-height: 1;padding: 9px 2.8px 9.8px 2px;margin: 0 5.3px 17.5px 33px;height: 1.4585vw;border-radius: 0.729167vw;z-index: 1;transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;background-color: #fc5000;color: rgb(255, 255, 255);top: 0px;right: 0px;transform: scale(1) translate(60%, -35%);transform-origin: 100% 0%;}
            .keyin-point-badge{flex-grow: 0;display: flex;justify-content: flex-start;align-items: center;width: 7.75rem;height: 2.25rem;gap: 10px;border-radius: 60px;background-color: #fc5000;vertical-align: middle;margin-top: 0.3rem;}
            .keyin-point-badge .keyin-ellipse{width: 1.5rem;height: 1.5rem;flex-grow: 0;border-radius: 18px;background-image: linear-gradient(147deg, #fff278 7%, #ffd232 94%);flex-grow: 0;font-size: 1rem;font-weight: bold;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: center;color: #fc5000;margin-left: 0.25rem;}
            .keyin-point-badge .number{flex-grow: 0;font-family: Roboto;font-size: 1.25rem;font-weight: normal;font-stretch: normal;font-style: normal;line-height: normal;letter-spacing: normal;text-align: left;color: #fff;margin-left: -0.15rem;}
            .keyin-menu { display: none;margin-bottom: 1.25rem;}
            #product-order{background-color: #FFFFFF}

            .keyin-footer {display: flex;flex-direction: column;}
            .keyin-footer .keyin-info {padding-left: 1.6875rem; padding-top: 3.75rem; padding-bottom:3.75rem;}
            .keyin-address{font-size: 1rem;font-weight: normal;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000; padding-top: 1.14rem;}
            .keyin-contact{display: flex; align-items:baseline; font-size: 1rem;font-weight: normal;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000;font-family: Roboto; padding-top: 0.5rem}
            .keyin-contact hr{margin: 0 13px; width: 0.063rem;height: 0.75rem;flex-grow: 0;background-color: #a1a1a1;border-right-width: 0;-webkit-flex-shrink: 0;-ms-flex-negative: 0;flex-shrink: 0;border-width: 0;}
            .keyin-copyright{font-size: 1rem;font-weight: 500;font-stretch: normal;font-style: normal; line-height: normal;letter-spacing: normal;text-align: left; color: #000000;  padding-top: 1.2rem;}          

            @media(max-width:1200px){
              .keyin-nav button:nth-child(n + 2) {
                margin-left: 3.1rem;
              }
            }

            @media(max-width:992px){
              .keyin-menu { display: block;}
              .keyin-nav {display: none;}
              .keyin-link {display: none;}
              .keyin-logo{flex-grow: 1!important;}
            }

            @media(max-width:768px){
              .keyin-parent{background-color: #f5f7fb;}
              // .keyin-header{padding-top: 1.35rem;border-bottom: 0.15rem solid rgba(0, 0, 0, 0.2);}
              .keyin-logo{margin-top: -0.2rem;}
              .keyin-link{font-size: 0.875rem;}
              .keyin-menu{margin-bottom: 0.8rem;}

              .keyin-address{font-size: 0.75rem;}
              .keyin-contact{font-size: 0.75rem;}
              .keyin-copyright{font-size: 0.75rem;}
              .keyin-contact hr {margin: 0 0.625rem;height: 0.625rem};
            }

            @media(max-width:624px){
              .keyin-container{max-width: 35.625rem}
            }

            @media(max-width:600px){
              // .keyin-container{max-width: 30rem}
              .keyin-main hr{transform: rotate(-360deg);height: 0.125rem;margin-top: 1.288rem;}
              .keyin-link {padding-right:0.27rem; padding-top: 0.2rem;}
              .keyin-link hr{width: 0.063rem;height: 0.938rem;background-color: #CCCCCC;margin: 0.2rem 0.625rem 0 0.79rem;}
              .keyin-logo button img {width: 6rem; height: 1.2128rem;}
            
              .keyin-footer .keyin-info{padding-left: 0.438rem;padding-right: 0.438rem; padding-top: 3.75rem; padding-bottom:5.125rem; text-align: center;}
              .keyin-footer-logo img{width: 6rem;}
              .keyin-address{text-align:center;}
              .keyin-contact{text-align:center;justify-content: center;}
              .keyin-copyright{text-align:center;}
            }

            // @media(max-width:500px){
            //   .keyin-container{max-width: 28.5rem}
            // }

            // @media(max-width:470px){
            //   .keyin-container{max-width: 26.5rem}
            // }

            // @media(max-width:440px){
            //   .keyin-container{max-width: 24.5rem} 
            // }

            // @media(max-width:430px){
            //   .keyin-container{max-width: 23rem}
            // }

            // @media(max-width:400px){
            //   .keyin-container{max-width: 21rem}
            // }
          `}
      </style>
    );
  }

  const renderContent = () => {
    switch (myPageTab) {
      case myPageTabs.ORDER_MANAGEMENT:
        return <OrderManagement />;
      case myPageTabs.PARTNER_MANAGEMENT:
        return <PartnerManagement />;
      case myPageTabs.CALCULATE:
        return <Settlement />;
      case myPageTabs.ACCOUNT_MANAGEMENT:
        return <AccountManagement />;
      case myPageTabs.CUSTOMER_MANAGEMENT:
        return <CustomersPage />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // default my page tab
    if (!location?.hash) {
      setMyPageTab(myPageTabs.ORDER_MANAGEMENT);
      return;
    }
    // render content with condition
    switch (location?.hash.replace('#', '')) {
      case myPageTabsUrlHash.ORDER_MANAGEMENT:
        setMyPageTab(myPageTabs.ORDER_MANAGEMENT);
        break;
      case myPageTabsUrlHash.PARTNER_MANAGEMENT:
        setMyPageTab(myPageTabs.PARTNER_MANAGEMENT);
        break;
      case myPageTabsUrlHash.CALCULATE:
        setMyPageTab(myPageTabs.CALCULATE);
        break;
      case myPageTabsUrlHash.CUSTOMER_MANAGEMENT:
        setMyPageTab(myPageTabs.CUSTOMER_MANAGEMENT);
        break;
      case myPageTabsUrlHash.ACCOUNT_MANAGEMENT:
        setMyPageTab(myPageTabs.ACCOUNT_MANAGEMENT);
        break;
      default:
        break;
    }
  }, [location]);

  const currentLink = location?.hash
    ? `${location?.pathname}${location?.hash}`
    : '/my-page#order';

  return (
    <Container className="my-page-container">
      <Style />
      <div
        className={
          location.pathname === `/my-page/order-detail/${slug}`
            ? 'my-page oder-detail'
            : 'my-page !pt-0'
        }
      >
        <PageHeader currentLink={currentLink} />
        {renderContent()}
      </div>
    </Container>
  );
}

export default Page;
