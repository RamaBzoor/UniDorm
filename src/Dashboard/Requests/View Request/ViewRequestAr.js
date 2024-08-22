import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../DashboardIndex.css";
import "./ViewRequest.css";
import DashboardMenuAr from "../../DashboardMenuAr";
import Icons from "../../../icons";
import CardAr from "../../../CardAr";
import firebase from "../../../firebaseConfig";
import { useAuth } from "../../../AuthContext";

const ViewRequest = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { requestId } = useParams();
  const [isSeller, setIsSeller] = useState(false);
  const [status, setStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRequestData = async () => {
      try {
        const requestRef = firebase
          .database()
          .ref(`users/${userId}/requests/${requestId}`);
        const snapshot = await requestRef.once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          setRequestData(data);

          const cardRef = firebase
            .database()
            .ref(`MainListings/${data.propertyId}`);
          const cardSnapshot = await cardRef.once("value");
          if (cardSnapshot.exists()) {
            const cardData = cardSnapshot.val();
            setCardData(cardData);
          }
        } else {
          console.error("Request not found");
          setError("Request not found.");
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
        setError("Failed to fetch request data.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequestData();

    return () => {
      isMounted = false;
    };
  }, [userId, requestId]);

  useEffect(() => {
    let isMounted = true;

    const isSellerRef = firebase
      .database()
      .ref(`users/${userId}/isCurrentlySeller`);
    isSellerRef.on("value", (snapshot) => {
      const isSeller = snapshot.val();
      if (isMounted && isSeller !== null) {
        setIsSeller(Boolean(isSeller));
      }
    });

    return () => {
      isMounted = false;
      isSellerRef.off("value");
    };
  }, [userId]);

  useEffect(() => {
    const initialStatus = requestData?.approved
      ? "Approved"
      : requestData?.declined
      ? "Declined"
      : "Pending";
    setStatus(initialStatus);
  }, [requestData]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setShowDropdown(false);

    const updates = {
      approved: newStatus === "Approved",
      declined: newStatus === "Declined",
      pending: newStatus === "Pending",
    };

    try {
      // Update user's request
      const userRequestRef = firebase
        .database()
        .ref(`users/${requestData.userUID}/requests/${requestId}`);
      await userRequestRef.update(updates);

      // Update seller's request
      const sellerRequestRef = firebase
        .database()
        .ref(
          `users/${requestData.sellerUid}/sellerProfile/requests/${requestId}`
        );
      await sellerRequestRef.update(updates);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!requestData) {
    return <div>No request data found.</div>;
  }

  const formattedTime = requestData.sentAt
    ? new Date(requestData.sentAt).toLocaleDateString()
    : "Unknown date";

  return (
    <section className="dashboard viewRequests">
      <div
        className="container"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        <div className="addListingBtnDiv">
          <Link
            to="/settings/requests/ar"
            style={{
              backgroundColor: "transparent",
              color: "#FF0404",
              border: "2px solid #FF0404",
            }}
          >
            العودة إلى الطلبات
          </Link>
        </div>
        {!isSeller && (
          <div className="addListingBtnDiv">
            <Link
              to={`/settings/requests/${requestId}/editRequest/ar`}
              style={{ backgroundColor: "var(--primary-100)" }}
            >
              تعديل الطلب
            </Link>
          </div>
        )}
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div className="requestImportantData">
            <div className="requestId">
              <div>
                <span>رقم الطلب:</span>
                <span>#{requestId}</span>
              </div>
              <span>تم الطلب في {formattedTime}</span>
            </div>
            <div className="status">
              <button
                data-status={status.toLowerCase()}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {status}{" "}
                {isSeller && (
                  <img
                    src={Icons.down}
                    alt="أيقونة"
                    style={
                      showDropdown
                        ? { rotate: "-90deg", transition: "0.6s" }
                        : { transition: "0.6s" }
                    }
                  />
                )}
              </button>
              {isSeller && showDropdown && (
                <ul className="statusDropDown">
                  <li
                    data-status="approved"
                    onClick={() => handleStatusChange("Approved")}
                  >
                    موافق عليه
                  </li>
                  <li
                    data-status="declined"
                    onClick={() => handleStatusChange("Declined")}
                  >
                    مرفوض
                  </li>
                  <li
                    data-status="pending"
                    onClick={() => handleStatusChange("Pending")}
                  >
                    قيد الانتظار
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="requestBox">
            <h2>معلومات الطالب</h2>
            <div className="one">
              <span>{requestData.userName}</span>
            </div>
            <div className="data">
              <div className="row">
                <span>العنوان</span>
                <span>{requestData.userLocation}</span>
              </div>
              <div className="row">
                <span>الهاتف</span>
                <span>{requestData.phoneNumber}</span>
              </div>
              <div className="row">
                <span>البريد الإلكتروني</span>
                <span>{requestData.email}</span>
              </div>
            </div>
          </div>
          <div className="propertyBookingDetails">
            <h4>العقار</h4>
            {cardData && (
              <CardAr
                id={requestData.propertyId}
                photo={cardData.photo}
                location={cardData.location}
                averageRating={cardData.rating}
                time={cardData.time}
                price={cardData.price}
                bathrooms={cardData.bathrooms}
                area={cardData.area}
                beds={cardData.beds}
                info={cardData.info}
              />
            )}
            <h5>الرسالة</h5>
            <p>{requestData.message}</p>
            <div
              className="contactSeller"
              style={{ margin: "50px auto 0", width: "fit-content" }}
            >
              <button>
                <img src={Icons.phone} alt="أيقونة" />
                {requestData.sellerPhone || "012448123023"}
              </button>
              <button>
                <img src={Icons.whatsApp} alt="أيقونة" />
                رسالة
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewRequest;
