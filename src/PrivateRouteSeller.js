import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import firebase from "./firebaseConfig";
import { useAuth } from "./AuthContext";

const PrivateRouteSeller = ({ element: Component }) => {
  const { currentUser } = useAuth();
  const [isSeller, setIsSeller] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    if (currentUser) {
      const userId = currentUser.uid;
      const isSellerRef = firebase
        .database()
        .ref(`users/${userId}/isCurrentlySeller`);

      isSellerRef.on("value", (snapshot) => {
        if (isMounted) {
          setIsSeller(snapshot.val());
          setLoading(false);
        }
      });

      // Cleanup subscription on unmount
      return () => {
        isMounted = false;
        isSellerRef.off();
      };
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return isSeller && isVerified && currentUser ? (
    Component
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRouteSeller;
