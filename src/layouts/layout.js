// import Header from '../components/core/header';
// import Footer from '../components/core/footer';

function Layout(props) {
  const { children } = props;
  return (
    <>
      <div className="keyin-container">
        {/* <Header /> */}
        {children}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Layout;
