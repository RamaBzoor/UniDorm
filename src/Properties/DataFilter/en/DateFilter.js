import React, { useState } from "react";
import Icons from "../../../icons";

const DateFilter = ({ onDateChange }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation

  const handleDateChange = (date) => {
    const updatedSelectedDates = selectedDates.includes(date)
      ? selectedDates.filter((selectedDate) => selectedDate !== date)
      : [...selectedDates, date];
    setSelectedDates(updatedSelectedDates);
    // Invoke the callback to pass selected dates to parent component
    onDateChange(updatedSelectedDates);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  return (
    <div className={`filterPiece ${expanded ? "expanded" : ""}`}>
      <div className="filterHeading">
        <p>Date</p>
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
            onChange={() => handleDateChange("Full Year")}
          />
          Full Year
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Semester")}
          />
          Semester
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Academic Year")}
          />
          Academic Year
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Month-to-Month")}
          />
          Month-to-Month
        </label>
      </div>
    </div>
  );
};

export default DateFilter;
