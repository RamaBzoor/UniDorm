import React from "react";
import "../CreateProfileLandlord.css";
import Icons from "../../icons";
import { Link } from "react-router-dom";

const CreateProfileLandlord = () => {
  return (
    <div className="createProfileLandlordPage">
      <div className="container">
        <div className="createProfileLandlord">
          <div className="heading">
            <p>Create Your Profile as a landlord </p>
          </div>
          <div className="pageContent">
            <div className="contentBox">
              <div className="text">
                <p>Basic Information</p>
                <p>Name , properties , description , contacts and Tours</p>
              </div>
              <img src={Icons.arrowRight} />
            </div>
            <div className="contentBox">
              <div className="text">
                <p>Your Properties</p>
                <p>Images , Amenities , Facilities , Descriptions </p>
              </div>
              <img src={Icons.arrowRight} />
            </div>
            <div className="contentBox">
              <div className="text">
                <p>Payment Details</p>
              </div>
              <img src={Icons.arrowRight} />
            </div>
          </div>
          <Link to="/CreateProfileAsALandLord/BasicInfo">
            Start Now <img src={Icons.whiteRight} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileLandlord;
