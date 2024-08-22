import React, { useState, useEffect } from "react";
import RequestATour from "../../RequestATourForm/en/RequestATour";
import Icons from "../../../icons";
import images from "../../../images";
import { Link } from "react-router-dom";
import firebase from "../../../firebaseConfig";
import "../InfoSection.css";
import { useAuth } from "../../../AuthContext";

const InfoSection = ({ listingId, listings, setListings }) => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [opinions, setOpinions] = useState(0);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const propertyRef = firebase
          .database()
          .ref(`MainListings/${listingId}`);
        propertyRef.on("value", async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPropertyData(data);

            if (data["detailed-photos"]) {
              setTotalPhotos(data["detailed-photos"].length);
            }

            // Fetch reviews
            const reviewsRef = firebase
              .database()
              .ref(`MainListings/${listingId}/reviews`);
            const reviewsSnapshot = await reviewsRef.once("value");
            const reviewsData = reviewsSnapshot.val();

            if (reviewsData) {
              const reviewsArray = Object.values(reviewsData);
              // Calculate total rating and count the number of reviews
              let totalRating = 0;
              reviewsArray.forEach((review) => {
                totalRating += review.rating;
              });
              const averageRating = totalRating / reviewsArray.length;
              setRating(averageRating.toFixed(1)); // Round to one decimal place
              setOpinions(reviewsArray.length);
            }

            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching property data:", error);
        setLoading(false);
      }
    };

    fetchPropertyData();

    return () => {
      firebase.database().ref(`MainListings/${listingId}`).off();
    };
  }, [listingId]);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = firebase.database().ref(`users/${userId}`);
      userRef.on("value", (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.likedItems && userData.likedItems[listingId]) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      });
    }
  }, [listingId]);

  const handleRequestTourClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentImageIndex(0);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? propertyData["detailed-photos"].length - 1
        : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === propertyData["detailed-photos"].length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const handleLikeClick = async () => {
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
      setLiked(!liked);
    } catch (error) {}
  };

  useEffect(() => {
    const images = document.querySelectorAll(".images div");
    const lastImageContainer = images[images.length - 1];
    if (lastImageContainer) {
      lastImageContainer.setAttribute("data-count", `+${totalPhotos - 3}`);
    }
  }, [totalPhotos]);

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  const uniqueLoc = new Set(propertyData && propertyData.location.split(" "));

  return (
    <>
      <div
        className="container"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        {propertyData.SellerUID === userId && (
          <>
            <div className="addListingBtnDiv">
              <Link
                to="/settings/alllistings"
                style={{
                  backgroundColor: "transparent",
                  color: "#FF0404",
                  border: "2px solid #FF0404",
                }}
              >
                Cancel
              </Link>
            </div>
            <div className="addListingBtnDiv">
              <Link
                to={`/settings/${listingId}/editListing`}
                style={{ backgroundColor: "var(--primary-100)" }}
              >
                Edit Listing
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="container">
        <h1 className="paymentNPropertyHeading">
          Home / Properties /{" "}
          <span>{propertyData && propertyData.location}</span>
        </h1>
        <div className="mediaBtnsRow">
          <div className="mediaBtn">
            <button onClick={openModal}>
              <img src={Icons.cameraPin} alt="icon" /> Media
            </button>
            <Link
              to={`https://www.google.com/maps/search/?api=1&query=${[
                ...uniqueLoc,
              ].join("+")}`}
              target="_blank"
            >
              <img src={Icons.mapPin} alt="icon" /> Map
            </Link>
          </div>
          <button onClick={handleLikeClick}>
            <img
              src={liked ? Icons.liked : Icons.like}
              alt="icon"
              height={56}
              width={56}
              style={{ cursor: "pointer" }}
            />
          </button>
        </div>
        <div className="images">
          {propertyData &&
            propertyData["detailed-photos"] &&
            propertyData["detailed-photos"].slice(0, 3).map((photo, index) => (
              <div
                key={index}
                style={{ cursor: "pointer" }}
                onClick={openModal}
              >
                <img src={photo} alt={`property image ${index}`} />
              </div>
            ))}
        </div>
        <div className="information">
          <div className="propertyInfo">
            <div className="firstInfoRow">
              <h2>{propertyData && propertyData.location}</h2>
            </div>
            <div className="secondInfoRow">
              <div className="infoReviews">
                <div className="stars">
                  <img src={Icons.star} alt="icon" height={18} />
                  {rating} {/* Update here */}
                </div>
                <span>{opinions} Review</span> {/* Update here */}
              </div>
              <span className="owner">
                Listed By{" "}
                <Link to={`/profile/${propertyData && propertyData.sellerId}`}>
                  {propertyData && propertyData.publisher}
                </Link>
              </span>
            </div>
            <div className="thirdInfoRow">
              <span>{propertyData && propertyData.type}</span>
              <span>{propertyData && propertyData.time}</span>
              <span className="wowARedOne">
                {propertyData && propertyData.info}
              </span>
            </div>
            <div className="fourthInfoRow">
              <div className="infoPropertyPage">
                <div className="infoPropertyPageImg">
                  <img src={Icons.bed} alt="icon" />
                </div>
                <p>{propertyData && propertyData.beds}</p>
              </div>
              <div className="infoPropertyPage">
                <div className="infoPropertyPageImg">
                  <img src={Icons.bath} alt="icon" />
                </div>
                <p>{propertyData && propertyData.bathrooms}</p>
              </div>
              <div className="infoPropertyPage">
                <div className="infoPropertyPageImg">
                  <img src={Icons.area} alt="icon" />
                </div>
                <p>{propertyData && propertyData.area} M²</p>
              </div>
            </div>
            <div className="describtionContainer">
              <h1>Describition</h1>
              <p>{propertyData.description}</p>
            </div>
          </div>
          <div className="propertyPrice">
            <span className="price">
              <span>{propertyData && propertyData.price}$</span>/month
            </span>
            <button onClick={handleRequestTourClick}>Request a tour </button>
            <Link to={`/booknow/${listingId}`}>Book Now</Link>
          </div>
        </div>
        {isFormVisible && (
          <RequestATour
            listingId={listingId} // Pass the listingId as a prop
            isFormVisible={isFormVisible}
            onClose={handleCloseForm}
          />
        )}
        {showModal && (
          <Modal
            photo={
              propertyData && propertyData["detailed-photos"][currentImageIndex]
            }
            onClose={closeModal}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ photo, onClose, goToPrevious, goToNext }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-images">
          {photo ? (
            <>
              <div className="img-container">
                <img src={photo} alt="property" />
              </div>
              <div className="close-container" onClick={onClose}>
                <img src={Icons.X_blue} alt="Close" className="close-icon" />
              </div>
              <div className="navigation-arrows">
                <button onClick={goToPrevious}>
                  <img src={Icons.leftArrowGrey} alt="Previous" />
                </button>
                <button onClick={goToNext}>
                  <img src={Icons.rightArrowGrey} alt="Next" />
                </button>
              </div>
            </>
          ) : (
            <div className="no-image"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
