import React, { useEffect } from "react";
import firebase from "../../firebaseConfig";
import Images from "../../images";
import Icons from "../../icons";
import Box from "../../Home/Blog Section/en/Box";
import { useNavigate } from "react-router";

export const BlogPage = () => {
  
  return (
    <>
      <section className="blog">
        <div className="container">
          <div className="sectionHeading">
            <h2>Our Blog</h2>
          </div>
          <div className="blog-boxes">
            <Box />
          </div>
        </div>
      </section>
    </>
  );
};