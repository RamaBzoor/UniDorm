import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../../icons"; // Import the Icons object from icons.js

const Form = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState(""); // State to store the input value
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (event) => {
    setInputValue(event.target.value); // Update the input value as the user types
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Check if the input value is empty
    if (inputValue.trim() !== "") {
      // If the input value is not empty, proceed with the search
      // Pass the input value to the onSubmit function
      onSubmit(inputValue);

      // Append the search value to the URL query parameter and navigate to the properties page
      navigate(`/properties/?search=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="inputField"
        placeholder="Search by location, owner"
        value={inputValue} // Set the input value from state
        onChange={handleChange} // Handle input changes
        autoComplete="off" // Disable browser autocomplete
      />
      <button type="submit">
        Search <img src={Icons.searchIcon} alt="search icon" />
      </button>
    </form>
  );
};

export default Form;
