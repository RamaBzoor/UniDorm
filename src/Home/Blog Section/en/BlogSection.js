import React from "react";
import { Link } from "react-router-dom";
import Box from "./Box"; // Import the Box component
import Icons from "../../../icons"; // Import the Icons object from icons.js
import Images from "../../../images"; // Import the Images object from images.js
import "../BlogSection.css";

const BlogSection = () => {
  return (
    <section className="blog">
      <div className="container">
        <div className="sectionHeading">
          <h2>Our Blog</h2>
          <Link to="/blog">
            See All <img src={Icons.right} alt="icon" />
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
