import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";
import { Link } from "react-router-dom";
import Icons from "../../../icons";
import CardAr from "../../../CardAr";
import "../similarProperties.css";

const SimilarProperties = () => {
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const propertiesPerPage = 4;

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        const mainListingsRef = firebase.database().ref("MainListings");
        mainListingsRef.on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert the object of objects to an array of objects
            const propertiesArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setSimilarProperties(propertiesArray);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching similar properties:", error);
        setLoading(false);
      }
    };

    fetchSimilarProperties();

    return () => {
      firebase.database().ref("MainListings").off();
    };
  }, []);

  const handleLikeToggle = async (listingIndex) => {
    try {
      const updatedListings = [...similarProperties];
      updatedListings[listingIndex].liked =
        !updatedListings[listingIndex].liked;

      await firebase.database().ref(`HomePageListings/${listingIndex}`).update({
        liked: updatedListings[listingIndex].liked,
      });

      setSimilarProperties(updatedListings);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const totalPages = Math.ceil(similarProperties.length / propertiesPerPage);

  const handleClickNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handleClickPrev = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const startIndex = currentPage * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = similarProperties.slice(startIndex, endIndex);

  return (
    <div className="container">
      <div className="similarPropertiesContainer">
        <div className="similarPropertiesHeading">
          <p>عقارات مشابهة</p>
        </div>
        <div className="similarPropertiesContent">
          <button
            onClick={handleClickPrev}
            style={{ left: "calc(50% - 30px)" }}
          >
            <img src={Icons.leftArrow} alt="السابق" />
          </button>
          {currentProperties.map((property, index) => (
            <CardAr
              needHeart={true}
              key={property.id}
              likeFunction={() => handleLikeToggle(index)}
              {...property}
            />
          ))}
          <button
            onClick={handleClickNext}
            style={{ left: "calc(50% + 30px)" }}
          >
            <img src={Icons.rightArrow} alt="التالي" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarProperties;
