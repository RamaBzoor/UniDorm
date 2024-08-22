import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import firebase from "../../firebaseConfig";
import "../DashboardIndex.css";
import "./Wishlist.css";
import DashboardMenu from "../DashboardMenu";
import Card from "../../Card";
import Icons from "../../icons";

const Wishlist = () => {
  const { currentUser } = useAuth();
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistData = async () => {
      if (currentUser) {
        try {
          const userLikesRef = firebase
            .database()
            .ref(`users/${currentUser.uid}/likedItems`);
          const snapshot = await userLikesRef.once("value");
          const likedData = snapshot.val();

          if (likedData) {
            const likedIds = Object.keys(likedData).filter(
              (key) => likedData[key] === true
            );
            console.log("Liked IDs:", likedIds);

            const promises = likedIds.map((id) =>
              firebase
                .database()
                .ref(`MainListings/${id}`)
                .once("value")
                .then((snap) => {
                  const data = snap.val();
                  console.log(`Data for ID ${id}:`, data);
                  return { id, ...data };
                })
            );

            const results = await Promise.all(promises);
            console.log("Fetched wishlist data:", results);
            setWishlistData(results);
          } else {
            setWishlistData([]);
          }
        } catch (error) {
          console.error("Error fetching wishlist data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlistData();
  }, [currentUser]);

  const handleRemoveAll = () => {
    if (currentUser) {
      const userLikesRef = firebase
        .database()
        .ref(`users/${currentUser.uid}/likedItems`);
      userLikesRef.remove().then(() => {
        setWishlistData([]);
      });
    }
  };

  const handleRemoveItem = (id) => {
    if (currentUser) {
      const userLikeRef = firebase
        .database()
        .ref(`users/${currentUser.uid}/likedItems/${id}`);
      userLikeRef.remove().then(() => {
        setWishlistData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="dashboard wishlist">
      <div className="container">
        <DashboardMenu />
        <div className="content">
          <div className="dashboardSectionHeading">
            <h2>Your Wishlist</h2>
            <button onClick={handleRemoveAll}>
              <img src={Icons.delete} alt="icon" />
              Remove All
            </button>
          </div>
          <div className="wishlistData">
            {wishlistData.map((listing) => {
              console.log("Property Object:", listing); // Log the property object here
              return (
                <div className="imACardContainer" key={listing.id}>
                  <button
                    className="delete"
                    onClick={() => handleRemoveItem(listing.id)}
                  >
                    <img src={Icons.X} alt="icon" />
                  </button>
                  <Card {...listing} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
