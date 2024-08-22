import { Link } from "react-router-dom";
import DashboardMenu from "../DashboardMenu";
import Icons from "../../icons";
import Card from "../../Card";
import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import firebase from "../../firebaseConfig";

const AllListings = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [listings, setListings] = useState([]);
  const [checkTime, setCheckTime] = useState("allTime");
  const [searchValue, setSearchValue] = useState("");

  const deleteListing = async (listingId) => {
    try {
      await firebase.database().ref(`MainListings/${listingId}`).remove();
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = firebase
          .database()
          .ref(`users/${userId}/likedItems/${listingId}`);
        userRef.remove();
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = firebase.database().ref("MainListings");
        listingsRef.on("value", (snapshot) => {
          const listingsData = snapshot.val();
          const userListings = [];

          for (let id in listingsData) {
            if (listingsData[id].SellerUID === userId) {
              userListings.push({ id, ...listingsData[id] });
            }
          }

          setListings(userListings);
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [userId]);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const deleteRequestsAndBookings = async (listingId) => {
    try {
      console.log("Deleting requests and bookings for listing ID:", listingId);

      const requestsRef = firebase
        .database()
        .ref(`users/${userId}/sellerProfile/requests`);
      await requestsRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const requestId = childSnapshot.key;
          const request = childSnapshot.val();
          if (request.propertyId === listingId) {
            console.log(
              "Deleting request for current user with ID:",
              requestId
            );
            console.log("Request data:", request);
            requestsRef.child(requestId).remove();

            const userUID = request.userUID;
            console.log("User UID for request:", userUID);
            const userRequestRef = firebase
              .database()
              .ref(`users/${userUID}/requests/${requestId}`);
            userRequestRef
              .remove()
              .then(() =>
                console.log(`Request ${requestId} removed for user ${userUID}`)
              )
              .catch((error) =>
                console.error(
                  `Error removing request ${requestId} for user ${userUID}:`,
                  error
                )
              );

            const userBookingRef = firebase
              .database()
              .ref(`users/${userUID}/bookings`)
              .orderByChild("listingId")
              .equalTo(listingId);
            userBookingRef.once("value", (bookingSnapshot) => {
              bookingSnapshot.forEach((bookingChildSnapshot) => {
                console.log(
                  `Deleting booking ${bookingChildSnapshot.key} for user ${userUID}`
                );
                bookingChildSnapshot.ref
                  .remove()
                  .then(() =>
                    console.log(
                      `Booking ${bookingChildSnapshot.key} removed for user ${userUID}`
                    )
                  )
                  .catch((error) =>
                    console.error(
                      `Error removing booking ${bookingChildSnapshot.key} for user ${userUID}:`,
                      error
                    )
                  );
              });
            });
          }
        });
      });

      const bookingsRef = firebase
        .database()
        .ref(`users/${userId}/sellerProfile/bookings`);
      await bookingsRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const bookingId = childSnapshot.key;
          const booking = childSnapshot.val();
          if (booking.listingId === listingId) {
            console.log(
              "Deleting booking for current user with ID:",
              bookingId
            );
            console.log("Booking data:", booking);
            bookingsRef
              .child(bookingId)
              .remove()
              .then(() =>
                console.log(`Booking ${bookingId} removed for current user`)
              )
              .catch((error) =>
                console.error(
                  `Error removing booking ${bookingId} for current user:`,
                  error
                )
              );
          }
        });
      });
    } catch (error) {
      console.error("Error deleting requests and bookings:", error);
    }
  };

  return (
    <section className="dashboard AllListings">
      <div className="container">
        <div className="addListingBtnDiv">
          <Link to="/newproperty">Add Listing</Link>
        </div>
      </div>
      <div className="container">
        <DashboardMenu />
        <div className="content">
          <div
            className="specialBox"
            style={{
              maxWidth: "630px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <img src={Icons.timeBordered} alt="icon" />
            <div className="quickInfo">
              <div>
                <span>Total Listings</span>
                <span>{listings.length}</span>
              </div>
            </div>
          </div>
          <h2 className="profileHeading">Your Listings</h2>
          <div className="miniFilter">
            <div className="dateFilter">
              <button
                onClick={() => setCheckTime("allTime")}
                className={checkTime === "allTime" ? "activeSelect" : ""}
              >
                All Time
              </button>
              <button
                onClick={() => setCheckTime("year")}
                className={checkTime === "year" ? "activeSelect" : ""}
              >
                12 Months
              </button>
              <button
                onClick={() => setCheckTime("month")}
                className={checkTime === "month" ? "activeSelect" : ""}
              >
                30 Days
              </button>
              <button
                onClick={() => setCheckTime("week")}
                className={checkTime === "week" ? "activeSelect" : ""}
              >
                7 Days
              </button>
              <button
                onClick={() => setCheckTime("today")}
                className={checkTime === "today" ? "activeSelect" : ""}
              >
                Today
              </button>
            </div>
            <div className="search" style={{ width: "fit-content" }}>
              <img
                src={Icons.searchBlack}
                alt="icon"
                style={{ width: "20px", aspectRatio: "1" }}
              />
              <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="dataCards">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                id={listing.id}
                {...listing}
                deleteNEdit={() => deleteRequestsAndBookings(listing.id)}
                deleteListing={deleteListing}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllListings;
