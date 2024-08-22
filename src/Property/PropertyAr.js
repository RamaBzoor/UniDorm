// Property.js (or any other component where you need to use the auth context)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import useAuth
import firebase from "../firebaseConfig"; // Correct the import for Firebase
import InfoSectionAr from "./Info Section/ar/InfoSectionAr";
import AminitiesAr from "./aminitiesAndFacilities/ar/aminitiesAndFacilitiesAr";
import ReviewsAr from "./Reviews/ar/ReviewsAr";
import Icons from "../icons";
import { AverageRatingProvider } from "../AverageRatingContext";
import SimilarPropertiesAr from "./SimilarProperties/ar/similarPropertiesAr";
import RequestATourAr from "./RequestATourForm/ar/RequestATourAr";

const Property = () => {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const propertyRef = firebase.database().ref(`MainListings/${id}`);
        propertyRef.on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPropertyData(data);
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
      firebase.database().ref(`MainListings/${id}`).off();
    };
  }, [id]);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate("/SignUp");
    }
  }, [authLoading, currentUser, navigate]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = firebase
          .database()
          .ref(`MainListings/${id}/reviews`);
        reviewsRef.on("value", (snapshot) => {
          const reviewsData = snapshot.val();
          if (reviewsData) {
            setReviews(Object.values(reviewsData));
          }
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();

    return () => {
      firebase.database().ref(`MainListings/${id}/reviews`).off();
    };
  }, [id]);

  if (loading || authLoading) {
    return (
      <div className="loading-container" style={{ width: "100%" }}>
        <img
          src={Icons.Loader}
          alt="Loading..."
          style={{ margin: "0 auto", height: "300px" }}
        />
      </div>
    );
  }
  return (
    <section className="property" dir="rtl">
      <InfoSectionAr listingId={id} />
      <AminitiesAr propertyId={id} />
      <ReviewsAr reviews={reviews} />
      <SimilarPropertiesAr />
      <RequestATourAr />
    </section>
  );
};

export default Property;
