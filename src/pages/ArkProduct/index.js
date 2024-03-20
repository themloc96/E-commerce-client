import React from 'react';
// import Container from '../../components/Container'

/**
 * Page
 */
import Main from './main';

function Page() {
  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}
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
    </>
  );
}

export default Page;
