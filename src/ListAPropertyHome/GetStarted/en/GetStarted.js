import React from "react";
import "../GetStarted.css";
import Images from "../../../images";
import GetStartedButton from "../../GetStartedButton/en/GetStartedButton";

const GetStarted = () => {
  return (
    <section className="getStarted">
      <div className="container">
        <p>
          Be Seller <span> on UniDorm and </span> Get Paid{" "}
        </p>
        <img src={Images.GetStartedImg} alt="getStarted" />
        <GetStartedButton />
      </div>
    </section>
  );
};

export default GetStarted;
