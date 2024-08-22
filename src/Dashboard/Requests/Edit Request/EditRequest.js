import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../DashboardIndex.css";
import "./EditRequest.css";
import DashboardMenu from "../../DashboardMenu";
import firebase from "../../../firebaseConfig";
import { useAuth } from "../../../AuthContext";

const EditRequest = () => {
  const { requestId } = useParams(); // Get the request ID from the URL
  const { currentUser } = useAuth();
  const [isSeller, setIsSeller] = useState(false);
  const userId = currentUser.uid;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    msg: "",
    date: "",
    time: "",
  });
  const [requestData, setRequestData] = useState([]);

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
    const fetchRequestData = async () => {
      try {
        const requestRef = firebase
          .database()
          .ref(`users/${userId}/requests/${requestId}/`);
        const snapshot = await requestRef.once("value");
        if (snapshot.exists()) {
          const requestData = snapshot.val();
          setRequestData(requestData);
          setFormData({
            name: requestData.userName || "",
            email: requestData.userEmail || "",
            number: requestData.phoneNumber || "",
            msg: requestData.message || "",
            date: requestData.selectDate || "",
            time: requestData.time || "",
          });
        } else {
          console.error("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchRequestData();
  }, [userId, requestId]); // Add userId and requestId to the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const requestRef = firebase
        .database()
        .ref(`users/${userId}/requests/${requestId}/`);

      await requestRef.update({
        userName: formData.name,
        userEmail: formData.email,
        phoneNumber: formData.number,
        message: formData.msg,
        selectDate: formData.date,
        time: formData.time,
      });

      console.log("Request data updated successfully!");
    } catch (error) {
      console.error("Error updating request data:", error);
    }
  };

  return (
    <section className="dashboard editRequest">
      <div className="container">
        <DashboardMenu />
        <div className="content">
          <div className="requestId">
            <div>
              <span>Request ID:</span>
              <span>#{requestId}</span>
            </div>
            {requestData && <span>Requested at {requestData.date}</span>}
          </div>
          <div className="form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="number"
              placeholder="Number"
              value={formData.number}
              onChange={handleChange}
            />
            <textarea
              name="msg"
              placeholder="Message"
              value={formData.msg}
              onChange={handleChange}
            />
            <input
              name="date"
              placeholder="Date"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              name="time"
              placeholder="Time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "40px",
            }}
          >
            <div className="addListingBtnDiv">
              <Link
                style={{
                  backgroundColor: "transparent",
                  color: "#FF0404",
                  border: "2px solid #FF0404",
                }}
                to="/settings/requests"
              >
                Cancel
              </Link>
            </div>
            <div className="addListingBtnDiv">
              <button
                style={{ backgroundColor: "var(--primary-100)" }}
                onClick={handleSave} // Call handleSave when the "Save" button is clicked
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditRequest;
