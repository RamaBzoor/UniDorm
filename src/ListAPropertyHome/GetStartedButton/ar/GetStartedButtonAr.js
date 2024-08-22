import React from "react";
import Icons from "../../../icons";
import { Link } from "react-router-dom";

const GetStartedButtonAr = () => {
  return (
    <div className="getStartedBtn">
      <Link to="/CreateProfileAsALandLord/ar">
        <img src={Icons.send} />
        البدء
      </Link>
    </div>
  );
};

export default GetStartedButtonAr;
