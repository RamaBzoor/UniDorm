import React, { useState } from "react";
import Icons from "../../../icons";

const PriceFilterAr = ({ onMinPriceChange, onMaxPriceChange }) => {
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation

  const handleMinInputChange = (e) => {
    const value = e.target.value;
    setMinInput(value);
    onMinPriceChange(value);
  };

  const handleMaxInputChange = (e) => {
    const value = e.target.value;
    setMaxInput(value);
    onMaxPriceChange(value);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  const filterHeadingText = "السعر";

  return (
    <div className="filterPiece">
      <div className="filterHeading">
        <p>
          {filterHeadingText}
          <div>الدولار الامريكي</div>
        </p>
        <img
          src={Icons.up}
          alt="up"
          className={rotated ? "rotated" : ""} // Add rotated class if rotated state is true
          onClick={toggleExpand}
        />
      </div>
      <div className={`inputsContainer ${expanded ? "expanded" : ""}`}>
        <input
          min={0}
          type="number"
          placeholder="الادني"
          value={minInput}
          onChange={handleMinInputChange}
        ></input>
        <input
          min={0}
          type="number"
          placeholder="الاقصي"
          value={maxInput}
          onChange={handleMaxInputChange}
        ></input>
      </div>
    </div>
  );
};

export default PriceFilterAr;
