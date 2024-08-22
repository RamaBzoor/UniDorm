import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import firebase from "./firebaseConfig";

const PrivateRoute = ({ element: Component }) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firebase.database().ref(`users/${userId}/verified`);
        try {
          const snapshot = await userRef.once("value");
          const verified = snapshot.val();
          setIsVerified(verified === true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error if necessary
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching user data
  }

  return currentUser && isVerified ? Component : <Navigate to="/signin" />;
};

export default PrivateRoute;
