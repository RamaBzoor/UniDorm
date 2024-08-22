import React, { useState } from "react";
import "../HeroSection.css";
import Form from "./Form";
import Images from "../../../images";
import { LazyLoadImage } from "react-lazy-load-image-component"; // Import LazyLoadImage
import "react-lazy-load-image-component/src/effects/blur.css"; // Import CSS for fade-in animation

const HeroSection = () => {
  // State to store the submitted search value
  const [searchValue, setSearchValue] = useState("");

  // Function to handle form submission
  const handleSearchSubmit = (value) => {
    if (value === "") return;
    setSearchValue(value); // Update the search value
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="text">
          <h1>
            Discover Your Ideal
            <br /> Student Home With{" "}
            <span style={{ color: "var(--primary-100)" }}>
              Uni<span style={{ color: "var(--secondary-100)" }}>Dorm !</span>
            </span>
          </h1>
          <p>
            UniDorm is a company that makes the process of seeking student
            housing more
            <br /> straightforward by facilitating students' discovery of
            acceptable housing
            <br /> options.
          </p>
          {/* Pass the onSubmit function to the Form component */}
          <Form onSubmit={handleSearchSubmit} />
        </div>
        <div className="image">
          <img src={Images.MainHero} draggable="false" alt="Photo" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
