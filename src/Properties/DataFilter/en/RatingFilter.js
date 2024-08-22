// RatingFilter.js
import React, { useState, useEffect } from "react";
import { useAverageRating } from "../../../AverageRatingContext";
import Icons from "../../../icons";

const RatingFilter = ({ onRatingChange }) => {
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const [rotated, setRotated] = useState(false); // State to manage rotation
  const { averageRating } = useAverageRating();

  const [selectedRatings, setSelectedRatings] = useState({
    5: false,
    4: false,
    3: false,
    2: false,
    1: false,
  });

  const toggleExpand = () => {
    setExpanded(!expanded);
    setRotated(!rotated);
  };

  const handleCheckboxChange = (rating) => {
    const updatedRatings = {
      ...selectedRatings,
      [rating]: !selectedRatings[rating],
    };
    setSelectedRatings(updatedRatings);
    onRatingChange(updatedRatings);
  };

  return (
    <div className="filterPiece">
      <div className="filterHeading">
        <p>Rating</p>
        <img
          src={Icons.up}
          className={rotated ? "rotated" : ""}
          onClick={toggleExpand}
          alt="up"
        />
      </div>
      <div className={`checkboxesContainer ${expanded ? "expanded" : ""}`}>
        <label>
          <input
            type="checkbox"
            checked={selectedRatings[5]}
            onChange={() => handleCheckboxChange(5)}
          />
          <div style={{ display: "flex" }} className="stars">
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
          </div>
          5.0
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedRatings[4]}
            onChange={() => handleCheckboxChange(4)}
          />
          <div style={{ display: "flex" }} className="stars">
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
          </div>
          4.0 & up
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedRatings[3]}
            onChange={() => handleCheckboxChange(3)}
          />
          <div style={{ display: "flex" }} className="stars">
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
          </div>{" "}
          3.0 & up
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedRatings[2]}
            onChange={() => handleCheckboxChange(2)}
          />
          <div style={{ display: "flex" }} className="stars">
            <img src={Icons.star} alt="star" />
            <img src={Icons.star} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
          </div>
          2.0 & up
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedRatings[1]}
            onChange={() => handleCheckboxChange(1)}
          />
          <div style={{ display: "flex" }} className="stars">
            <img src={Icons.star} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
            <img src={Icons.starEmpty} alt="star" />
          </div>{" "}
          1.0 & up
        </label>
      </div>
    </div>
  );
};

export default RatingFilter;
