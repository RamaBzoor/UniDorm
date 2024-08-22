import React from "react";
import { Link, useLocation } from "react-router-dom";
import Images from "./images";
import Icons from "./icons";

const Error = () => {
  return (
    <div className="error404Container">
      <img src={Images.Error} />
      <div className="errorText">
        <h3>Oops! Page not found</h3>
        <p>
          The page you are looking for might have been removed
          <br />
          or temporarily unavailable.
        </p>
      </div>
      <Link to="/">
        Back Home
        <img src={Icons.whiteRight} />
      </Link>
    </div>
  );
};

export default Error;
