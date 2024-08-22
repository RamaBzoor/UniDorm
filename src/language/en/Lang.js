import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icons from "../../icons"; // Import the Icons object from icons.js
import "../Lang.css";

const LangAr = ({ container = true }) => {
  const { pathname } = useLocation();
  const langCondition = pathname.includes("/ar");
  const isPropertiesPage = pathname.startsWith("/properties");

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Construct the language toggle link based on the current path
  let toggleLink = langCondition
    ? `${pathname.replace("/ar", "/")}`
    : pathname[pathname.length - 1] === "/"
    ? `${pathname}ar`
    : `${pathname}/ar`;

  return (
    <div className={`${container ? "container" : ""} langs`}>
      <div className="grouping">
        <div className="list">
          <Link
            to={toggleLink} // Use toggleLink instead of conditionally setting to "/ar" or "/"
            onClick={() => setDropdownVisible(false)}
          >
            {langCondition ? "Arabic" : "English"}
          </Link>
          {/* Use icons from the Icons object */}
          <img className="LangSvg" src={Icons.langs} alt="icon" />
          <img
            className={`down ${
              dropdownVisible && (langCondition ? "rotated-ar" : "rotated")
            }`}
            src={Icons.down} // Use the down arrow icon from the Icons object
            alt=""
            onClick={toggleDropdown}
          />
        </div>
        {dropdownVisible && (
          <div className="dropdown">
            <Link
              to={toggleLink}
              style={langCondition ? { color: "var(--primary-100)" } : {}}
            >
              Arabic
            </Link>
            <Link
              to="#"
              style={!langCondition ? { color: "var(--primary-100)" } : {}}
            >
              English
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LangAr;
