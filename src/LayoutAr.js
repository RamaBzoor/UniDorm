import React from "react";
import LangAr from "./language/ar/LangAr";
import NavAr from "./Header/ar/NavAr";
import FooterAr from "./Footer/ar/FooterAr";

const LayoutAr = ({ children }) => {
  return (
    <>
      <LangAr />
      <NavAr />
      {children}
      <FooterAr />
    </>
  );
};

export default LayoutAr;
