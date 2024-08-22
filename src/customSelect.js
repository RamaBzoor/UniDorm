import React, { useState, useEffect } from "react";
import Icons from "./icons";

const CustomSelect = ({
  options,
  selectedOption: propSelectedOption,
  setSelectedOption,
}) => {
  const [selectedOption, setSelectedOptionState] = useState(propSelectedOption);
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  console.log(typeof options[0] === "object");

  const countriesArr = [];
  options.map((e) => countriesArr.push(e.name));

  const generateOptionList = () => {
    if (typeof options[0] === "object") {
      return countriesArr.map((option, index) => (
        <p key={index} onClick={() => selectOption(option)}>
          {option}
        </p>
      ));
    } else {
      return options.map((option, index) => (
        <p key={index} onClick={() => selectOption(option)}>
          {option}
        </p>
      ));
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);
  };

  const selectOption = (option) => {
    setSelectedOptionState(option);
    setSelectedOption(option); // Update parent component's state
    setIsOpen(false);
  };

  useEffect(() => {
    // Update internal state if prop changes
    setSelectedOptionState(propSelectedOption);
  }, [propSelectedOption]);

  return (
    <div className="customSelect" onClick={toggleMenu}>
      <div className="customSelectText">
        <p>{selectedOption}</p>
      </div>
      <img
        src={Icons.down}
        alt="down arrow"
        className={isRotated ? "rotated" : ""}
      />
      {isOpen && <div className="customSelectMenu">{generateOptionList()}</div>}
    </div>
  );
};

export default CustomSelect;
