import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "./icons";
import firebase from "./firebaseConfig";

const Card = ({
  id,
  photo,
  needHeart,
  location,
  opinions,
  time,
  price,
  info,
  beds,
  bathrooms,
  area,
  deleteNEdit = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [totalOpinions, setTotalOpinions] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = firebase.database().ref(`users/${userId}`);
      userRef.on("value", (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.likedItems && userData.likedItems[id]) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      });
    }
  }, [id]);

  const handleLikeToggle = () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      navigate("/signin");
      return;
    }

    const userId = user.uid;
    const userRef = firebase.database().ref(`users/${userId}`);
    userRef.transaction((userData) => {
      if (!userData) return userData;

      const updatedLikedItems = { ...(userData.likedItems || {}) };

      if (updatedLikedItems[id]) {
        delete updatedLikedItems[id];
      } else {
        updatedLikedItems[id] = true;
      }

      return { ...userData, likedItems: updatedLikedItems };
    });
  };

  const deleteListing = async () => {
    try {
      await firebase.database().ref(`isMainLtings/${id}`).remove();
      // Optionally, you can also remove this listing from the user's liked items
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = firebase
          .database()
          .ref(`users/${userId}/likedItems/${id}`);
        userRef.remove();
      }
      // Optionally, refresh the listings in the parent component or navigate
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="propertyItem">
      <div className="image">
        <img src={photo} alt="property image" />
        {needHeart && (
          <img
            src={liked ? Icons.liked : Icons.like}
            alt="like"
            className="heartIcon"
            onClick={handleLikeToggle}
            style={{
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        )}
      </div>
      <div className="info">
        <div className="firstRow">
          <h3
            style={{
              whiteSpace: "nowrap",
              color: "#000",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            {location}
          </h3>
        </div>
        <div className="secondRow">
          <p
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            <img
              src={Icons.timeCircle}
              style={{ width: "16px", height: "16px" }}
              alt=""
            />
            {time}
          </p>
          <p
            style={{
              color: "#8b8d97",
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            <span
              style={{
                color: "var(--Primary-100, #5570f1)",
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "24px",
              }}
            >
              {price}$
            </span>
            / Month
          </p>
          <p
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            <img
              src={Icons.info}
              style={{ width: "16px", height: "16px" }}
              alt=""
            />
            {info}
          </p>
        </div>
        <div className="thirdRow">
          <p
            style={{
              color: "#000",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            {beds && (
              <>
                <img
                  src={Icons.bed}
                  style={{ width: "18.462px", height: "18.824px" }}
                  alt=""
                />
                {beds}
              </>
            )}
          </p>
          <p
            style={{
              color: "#000",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            <img
              src={Icons.bath}
              style={{ width: "18.462px", height: "18.824px" }}
              alt="icon"
            />
            {bathrooms}
          </p>
          <p
            style={{
              color: "#000",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            <img
              src={Icons.area}
              style={{ width: "18.462px", height: "18.824px" }}
              alt="icon"
            />
            {area + "M²"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {deleteNEdit ? (
            <>
              <button
                className="Checkbtn"
                style={{
                  color: "#FF0404",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "transparent",
                  border: "1px solid #FF0404",
                }}
                onClick={() => {
                  deleteNEdit();
                  deleteListing();
                }}
              >
                Delete
              </button>

              <button
                className="Checkbtn"
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onClick={() => {
                  const user = firebase.auth().currentUser;
                  if (user) {
                    navigate(`/settings/${id}/editListing`);
                  } else {
                    navigate("/signin");
                  }
                }}
              >
                Edit
              </button>
            </>
          ) : (
            ""
          )}
          <button
            className="Checkbtn"
            style={{
              color: "#FFF",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onClick={() => {
              const user = firebase.auth().currentUser;
              if (user) {
                navigate(`/properties/${id}`);
              } else {
                navigate("/signin");
              }
            }}
          >
            check <img src={Icons.whiteRight} alt="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
