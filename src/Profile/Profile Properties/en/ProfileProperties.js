import Icons from "../../../icons";
import "../ProfileProperties.css";
import { useState, useEffect } from "react";
import Card from "../../../Card";
import firebase from "../../../firebaseConfig";
import { useParams } from "react-router-dom";

const ProfileProperties = ({ onTotalListingsChange }) => {
  const [value, setValue] = useState("");
  const [listings, setListings] = useState([]);
  const [checkTime, setCheckTime] = useState("allTime");
  const { sellerId } = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (sellerId) {
          const listingsRef = firebase.database().ref("MainListings");
          listingsRef
            .orderByChild("sellerId")
            .equalTo(sellerId)
            .once("value", (snapshot) => {
              const fetchedListings = [];
              snapshot.forEach((childSnapshot) => {
                const listingData = {
                  id: childSnapshot.key,
                  ...childSnapshot.val(),
                };
                fetchedListings.push(listingData);

                const uploadedAt = listingData.uploadedAt;
                if (uploadedAt) {
                  console.log(
                    `Listing ID: ${listingData.id}, Uploaded At: ${uploadedAt}`
                  );
                } else {
                  console.log(
                    `Listing ID: ${listingData.id}, Uploaded At: Not available`
                  );
                }
              });
              setListings(fetchedListings);
              onTotalListingsChange(fetchedListings.length);
            });
        } else {
          console.error("Seller ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [sellerId, onTotalListingsChange]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  console.log(listings);

  const filteredListings = listings.filter((listing) => {
    // Ensure location is included based on the search input
    const locationMatch = listing.location
      .toLowerCase()
      .includes(value.toLowerCase());

    const date = new Date(listing.postedDate);
    const dateNow = new Date();

    const difference = dateNow - date;
    const hours = difference / (1000 * 60 * 60);
    const days = hours / 24;
    const years = days / 365.25; // using 365.25 to account for leap years

    // Determine if the listing matches the time filter criteria
    const timeMatch =
      checkTime === "allTime" ||
      (checkTime === "year" && years <= 1) ||
      (checkTime === "month" && days <= 30) ||
      (checkTime === "week" && days <= 7) ||
      (checkTime === "today" && days <= 1);

    return locationMatch && timeMatch; // Return the logical AND of location and time match conditions
  });

  return (
    <section className="profileProperties">
      <div className="container">
        <h2 className="profileHeading">Your Listings</h2>
        <div className="miniFilter">
          <div className="dateFilter">
            <button
              onClick={() => setCheckTime("allTime")}
              className={checkTime === "allTime" ? "activeSelect" : ""}
            >
              All Time
            </button>
            <button
              onClick={() => setCheckTime("year")}
              className={checkTime === "year" ? "activeSelect" : ""}
            >
              12 Months
            </button>
            <button
              onClick={() => setCheckTime("month")}
              className={checkTime === "month" ? "activeSelect" : ""}
            >
              30 Days
            </button>
            <button
              onClick={() => setCheckTime("week")}
              className={checkTime === "week" ? "activeSelect" : ""}
            >
              7 Days
            </button>
            <button
              onClick={() => setCheckTime("today")}
              className={checkTime === "today" ? "activeSelect" : ""}
            >
              Today
            </button>
          </div>
          <div className="search">
            <img
              src={Icons.searchBlack}
              alt="icon"
              style={{ width: "20px", aspectRatio: "auto" }}
            />
            <input
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Search"
            />
          </div>
        </div>
        <div className="dataCards">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              id={listing.id}
              {...listing}
              searchValue={value}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileProperties;
