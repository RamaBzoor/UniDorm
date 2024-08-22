import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";
import { Link } from "react-router-dom";
import Card from "../../../Card";
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
    <section className="propertiesNearYou">
      <div className="container">
        <div className="sectionHeading">
          <h2>Properties near you</h2>
          <Link to="/properties/">
            More Properties <img src={Icons.right} alt="icon" />
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
                <Card
                  key={index}
                  needHeart={true}
                  likeFunction={() => handleLikeToggle(index)}
                  {...listing}
                />
              ))
            ) : (
              <p>No properties available</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesNearYou;
