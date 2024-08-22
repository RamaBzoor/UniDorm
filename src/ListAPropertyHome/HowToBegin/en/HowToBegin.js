import React from "react";
import Images from "../../../images";
import "../HowToBegin.css";

const HowToBegin = () => {
  return (
    <section className="howToBegin">
      <div className="container">
        <div className="sectionHeading">
          <h2>How to begin your business</h2>{" "}
        </div>
        <div className="listAProbBoxContainer">
          <div className="listAProbBox">
            <img src={Images.PhoneProfile} alt="reason" />
            <h2>Create your profile</h2>
            <p>
              Your business name, contact <br /> information, a brief
              description of
              <br /> their services..
            </p>
          </div>
          <img src={Images.Line} />
          <div className="listAProbBox">
            <img src={Images.onRock} alt="reason" />
            <h2>Get work </h2>
            <p>
              Receive requests from students and <br /> get in touch with them.
            </p>
          </div>
          <img src={Images.Line} />
          <div className="listAProbBox">
            <img src={Images.Coins} alt="reason" />
            <h2>Get Paid</h2>
            <p>
              Students will book your property <br /> and pay for you.{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBegin;
