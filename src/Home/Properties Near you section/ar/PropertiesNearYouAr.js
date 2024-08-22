import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "../PropertiesNearYou.css";
import CardAr from "../../../CardAr";
import Icons from "../../../icons"; // Import the Icons object from icons.js

const PropertiesNearYou = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const database = firebase.database();
        const snapshot = await database.ref("MainListings").once("value");
        const data = snapshot.val() || {};
        const filteredListings = Object.values(data).filter(
          (listing) => listing.liked !== undefined
        );
        setListings(filteredListings);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchListings();
  }, []);

  console.log(listings);

  const handleLikeToggle = async (listingIndex) => {
    try {
      const updatedListings = [...listings];
      updatedListings[listingIndex].liked =
        !updatedListings[listingIndex].liked;

      await firebase.database().ref(`MainListings/${listingIndex}`).update({
        liked: updatedListings[listingIndex].liked,
      });

      setListings(updatedListings);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <section className="propertiesNearYou" dir="rtl">
      <div className="container">
        <div className="sectionHeading">
          <h2>سكنات بالقرب منك</h2>
          <Link to="/properties/ar">
            مزيد من السكنات{" "}
            <img
              src={Icons.right}
              alt="icon"
              style={{ marginLeft: "10px", rotate: "180deg" }}
            />
          </Link>
        </div>
        {/* Render a placeholder or message while loading */}
        {loading ? (
          <div className="loader">
            <img src={Icons.Loader} alt="" />
          </div>
        ) : (
          <div className="propertiesList">
            {listings.length > 0 ? (
              listings.map((listing, index) => (
                <CardAr
                  key={index}
                  needHeart={true}
                  likeFunction={() => handleLikeToggle(index)}
                  {...listing}
                />
              ))
            ) : (
              <p>لا يوجد سكنات متوفره</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesNearYou;
