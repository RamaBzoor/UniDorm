import React from "react";
import Icons from "../../../icons";
import { Link } from "react-router-dom";

const GetStartedButton = () => {
  return (
    <div className="getStartedBtn">
      <Link to="/CreateProfileAsALandLord">
        <img src={Icons.send} />
        Get Started
      </Link>
    </div>
  );
};

export default GetStartedButton;
