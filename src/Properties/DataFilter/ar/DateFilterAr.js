import React, { useState } from "react";
import Icons from "../../../icons";

const DateFilterAr = ({ onDateChange }) => {
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
        <p>الوقت</p>
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
          سنه كامله{" "}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Semester")}
          />
          فصل دراسي
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Academic Year")}
          />
          السنة الأكاديمية{" "}
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => handleDateChange("Month-to-Month")}
          />
          من شهر إلى شهر{" "}
        </label>
      </div>
    </div>
  );
};

export default DateFilterAr;
