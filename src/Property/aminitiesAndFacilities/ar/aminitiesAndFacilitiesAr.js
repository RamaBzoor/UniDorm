import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";
import "../aminitiesAndFacilities.css";
import Icons from "../../../icons";

const AminitiesAndFacilities = ({ propertyId }) => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleList, setToggleList] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const propertyRef = firebase
          .database()
          .ref(`MainListings/${propertyId}`);
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
      firebase.database().ref(`MainListings/${propertyId}`).off();
    };
  }, [propertyId]);

  if (loading) {
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

  if (!propertyData) {
    return <div>Error: Failed to load property data</div>;
  }

  // Access amenities and facilities from propertyData
  const { Amenities, facilities, transportation } = propertyData;

  return (
    <div className="container">
      <div className="aminitiesContainer">
        <div className="aminitiesHeader">
          <h3>وسائل الراحة</h3>
        </div>
        <div className="aminitiesComponents">
          {Amenities &&
            Amenities.map((aminity, index) => <div key={index}>{aminity}</div>)}
        </div>
      </div>
      <div className="facilitiesContainer">
        <div className="facilitiesHeader">
          <h3>المرافق</h3>
        </div>
        <div className="facilitiesComponents">
          <div className="firstRow">
            <button
              onClick={() => setToggleList(true)}
              className={toggleList ? "active" : ""}
            >
              <img src={Icons.Resturants} alt="الطعام" />
              المطاعم القريبة
            </button>
            <button
              onClick={() => setToggleList(false)}
              className={!toggleList ? "active" : ""}
            >
              <img src={Icons.Transportation} alt="أيقونة" />
              وسائل النقل العامة
            </button>
          </div>
          <div className="list">
            <ul>
              {facilities && transportation && toggleList
                ? facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))
                : transportation.map((transportation, index) => (
                    <li key={index}>{transportation}</li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AminitiesAndFacilities;
