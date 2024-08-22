import React, { useState, useEffect, useRef } from "react";
import "../Filter.css";
import PriceFilter from "./PriceFilter";
import TypeFilter from "./TypeFilter";
import LocationFilter from "./LocationFilter";
import AmenitiesFilter from "./AminitiesFilter";
import DateFilter from "./DateFilter";
import SizeFilter from "./SizeFilter";
import RatingFilter from "./RatingFilter";
import { AverageRatingProvider } from "../../../AverageRatingContext";
import Icons from "../../../icons";

const Filter = ({ listings, setFilteredlistings }) => {
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [checkboxFilters, setCheckboxFilters] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const filterContainer = useRef(null);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    if (windowWidth <= 768) {
      filterContainer.current.classList.add("hidden");
    } else {
      filterContainer.current.classList.remove("hidden");
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const handleApplyClick = () => {
    let filteredListings = [...listings];

    // Filter the listings based on price range
    if (minPrice || maxPrice) {
      filteredListings = filteredListings.filter((listing) => {
        const price = parseInt(listing.price.replace("$", ""));
        return (
          (!minPrice || price >= parseInt(minPrice)) &&
          (!maxPrice || price <= parseInt(maxPrice))
        );
      });
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filteredListings = filteredListings.filter((listing) =>
        selectedTypes.includes(listing.type)
      );
    }

    // Filter by selected locations
    if (selectedLocations.length > 0) {
      filteredListings = filteredListings.filter((listing) =>
        selectedLocations.includes(listing.closeTo)
      );
    }

    // Filter by selected amenities
    if (selectedAmenities.length > 0) {
      filteredListings = filteredListings.filter((listing) =>
        selectedAmenities.some(
          (amenity) => listing.Amenities && listing.Amenities.includes(amenity)
        )
      );
    }

    // Filter by selected dates
    if (selectedDates.length > 0) {
      filteredListings = filteredListings.filter((listing) =>
        selectedDates.includes(listing.time)
      );
    }

    // Check if exactly two checkboxes are checked in the size filter
    const checkedCount = Object.values(checkboxFilters).filter(Boolean).length;
    if (checkedCount === 2) {
      // If exactly two checkboxes are checked, don't apply the size filter
      // and keep all listings in the filteredListings array
      setFilteredlistings(filteredListings);
      return;
    }

    // Filter by size range
    filteredListings = filteredListings.filter((listing) => {
      const size = parseInt(listing.area);
      const minSizeValue = minSize ? parseInt(minSize) : 0;
      const maxSizeValue = maxSize ? parseInt(maxSize) : Infinity;
      const meetsMinSize = minSize ? size >= minSizeValue : true;
      const meetsMaxSize = maxSize ? size <= maxSizeValue : true;
      const meetsCheckboxFilters = Object.entries(checkboxFilters).every(
        ([sizeFilter, checked]) => {
          if (checked) {
            return size >= parseInt(sizeFilter);
          }
          return true;
        }
      );
      return meetsMinSize && meetsMaxSize && meetsCheckboxFilters;
    });

    // Filter by selected ratings
    const selectedRatingValues = Object.values(selectedRatings);
    if (selectedRatingValues.some((value) => value)) {
      filteredListings = filteredListings.filter((listing) => {
        const rating = parseFloat(listing.rating);
        return Object.entries(selectedRatings).some(
          ([ratingFilter, checked]) =>
            checked && rating >= parseFloat(ratingFilter)
        );
      });
    }

    // to close the filter when the user presses apply
    if (windowWidth <= 768) {
      filterContainer.current.classList.add("hidden");
    }

    // Update the filtered listings state
    setFilteredlistings(filteredListings);
  };

  const handleToggleFilter = () => {
    filterContainer.current.classList.toggle("hidden");
  };

  return (
    <div className="filter">
      <div className="filterButton">
        <button onClick={handleToggleFilter}>
          <span>Filter</span>
          <img src={Icons.filter} alt="" />
        </button>
      </div>
      <div className="filterContainer" ref={filterContainer}>
        <PriceFilter
          onMinPriceChange={(value) => setMinPrice(value)}
          onMaxPriceChange={(value) => setMaxPrice(value)}
        />
        <TypeFilter
          onTypeChange={(selectedTypes) => setSelectedTypes(selectedTypes)}
        />
        <LocationFilter
          onLocationChange={(selectedLocations) =>
            setSelectedLocations(selectedLocations)
          }
        />
        <AmenitiesFilter
          onAmenitiesChange={(selectedAmenities) =>
            setSelectedAmenities(selectedAmenities)
          }
        />
        <DateFilter
          onDateChange={(selectedDates) => setSelectedDates(selectedDates)}
        />
        <SizeFilter
          onMinSizeChange={(value) => setMinSize(value)}
          onMaxSizeChange={(value) => setMaxSize(value)}
          onCheckboxChange={(filters) => setCheckboxFilters(filters)}
        />
        <RatingFilter
          onRatingChange={(selectedRatings) =>
            setSelectedRatings(selectedRatings)
          }
        />
        <div className="applyButton">
          <button onClick={handleApplyClick}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
