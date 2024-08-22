import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";
import CardAr from "../../../CardAr";
import PropertiesPageHeadingAr from "../../PageHeading/ar/PropertiesPageHeadingAr";
import "../PropertiesData.css";
import { useLocation } from "react-router";
import { useSearchParams } from "react-router-dom";
import Icons from "../../../icons";
import FilterAr from "../../DataFilter/ar/FilterAr";
import { AverageRatingProvider } from "../../../AverageRatingContext";

const PropertiesData = () => {
  const [originalListings, setOriginalListings] = useState([]); // Store original listings data
  const [listings, setListings] = useState([]); // Store filtered listings data
  const [loading, setLoading] = useState(true);
  const [showNoResults, setShowNoResults] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const searchValue = searchParams.get("search") || "";
  const dataActiveNum = +searchParams.get("data") || 1;

  // Define the maximum number of listings per page
  const maxListingsPerPage = 12;

  // Calculate the total number of pages
  const totalPages = Math.ceil(listings.length / maxListingsPerPage);

  // Generate an array of data numbers based on the total pages
  const dataNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const setActiveButton = (activeNum) => {
    const activeButton = document.querySelector(
      `[data-activeNum="${activeNum}"]`
    );

    if (activeButton === null) return;

    const activeButtons = document.querySelectorAll("[data-activeNum]");

    [...activeButtons].map((ele) => {
      ele.removeAttribute("data-activeData");
    });

    activeButton.setAttribute("data-activeData", "true");
  };

  const goToDataNumber = (dataNum) => {
    setSearchParams({ data: dataNum });
  };

  const handleLikeToggle = async (listingId) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const userId = user.uid;
      const userRef = firebase.database().ref(`users/${userId}`);
      const userSnapshot = await userRef.once("value");
      const userData = userSnapshot.val();

      if (!userData) {
        console.log("User data not found");
        return;
      }

      const likedItems = userData.likedItems || {};

      if (likedItems[listingId]) {
        delete likedItems[listingId];
      } else {
        likedItems[listingId] = true;
      }

      await userRef.update({ likedItems });

      const updatedListings = listings.map((listing) => {
        if (listing.id === listingId) {
          return {
            ...listing,
            liked: !!likedItems[listingId],
          };
        }
        return listing;
      });

      setListings(updatedListings);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  useEffect(() => {
    const fetchListings = () => {
      try {
        const databaseRef = firebase.database().ref("MainListings");
        databaseRef.on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const listingsData = Object.values(data).map((listing) => ({
              id: listing.id,
              ...listing,
            }));
            setOriginalListings(listingsData); // Save original listings
            setListings(listingsData); // Set both original and filtered listings initially
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching listings: ", error);
        setLoading(false);
      }
    };

    fetchListings();

    return () => firebase.database().ref("MainListings").off();
  }, []);

  useEffect(() => {
    const filteredListings = originalListings.filter((listing) => {
      // Check if the location or description includes the search value
      const locationMatches =
        listing.location &&
        listing.location.toLowerCase().includes(searchValue.toLowerCase());
      const descriptionMatches =
        listing.description &&
        listing.description.toLowerCase().includes(searchValue.toLowerCase());
      return locationMatches || descriptionMatches;
    });

    setListings(filteredListings);
    setShowNoResults(filteredListings.length === 0);
  }, [originalListings, searchValue]);

  useEffect(() => {
    if (searchParams.get("search") !== null) {
      newSearchParams.set("data", "1");
      setSearchParams(newSearchParams);
    }
  }, []);

  setActiveButton(dataActiveNum);

  // Calculate the index range of listings to display on the current page
  const startIndex = (dataActiveNum - 1) * maxListingsPerPage;
  const endIndex = Math.min(startIndex + maxListingsPerPage, listings.length);

  // Slice the listings array to get the listings for the current page
  const listingsForPage = listings.slice(startIndex, endIndex);

  return (
    <div className="content-wrapper">
      <div className="container">
        {loading && (
          <div className="loading-container" style={{ width: "100%" }}>
            <img
              src={Icons.Loader}
              alt="Loading..."
              style={{ margin: "0 auto", height: "300px" }}
            />
          </div>
        )}

        {!loading && (
          <>
            <div style={{ width: "100%" }}>
              <div className="result-count">
                <span>{listings.length}</span>{" "}
                {listings.length === 1 ? "نتيجة" : "النتائج"}
              </div>

              <div style={{ display: "flex" }}>
                <FilterAr
                  listings={originalListings}
                  setFilteredlistings={setListings}
                />
                <div className="data-container">
                  <div className="search-value">
                    {searchValue && (
                      <PropertiesPageHeadingAr searchValue={searchValue} />
                    )}
                  </div>
                  {listingsForPage.map((listing, index) => (
                    <CardAr
                      key={index}
                      id={listing.id}
                      needHeart={true}
                      likeFunction={() => handleLikeToggle(listing.id)}
                      {...listing}
                    />
                  ))}

                  <div className="dataNumbers">
                    <button
                      onClick={() => {
                        if (dataActiveNum >= dataNumbers[0] + 1) {
                          goToDataNumber(dataActiveNum - 1);
                        }
                      }}
                    >
                      <img src={Icons.arrowRight} alt="icon" />
                    </button>
                    {dataNumbers.map((dataNum, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          goToDataNumber(dataNum);
                        }}
                        data-activeNum={dataNum}
                      >
                        {dataNum}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        if (
                          dataActiveNum <=
                          dataNumbers[dataNumbers.length - 1] - 1
                        ) {
                          goToDataNumber(dataActiveNum + 1);
                        }
                      }}
                    >
                      <img
                        style={{ rotate: "-180deg" }}
                        src={Icons.arrowRight}
                        alt="icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesData;
