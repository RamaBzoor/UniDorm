import React from "react";
import "../GetStarted.css";
import Images from "../../../images";
import GetStartedButtonAr from "../../GetStartedButton/ar/GetStartedButtonAr";

const GetStarted = () => {
  return (
    <section className="getStarted">
      <div className="container">
        <p>
          كن بائعًا<span> على يونيدورم و</span> احصل على الأموال{" "}
        </p>
        <img src={Images.GetStartedImg} alt="getStarted" />
        <GetStartedButtonAr />
      </div>
    </section>
  );
};

export default GetStarted;
