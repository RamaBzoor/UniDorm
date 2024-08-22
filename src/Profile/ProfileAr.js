import React, { useState, useEffect } from "react";
import ProfileInfoAr from "./Profile Info/ar/ProfileInfoAr";
import ProfilePropertiesAr from "./Profile Properties/ar/ProfilePropertiesAr";

const Profile = () => {
  const [userId, setUserId] = useState(""); // Define userId state

  // Fetch userId from somewhere, such as from authentication
  useEffect(() => {
    const fetchUserId = () => {
      // Fetch userId from authentication or any other source
      const userId = "123456"; // Example userId
      setUserId(userId);
    };

    fetchUserId();
  }, []);

  const [totalListings, setTotalListings] = useState(0);

  const handleTotalListingsChange = (total) => {
    setTotalListings(total);
  };

  return (
    <>
      {/* Pass userId to ProfileInfo component */}
      <ProfileInfoAr userId={userId} totalListings={totalListings} />
      <ProfilePropertiesAr onTotalListingsChange={handleTotalListingsChange} />
    </>
  );
};

export default Profile;
