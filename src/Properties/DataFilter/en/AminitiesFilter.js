import React, { useState } from "react";
import Icons from "../../../icons";

const AminitiesFilter = ({ onAmenitiesChange }) => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation

  const handleAmenitiesChange = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((amn) => amn !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updatedAmenities);
    onAmenitiesChange(updatedAmenities);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  return (
    <div className="filterPiece">
      <div className="filterHeading">
        <p>Amenities</p>
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
            onChange={() => handleAmenitiesChange("Air Conditioning")}
          />
          Air Conditioning
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Heating")}
          />
          Heating
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Wifi")}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Bills included")}
          />
          Bills included
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Smart Tv")}
          />
          Smart Tv
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Kitchen")}
          />
          Kitchen
        </label>
      </div>
    </div>
  );
};

export default AminitiesFilter;
