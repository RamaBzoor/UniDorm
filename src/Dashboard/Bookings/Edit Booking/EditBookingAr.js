import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import firebase from "../../../firebaseConfig"; // Adjust the import based on your Firebase configuration path
import DashboardMenuAr from "../../DashboardMenuAr";
import "./EditBooking.css";
import "../../DashboardIndex.css";
import CardAr from "../../../CardAr";
import Images from "../../../images";
import { useAuth } from "../../../AuthContext";

const EditBooking = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { bookingId } = useParams(); // Extract booking ID from URL
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [propertyId, setPropertyId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    month: "",
    year: "",
    msg: "",
  });
  const [formDataTwo, setFormDataTwo] = useState({
    name: "",
    email: "",
    country: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookingRef = firebase
          .database()
          .ref(`users/${userId}/bookings/${bookingId}`);
        const snapshot = await bookingRef.once("value");
        if (snapshot.exists()) {
          const bookingData = snapshot.val();
          setFormData({
            name: bookingData.name,
            email: bookingData.email,
            phoneNumber: bookingData.phoneNumber,
            month: new Date(bookingData.time).getMonth() + 1,
            year: new Date(bookingData.time).getFullYear(),
            msg: bookingData.message,
          });
          setFormDataTwo({
            name: bookingData.name,
            email: bookingData.email,
            country: bookingData.country,
            state: bookingData.state,
          });
        } else {
          setError("Booking not found");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setError("Error fetching booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, userId]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        let propertyIdRef;
        if (isSeller) {
          propertyIdRef = firebase
            .database()
            .ref(
              `users/${userId}/sellerProfile/bookings/${bookingId}/listingId`
            );
        } else {
          propertyIdRef = firebase
            .database()
            .ref(`users/${userId}/bookings/${bookingId}/listingId`);
        }

        const snapshot = await propertyIdRef.once("value");
        if (snapshot.exists()) {
          const propertyId = snapshot.val();
          setPropertyId(propertyId);
          const listingRef = firebase
            .database()
            .ref(`MainListings/${propertyId}/`);

          const propertySnapshot = await listingRef.once("value");
          if (propertySnapshot.exists()) {
            setPropertyData(propertySnapshot.val());
          }
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
        setError("Error fetching property data");
      }
    };

    if (userId && bookingId) {
      fetchPropertyData();
    }
  }, [userId, bookingId, isSeller]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeForFormTwo = (e) => {
    const { name, value } = e.target;
    setFormDataTwo({
      ...formDataTwo,
      [name]: value,
    });
  };

  const onSave = async () => {
    try {
      const bookingRef = firebase
        .database()
        .ref(`users/${userId}/bookings/${bookingId}`);
      await bookingRef.update({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        message: formData.msg,
        country: formDataTwo.country,
        state: formDataTwo.state,
      });
      navigate("/settings/bookings/ar");
    } catch (error) {
      console.error("Error updating booking data:", error);
      setError("Error updating booking data");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="dashboard editBooking">
      <div
        className="container"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        <div className="addListingBtnDiv">
          <Link
            to="/settings/bookings/ar"
            style={{
              backgroundColor: "transparent",
              color: "#FF0404",
              border: "2px solid #FF0404",
            }}
          >
            إلغاء
          </Link>
        </div>
        <div className="addListingBtnDiv">
          <button
            onClick={onSave}
            style={{
              backgroundColor: "var(--primary-100)",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            حفظ
          </button>
        </div>
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div className="columnOne">
            <h2>المعلومات الشخصية</h2>
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
                name="phoneNumber"
                placeholder="رقم الهاتف"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <input
                type="text"
                name="month"
                placeholder="الشهر"
                value={formData.month}
                onChange={handleChange}
              />
              <input
                type="text"
                name="year"
                placeholder="السنة"
                value={formData.year}
                onChange={handleChange}
              />
              <textarea
                name="msg"
                placeholder="الرسالة"
                value={formData.msg}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="columnTwo">
            <h2>تفاصيل الفوترة</h2>
            <div className="form">
              <input
                type="text"
                name="name"
                placeholder="الاسم"
                value={formDataTwo.name}
                onChange={handleChangeForFormTwo}
              />
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={formDataTwo.email}
                onChange={handleChangeForFormTwo}
              />
              <input
                type="text"
                name="country"
                placeholder="الدولة"
                value={formDataTwo.country}
                onChange={handleChangeForFormTwo}
              />
              <input
                type="text"
                name="state"
                placeholder="الولاية"
                value={formDataTwo.state}
                onChange={handleChangeForFormTwo}
              />
            </div>
            <CardAr
              id={propertyId}
              photo={propertyData.photo}
              location={propertyData.location}
              averageRating={propertyData.rating}
              time={propertyData.time}
              price={propertyData.price}
              bathrooms={propertyData.bathrooms}
              area={propertyData.area}
              beds={propertyData.beds}
              info={propertyData.info}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditBooking;
