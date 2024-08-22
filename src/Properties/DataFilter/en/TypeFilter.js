import React, { useState } from "react";
import Icons from "../../../icons";

const TypeFilter = ({ onTypeChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [rotated, setRotated] = useState(false);

  const handleTypeChange = (type) => {
    const updatedSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((selectedType) => selectedType !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updatedSelectedTypes);
    onTypeChange(updatedSelectedTypes);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  const filterHeadingText = "Type";

  return (
    <div className="filterPiece">
      <div className="filterHeading">
        <p>{filterHeadingText}</p>
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
            checked={selectedTypes.includes("Studio")}
            onChange={() => handleTypeChange("Studio")}
          />
          Studio
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Department")}
            onChange={() => handleTypeChange("Department")}
          />
          Department
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Shared Room")}
            onChange={() => handleTypeChange("Shared Room")}
          />
          Shared Room
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Private Room")}
            onChange={() => handleTypeChange("Private Room")}
          />
          Private Room
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("Student residence")}
            onChange={() => handleTypeChange("Student residence")}
          />
          Student residence
        </label>
      </div>
    </div>
  );
};

export default TypeFilter;
