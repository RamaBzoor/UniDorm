import React, { useState } from "react";
import Icons from "../../../icons";

const LocationFilterAr = ({ onLocationChange }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation

  const handleLocationChange = (location) => {
    const updatedLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((loc) => loc !== location)
      : [...selectedLocations, location];
    setSelectedLocations(updatedLocations);
    onLocationChange(updatedLocations);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  return (
    <div className="filterPiece">
      <div className="filterHeading">
        <p>الموقع</p>
        <img
          src={Icons.up}
          alt="up"
          className={rotated ? "rotated" : ""}
          onClick={toggleExpand}
        />
      </div>
      <div className={`checkboxesContainer ${expanded ? "expanded" : ""}`}>
        <label>
          <input
            type="checkbox"
            onChange={() => handleLocationChange("Close to University")}
          />
          بالقرب من الجامعه
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleLocationChange("Neighborhood")}
          />
          حيّ{" "}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleLocationChange("City")}
          />
          مدينه
        </label>
      </div>
    </div>
  );
};

export default LocationFilterAr;
