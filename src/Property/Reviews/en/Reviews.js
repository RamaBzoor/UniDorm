import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";
import Icons from "../../../icons";
import { useAverageRating } from "../../../AverageRatingContext";
import "../Reviews.css";
import { useLocation } from "react-router-dom";

const Reviews = () => {
  const location = useLocation();
  const { averageRating, setAverageRating } = useAverageRating();

  const pathname = location.pathname;
  const listingId = pathname.substring(pathname.lastIndexOf("/") + 1);

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = firebase
          .database()
          .ref(`MainListings/${listingId}/reviews`);
        reviewsRef.on("value", async (snapshot) => {
          const reviewsData = snapshot.val();
          if (reviewsData) {
            const reviewsArray = Object.values(reviewsData);
            const updatedReviews = await Promise.all(
              reviewsArray.map(async (review) => {
                const userSnapshot = await firebase
                  .database()
                  .ref(`users/${review.authorId}/pfp`)
                  .once("value");
                const pfp = userSnapshot.val();
                return { ...review, pfp };
              })
            );
            setReviews(updatedReviews);
          }
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();

    return () => {
      firebase.database().ref(`MainListings/${listingId}/reviews`).off();
    };
  }, [listingId]);

  useEffect(() => {
    const averageRatingRef = firebase
      .database()
      .ref(`MainListings/${listingId}/averageRating`);
    averageRatingRef.on("value", (snapshot) => {
      const newAverageRating = snapshot.val();
      if (newAverageRating !== null) {
        setAverageRating(newAverageRating);
      }
    });

    return () => {
      averageRatingRef.off();
    };
  }, [listingId, setAverageRating]);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const userId = user ? user.uid : null;
    if (userId) {
      const userRef = firebase.database().ref(`users/${userId}/pfp`);
      userRef.on("value", (snapshot) => {
        const newPfp = snapshot.val();
        if (newPfp) {
          // Update the profile picture in existing reviews
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.authorId === userId ? { ...review, pfp: newPfp } : review
            )
          );
        }
      });

      return () => {
        userRef.off();
      };
    }
  }, []);

  const getUserInfo = async (userId) => {
    try {
      const userSnapshot = await firebase
        .database()
        .ref(`users/${userId}`)
        .once("value");
      const userData = userSnapshot.val();
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userInfo = await getUserInfo(user.uid);
        const newReviewRef = firebase
          .database()
          .ref(`MainListings/${listingId}/reviews`)
          .push();
        await newReviewRef.set({
          pfp: userInfo ? userInfo.pfp : "",
          author: userInfo ? userInfo.name : "",
          authorId: user.uid, // Add authorId to identify the author
          rating: averageRating,
          time: new Date().getTime(),
          content: reviewText,
        });
        setReviewText("");

        const newAverageRating = calculateNewAverageRating(
          averageRating,
          reviews.length,
          5
        );
        setAverageRating(newAverageRating);

        const listingRef = firebase.database().ref(`MainListings/${listingId}`);
        await listingRef.update({
          rating: newAverageRating,
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const calculateNewAverageRating = (
    currentRating,
    numberOfReviews,
    newReviewRating
  ) => {
    const newTotalRating = currentRating * numberOfReviews + newReviewRating;
    const newNumberOfReviews = numberOfReviews + 1;
    const newAverageRating = newTotalRating / newNumberOfReviews;
    return newAverageRating;
  };

  const formatTime = (time) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedSeconds = currentTime - Math.floor(time / 1000);

    if (elapsedSeconds < 60) {
      return "just now";
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (elapsedSeconds < 2592000) {
      const days = Math.floor(elapsedSeconds / 86400);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (elapsedSeconds < 31536000) {
      const months = Math.floor(elapsedSeconds / 2592000);
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.floor(elapsedSeconds / 31536000);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  };

  return (
    <div className="container">
      <div className="reviewsContainer">
        <div className="reviewsHeader">
          <h3>
            Reviews <span> ({reviews.length})</span>
          </h3>
        </div>
        <div className="reviews">
          <div className="reviewInput">
            <form onSubmit={handleReviewSubmit}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "100%",
                  gap: "16px",
                }}
              >
                <input
                  placeholder="Add your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{ maxWidth: "calc(75% - 16px)" }}
                />
                <input
                  placeholder="Rating / 5"
                  value={averageRating}
                  type="number"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value <= 5 && value >= 0) {
                      setAverageRating(value);
                    } else if (value > 5) {
                      setAverageRating(5);
                    } else if (isNaN(value)) {
                      setAverageRating("");
                    }
                  }}
                  min="0"
                  max="5"
                  style={{ maxWidth: "25%" }}
                />
              </div>
              <button type="submit">Add Review</button>
            </form>
          </div>
          {reviews.map((review, index) => (
            <div className="reviewsBox" key={index}>
              <div className="firstRow">
                <div className="profileAndName">
                  <img src={review.pfp} alt="pfp" />
                  <div className="nameAndRate">
                    <p>{review.author}</p>
                    <div className="stars">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <img
                          src={Icons.star}
                          key={index}
                          alt={`Star ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="Time">
                  <p>{formatTime(review.time)}</p>
                </div>
              </div>
              <div className="secondRow">{review.content}</div>
            </div>
          ))}
        </div>
        <div className="seeMore">
          <button>See More!</button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
