import React, { useState, useCallback, useEffect } from "react";
import "../RequestATour.css";
import Icons from "../../../icons";
import firebase from "../../../firebaseConfig";
import { useAuth } from "../../../AuthContext";

const RequestATour = ({ listingId, isFormVisible, onClose }) => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState("");
  const [showError, setShowError] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    if (currentUser) {
      const userRef = firebase.database().ref(`users/${currentUser.uid}`);
      userRef.once("value", (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          if (userData.name) {
            setUserName(userData.name);
          }
          if (userData.country && userData.address) {
            setUserLocation(`${userData.country}, ${userData.address}`);
          }
          if (userData.email) {
            setUserEmail(`${userData.email}`);
          }
        }
      });
    }
  }, [currentUser]);

  const toggleFormVisibility = () => {
    onClose();
  };

  const onchange = (e, setter) => {
    let value = e.target.value;
    value = value.replace(/[^\d/:]/g, "");
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.endsWith("/") && (value.length === 3 || value.length === 6)) {
      setter(value);
      return;
    }
    setter(value);
    checkAndAdd(value, setter);
  };

  const checkAndAdd = useCallback((value, setter) => {
    if (value.length === 2 || value.length === 5) {
      const lastChar = value.charAt(value.length - 1);
      if (lastChar !== "/" && lastChar !== ":") {
        setter(`${value}/`);
      } else {
        setter(value.substring(0, value.length - 1));
      }
    }
  }, []);

  const isValidDate = (dateString) => {
    const dateRegex =
      /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [day, month, year] = dateString.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const isValidYear = year >= currentYear && year <= currentYear + 10;
    const isValidMonth = month >= 1 && month <= 12;
    const isValidDay = day >= 1 && day <= 31;

    return isValidYear && isValidMonth && isValidDay;
  };

  useEffect(() => {
    let timeout;
    if (showError) {
      timeout = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showError]);

  const generateUniqueId = () => {
    return "xxxx-xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !dob || !selectDate || !time) {
      setErrors("Please fill all inputs.");
      setShowError(true);
      return;
    }

    if (!isValidDate(dob)) {
      setErrors("Invalid lease date. Please enter a valid dd/mm/yy date.");
      setShowError(true);
      return;
    }

    setErrors("");

    try {
      const propertyRef = firebase.database().ref(`MainListings/${listingId}`);
      const snapshot = await propertyRef.once("value");
      const propertyData = snapshot.val();
      const sellerEmail = propertyData && propertyData.sellerEmail;
      const landlordName = propertyData && propertyData.publisher;
      const landlordId = propertyData && propertyData.sellerId;
      const propDetails = propertyData && propertyData.location;
      const sellerUid = propertyData && propertyData.SellerUID; // Assuming sellerUid is stored in property data

      if (!sellerEmail || !sellerUid) {
        throw new Error("Seller's email or UID not found");
      }

      const subjectTitle = "Tour Request";
      const bodyContent = `I requested a tour to your property. My phone number is: ${phoneNumber} I want to lease on: ${dob} On the day: ${selectDate} At: ${time} ${
        document.querySelector(".message textarea").value
      }`;

      const mailtoLink = `mailto:${sellerEmail}?subject=${encodeURIComponent(
        subjectTitle
      )}&body=${encodeURIComponent(bodyContent)}`;

      window.open(mailtoLink, "_blank");

      // Create request object with timestamp
      const requestId = generateUniqueId();
      const requestObject = {
        approved: false,
        pending: true,
        declined: false,
        landlordName,
        propDetails,
        sellerUid,
        phoneNumber,
        dob,
        userUID: userId,
        time,
        message: document.querySelector(".message textarea").value,
        sentAt: new Date().getTime(), // Add the current timestamp
        userName, // Add the user's name
        userEmail,
        userLocation, // Add the user's location
        propertyId: listingId,
      };

      // Save request to user's requests node in the database
      const userRequestsRef = firebase
        .database()
        .ref(`users/${currentUser.uid}/requests`);

      await userRequestsRef.child(requestId).set(requestObject);
      console.log("Request added to database:", requestObject);

      // Save request to seller's profile
      const sellerRequestsRef = firebase
        .database()
        .ref(`users/${sellerUid}/sellerProfile/requests`);

      await sellerRequestsRef.child(requestId).set(requestObject);
      console.log("Request added to seller's profile:", requestObject);
    } catch (error) {
      console.error("Error fetching seller's email or saving request:", error);
      setErrors("Failed to send request. Please try again later.");
      setShowError(true);
    }
  };

  return (
    <>
      {isFormVisible && (
        <>
          <div className="lay" onClick={toggleFormVisibility}>
            {" "}
            <div
              className={`errorNotification ${
                showError ? "visible" : "hidden"
              }`}
            >
              <p>{errors}</p>
            </div>
          </div>
          <div className="requestTourForm">
            <div className="headerAndPhoto">
              <p>طلب جولة</p>
              <img
                src={Icons.X}
                alt="icon"
                className="closeIcon"
                onClick={toggleFormVisibility}
              />
            </div>
            <div className="inputs">
              <div className="nameAndEmail">
                <input
                  type="text"
                  placeholder="الاسم"
                  value={userName}
                  readOnly
                />
              </div>
              <div className="numberAndDate">
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  maxLength="15"
                  value={phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\D/g, "");
                    setPhoneNumber(value);
                  }}
                />
                <input
                  type="text"
                  placeholder="تاريخ الإيجار (dd/mm/yy)"
                  value={dob}
                  onChange={(e) => onchange(e, setDob)}
                />
              </div>
              <div className="dateAndTime">
                <input
                  type="text"
                  style={{ backgroundPosition: "left" }}
                  placeholder="حدد التاريخ (dd/mm/yy)"
                  value={selectDate}
                  onChange={(e) => onchange(e, setSelectDate)}
                />
                <input
                  type="text"
                  placeholder="أدخل الوقت (hh:mm)"
                  value={time}
                  style={{ backgroundPosition: "left" }}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^\d/:]/g, "");
                    if (value.length > 5) {
                      value = value.slice(0, 5);
                    }
                    if (
                      value.length === 2 &&
                      !value.endsWith("/") &&
                      !value.endsWith(":")
                    ) {
                      value += ":";
                    }
                    setTime(value);
                  }}
                />
              </div>
              <div className="message">
                <textarea placeholder="رسالة"></textarea>
              </div>
              <div className="sendBtn">
                <button onClick={handleSubmit}>
                  إرسال طلب
                  <img src={Icons.WhiteArrowRight} alt="" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RequestATour;
