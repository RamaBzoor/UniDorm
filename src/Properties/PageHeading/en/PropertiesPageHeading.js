import React from "react";
import "../PropertiesPageHeading.css";

const PropertiesPageHeading = ({ searchValue }) => {
  // Define searchValue as a prop
  return (
    <div className="PropertiesPageHeading">
      <h1>
        Search for <span>{searchValue}</span>
      </h1>
    </div>
  );
};

export default PropertiesPageHeading;
