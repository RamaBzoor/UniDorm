import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../DashboardIndex.css";
import "./EditRequest.css";
import DashboardMenuAr from "../../DashboardMenuAr";
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
        <DashboardMenuAr />
        <div className="content">
          <div className="requestId">
            <div>
              <span>رقم الطلب:</span>
              <span>#{requestId}</span>
            </div>
            {requestData && <span>تم الطلب في {requestData.date}</span>}
          </div>
          <div className="form">
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="number"
              placeholder="رقم الهاتف"
              value={formData.number}
              onChange={handleChange}
            />
            <textarea
              name="msg"
              placeholder="الرسالة"
              value={formData.msg}
              onChange={handleChange}
            />
            <input
              name="date"
              placeholder="التاريخ"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              name="time"
              placeholder="الوقت"
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
                to="/settings/requests/ar"
              >
                إلغاء
              </Link>
            </div>
            <div className="addListingBtnDiv">
              <button
                style={{ backgroundColor: "var(--primary-100)" }}
                onClick={handleSave} // Call handleSave when the "Save" button is clicked
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditRequest;
