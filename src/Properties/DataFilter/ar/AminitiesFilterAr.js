import React, { useState } from "react";
import Icons from "../../../icons";

const AmenitiesFilterAr = ({ onAmenitiesChange }) => {
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
        <p>وسائل الراحة</p>
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
          تكييف الهواء
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Heating")}
          />
          التدفئه
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Wifi")}
          />
          الانترنت
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Bills included")}
          />
          الفواتير متضمنه
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Smart Tv")}
          />
          التلفاز الذكي
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleAmenitiesChange("Kitchen")}
          />
          مطبخ
        </label>
      </div>
    </div>
  );
};

export default AmenitiesFilterAr;
