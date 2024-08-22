import Lang from "./language/en/Lang";
import Nav from "./Header/en/Nav";
import Footer from "./Footer/en/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Lang />
      <Nav />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
