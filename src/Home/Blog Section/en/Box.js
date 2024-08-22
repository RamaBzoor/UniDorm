import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icons from "../../../icons"; // Import the Icons object from icons.js
import firebase from "../../../firebaseConfig";

const Box = ({ numberOfBlogs }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase
    const fetchData = async () => {
      try {
        const blogsRef = firebase.database().ref("Blogs");
        blogsRef.on("value", (snapshot) => {
          const blogData = snapshot.val();
          if (blogData) {
            // Convert object to array for easier manipulation
            const blogArray = Object.keys(blogData).map((key) => ({
              id: key,
              ...blogData[key],
            }));
            setBlogs(blogArray);
          }
        });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();

    // Cleanup function to unsubscribe from Firebase listener
    return () => {
      firebase.database().ref("blogs").off();
    };
  }, []);

  // If numberOfBlogs is provided, slice the blogs array to display only the specified number
  const blogsToDisplay = numberOfBlogs ? blogs.slice(0, numberOfBlogs) : blogs;

  return (
    <div className="blog-boxes">
      {blogsToDisplay.map((blog) => (
        <div className="blog-box" key={blog.id}>
          <img src={blog.image} alt="blog image" className="blogPhoto" />
          <div className="info">
            <h2>{blog.title}</h2>
            <p>{blog.describtion}</p>{" "}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Box;
