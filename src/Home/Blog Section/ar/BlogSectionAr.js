import React from "react";
import { Link } from "react-router-dom";
import Box from "./BoxAr"; // Import the Box component
import Icons from "../../../icons"; // Import the Icons object from icons.js
import Images from "../../../images"; // Import the Images object from images.js

const BlogSection = () => {
  return (
    <section className="blog">
      <div className="container">
        <div className="sectionHeading">
          <h2>مدونتنا</h2>
          <Link to="/blog/ar">
            برؤيه المزيد{" "}
            <img
              style={{ rotate: "180deg", margin: "0 0 0 20px" }}
              src={Icons.right}
              alt="icon"
            />
          </Link>
        </div>
        <div className="blog-boxes">
          <Box numberOfBlogs={3} />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
