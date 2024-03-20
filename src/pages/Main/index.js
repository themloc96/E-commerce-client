import React from 'react';
// import FooterComponent from '../../components/core/footer';

/**
 * Page
 */
import MainPage from './main';
import { useAuthContext } from '../../contexts/AuthProvider';

function Page() {
  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            .main-bg-white{background-color:#FFFFFF;margin-top:0px!important;}
            
            @media(min-width: 600px){
              padding-top: 7.41px;
            }
            #main *{line-height: 1;}

          `}
      </style>
    );
  }
  return (
    <>
      <Style />
      <main className="keyin-parent md:mt-[8px] mt-[2px]">
        <div id="main" style={{ display: 'block' }}>
          <MainPage />
        </div>
      </main>
      {/* <FooterComponent /> */}
    </>
  );
}

export default Page;
