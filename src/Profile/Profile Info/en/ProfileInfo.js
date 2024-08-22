import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Icons from "../../../icons";
import "../ProfileInfo.css";
import firebase from "../../../firebaseConfig";

const ProfileInfo = ({ totalListings }) => {
  const { sellerId } = useParams(); // Get the seller ID from the URL
  const [sellerData, setSellerData] = useState(null);
  const [publisherName, setPublisherName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [totalRequests, setTotalRequests] = useState(0); // State to store total requests
  const [totalBookings, setTotalBookings] = useState(0); // State to store total bookings

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const usersRef = firebase.database().ref("users");
        const snapshot = await usersRef.once("value");
        const usersData = snapshot.val();
        let foundSellerProfile = null;

        for (const userId in usersData) {
          const user = usersData[userId];
          if (user.sellerProfile && user.sellerProfile.id === sellerId) {
            foundSellerProfile = user.sellerProfile;
            setSellerData(foundSellerProfile);
            setPublisherName(foundSellerProfile.name);
            setSellerEmail(user.email);
            fetchTotalRequestsAndBookings(userId); // Fetch requests and bookings for the seller
            break;
          }
        }

        if (!foundSellerProfile) {
          console.error("Seller profile not found for the given sellerId.");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    const fetchTotalRequestsAndBookings = async (userId) => {
      try {
        const requestsRef = firebase
          .database()
          .ref(`users/${userId}/sellerProfile/requests`);
        const requestsSnapshot = await requestsRef.once("value");
        const requestsData = requestsSnapshot.val();
        if (requestsData) {
          const totalRequestsCount = Object.keys(requestsData).length;
          setTotalRequests(totalRequestsCount);
        }

        const bookingsRef = firebase
          .database()
          .ref(`users/${userId}/sellerProfile/bookings`);
        const bookingsSnapshot = await bookingsRef.once("value");
        const bookingsData = bookingsSnapshot.val();
        if (bookingsData) {
          const totalBookingsCount = Object.keys(bookingsData).length;
          setTotalBookings(totalBookingsCount);
        }
      } catch (error) {
        console.error("Error fetching total requests and bookings:", error);
      }
    };

    fetchSellerData();
  }, [sellerId]); // Run effect when sellerId changes

  console.log(sellerData);

  const handlePhoneCall = () => {
    if (sellerData && sellerData.numberWithCountryCode) {
      window.location.href = `tel:${sellerData.numberWithCountryCode}`;
    }
  };

  const handleWhatsAppMessage = () => {
    if (sellerData && sellerData.numberWithCountryCode) {
      window.open(
        `https://wa.me/${sellerData.numberWithCountryCode}`,
        "_blank"
      );
    }
  };

  return (
    <section className="profileInfo">
      <div className="container">
        <div className="pfpAndName">
          <img
            src={sellerData && sellerData.profileImageURL}
            alt="profile pic"
          />
          <h2>{sellerData && sellerData.name}</h2>
        </div>
        <div className="contactSeller">
          <button onClick={handlePhoneCall}>
            <img src={Icons.phone} alt="icon" />
            {sellerData && sellerData.phoneNumber}
          </button>
          <button onClick={handleWhatsAppMessage}>
            <img src={Icons.whatsApp} alt="icon" />
            Message
          </button>
        </div>
        <div className="moreUserInfo">
          <div className="moreUserInfoBox">
            <h2>Personal information</h2>
            <div className="userContactInfo">
              <span>
                <img src={Icons.emailBordered} alt="icon" />
                {sellerEmail}
              </span>
              <span>
                <img src={Icons.phoneBordered} alt="icon" />
                {sellerData && sellerData.phoneNumber}
              </span>
              <span>
                <img src={Icons.mapBordered} alt="icon" />
                {sellerData && sellerData.country + ", " + sellerData.state}
              </span>
            </div>
          </div>
          <div className="moreUserInfoBox">
            <img src={Icons.timeBordered} alt="icon" />
            <div className="someMoreInfo">
              <div>
                Total Listings <span>{totalListings}</span>
              </div>
              <div>
                Current Rents <span>{totalBookings || "0"}</span>
              </div>
              <div>
                Total Requests <span>{totalRequests}</span>
              </div>
              <div>
                Total Bookings <span>{totalBookings || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;
