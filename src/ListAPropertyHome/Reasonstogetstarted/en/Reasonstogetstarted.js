import React from "react";
import "../Reasonstogetstarted.css";
import Images from "../../../images";

const Reasonstogetstarted = () => {
  return (
    <section className="reasonsToGetStarted">
      <div className="container">
        <div className="sectionHeading">
          <h2>Many reasons to get started</h2>{" "}
        </div>
        <div className="listAProbBoxContainer">
          <div className="listAProbBox">
            <img src={Images.Reason1} alt="reason" />
            <h2>Reach more Students</h2>
            <p>
              Our marketplace has a large and growing user
              <br /> base of pet owners.
            </p>
          </div>
          <div className="listAProbBox">
            <img src={Images.Reason2} alt="reason" />
            <h2>Increase your sells</h2>
            <p>
              Our marketplace makes it easy for customers <br /> to find and
              book properties.
            </p>
          </div>
          <div className="listAProbBox">
            <img src={Images.Reason3} alt="reason" />
            <h2>Get supports form experts</h2>
            <p>
              We have a team of experts who are here to
              <br /> help you succeed on our marketplace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reasonstogetstarted;
