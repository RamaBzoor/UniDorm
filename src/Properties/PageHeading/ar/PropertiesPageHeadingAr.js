import React from "react";
import "../PropertiesPageHeading.css";

const PropertiesPageHeading = ({ searchValue }) => {
  // Define searchValue as a prop
  return (
    <div className="PropertiesPageHeading">
      <h1>
        نتائج البحث عن <span>{searchValue}</span>
      </h1>
    </div>
  );
};

export default PropertiesPageHeading;
