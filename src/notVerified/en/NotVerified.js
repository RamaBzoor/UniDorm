import React, { useEffect, useState } from "react";
import "../NotVerified.css";
import { useAuth } from "../../AuthContext";
import firebase from "../../firebaseConfig";

const NotVerified = () => {
  const { currentUser } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.database().ref(`users/${userId}/verified`);
      userRef.once("value", (snapshot) => {
        const verified = snapshot.val();
        setIsVerified(verified === true); // Set isVerified to true if the value is explicitly true
        setLoading(false); // Set loading to false once verification status is fetched
      });
    } else {
      setLoading(false); // Set loading to false if there's no current user
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching verification status
  }

  return !isVerified && currentUser ? (
    <div className="notVerifiedNav">
      <p>please check your email for verification to use Unidorm Properly</p>
    </div>
  ) : null; // Render nothing if the user is verified
};

export default NotVerified;
