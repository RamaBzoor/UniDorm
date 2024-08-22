import React from "react";
import Images from "../../../images";
import "../oneReview.css";
import Icons from "../../../icons";

const oneReview = () => {
  return (
    <section className="oneReviewSection">
      <div className="container">
        <div className="imgContainer">
          <img src={Images.oneReview} alt="ReviewImg" />
        </div>
        <div className="reviewText">
          <img src={Icons.quote} alt="Quote" />
          <p>
            I used unidorm and it was a great experience. I had a lot of
            students renting my properties in canda and I reached them through
            this website. I really like unidorm.{" "}
          </p>
          <p>Adam Mohamed</p>
        </div>
      </div>
    </section>
  );
};

export default oneReview;
