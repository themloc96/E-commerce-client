import React from 'react';
// import FooterComponent from '../../components/core/footer';

/**
 * Page
 */
import Main from './keyinSmartLock';

function Page() {
  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}

            // @media(max-width:768px){
            //   .keyin-parent{background-color: #f5f7fb;}
            // }
          `}
      </style>
    );
  }

  return (
    <>
      <Style />
      <main className="keyin-parent">
        <div id="store">
          <Main />
        </div>
      </main>
      {/* <FooterComponent /> */}
    </>
  );
}

export default Page;
