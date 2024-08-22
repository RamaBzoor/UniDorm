import React, { useState } from "react";
import "../HeroSection.css";
import FormAr from "./FormAr";
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
    <section className="hero" dir="rtl">
      <div className="container">
        <div className="text">
          <h1>
            اكتشف منزلك المثالي
            <br /> للطلاب مع{" "}
            <span style={{ color: "var(--primary-100)" }}>
              Uni<span style={{ color: "var(--secondary-100)" }}>Dorm !</span>
            </span>
          </h1>
          <p>
            UniDorm هي شركة تسهل عملية البحث عن سكن للطلاب
            <br /> من خلال تسهيل اكتشاف الطلاب لخيارات السكن المناسبة
            <br /> المتاحة.
          </p>
          {/* Pass the onSubmit function to the FormAr component */}
          <FormAr onSubmit={handleSearchSubmit} />
        </div>
        <div className="image">
          <img src={Images.MainHero} draggable="false" alt="صورة" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
