// SizeFilter.js
import React, { useState } from "react";
import Icons from "../../../icons";

const SizeFilterAr = ({
  onMinSizeChange,
  onMaxSizeChange,
  onCheckboxChange,
}) => {
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation
  const [checkboxValues, setCheckboxValues] = useState({
    15: false,
    30: false,
    60: false,
    90: false,
  });

  const handleMinInputChange = (e) => {
    const value = e.target.value;
    setMinInput(value);
    onMinSizeChange(value);
  };

  const handleMaxInputChange = (e) => {
    const value = e.target.value;
    setMaxInput(value);
    onMaxSizeChange(value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedCheckboxValues = { ...checkboxValues, [name]: checked };
    setCheckboxValues(updatedCheckboxValues);
    onCheckboxChange(updatedCheckboxValues);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  return (
    <div className="filterPiece">
      <div style={{ flexDirection: "column" }} className="filterHeading">
        <div
          style={{
            width: "100%",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
          }}
          className="titleAndImage"
        >
          <p>المساحه</p>
          <img
            src={Icons.up}
            className={rotated ? "rotated" : ""}
            onClick={toggleExpand}
            alt="up"
          />
        </div>
        <div
          style={{ marginBottom: "0" }}
          className={`inputsContainer ${expanded ? "expanded" : ""}`}
        >
          <input
            type="number"
            placeholder="الادني"
            value={minInput}
            min="0"
            onChange={handleMinInputChange}
          />
          {/* Input field for max size */}
          <input
            type="number"
            placeholder="الاقصي"
            value={maxInput}
            min="0"
            onChange={handleMaxInputChange}
          />
        </div>
      </div>
      <div className={`checkboxesContainer ${expanded ? "expanded" : ""}`}>
        <label>
          <input
            type="checkbox"
            name="15"
            onChange={handleCheckboxChange}
            checked={checkboxValues["15"]}
          />
          15 متر مربع أو أكثر{" "}
        </label>
        <label>
          <input
            type="checkbox"
            name="30"
            onChange={handleCheckboxChange}
            checked={checkboxValues["30"]}
          />
          30 مترًا مربعًا أو أكثر{" "}
        </label>
        <label>
          <input
            type="checkbox"
            name="60"
            onChange={handleCheckboxChange}
            checked={checkboxValues["60"]}
          />
          60 مترًا مربعًا أو أكثر{" "}
        </label>
        <label>
          <input
            type="checkbox"
            name="90"
            onChange={handleCheckboxChange}
            checked={checkboxValues["90"]}
          />
          90 مترًا مربعًا أو أكثر{" "}
        </label>
      </div>
    </div>
  );
};

export default SizeFilterAr;
