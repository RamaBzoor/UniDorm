import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import firebase from "../../../firebaseConfig"; // Adjust the import based on your Firebase configuration path
import "./ViewBooking.css";
import "../../DashboardIndex.css";
import DashboardMenuAr from "../../DashboardMenuAr";
import CardAr from "../../../CardAr";
import Images from "../../../images";
import Icons from "../../../icons";
import { useAuth } from "../../../AuthContext";

const ViewBooking = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const { bookingId } = useParams(); // Extract booking ID from URL
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [propertyId, setPropertyId] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        let bookingRef;
        if (isSeller) {
          bookingRef = firebase
            .database()
            .ref(`users/${userId}/sellerProfile/bookings/${bookingId}`);
        } else {
          bookingRef = firebase
            .database()
            .ref(`users/${userId}/bookings/${bookingId}`);
        }
        const snapshot = await bookingRef.once("value");
        if (snapshot.exists()) {
          setBookingData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setError("Error fetching booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, isSeller, userId]);

  useEffect(() => {
    const isSellerRef = firebase
      .database()
      .ref(`users/${userId}/isCurrentlySeller`);

    isSellerRef.on("value", (snapshot) => {
      const isSeller = snapshot.val();
      setIsSeller(Boolean(isSeller));
    });

    // Clean up the listener
    return () => {
      isSellerRef.off();
    };
  }, [userId]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [userId, bookingId, isSeller]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bookingData) {
    return null;
  }

  return (
    <section className="dashboard viewBooking">
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
            العودة إلى الحجوزات
          </Link>
        </div>
        {isSeller ? (
          ""
        ) : (
          <div className="addListingBtnDiv">
            <Link
              to={`/settings/bookings/${bookingId}/editBooking/ar`}
              style={{ backgroundColor: "var(--primary-100)" }}
            >
              تعديل الحجز
            </Link>
          </div>
        )}
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div className="bookingBoxes">
            <div className="bookingBox one">
              <div className="row">
                <h3>معلومات الطالب</h3>
              </div>
              <div className="row">
                <span>{bookingData.name}</span>
              </div>
              <div className="row">
                <span>العنوان</span>
                <span>{bookingData.country + ", " + bookingData.state}</span>
              </div>
              <div className="row">
                <div>
                  <span>البريد الإلكتروني</span>
                  <span>{bookingData.email}</span>
                </div>
                <div>
                  <span>الهاتف</span>
                  <span>{bookingData.phoneNumber}</span>
                </div>
              </div>
            </div>
            <div className="bookingBox two">
              <div className="row">
                <div className="rowPointOne">
                  <span>رقم الحجز:</span>
                  <span>#{bookingId}</span>
                </div>
                <span style={{ width: "80px" }}>
                  حجز في {new Date(bookingData.time).toLocaleDateString()}
                </span>
              </div>
              <div className="row">
                <span>السعر</span>
                <span>${bookingData.propertyPrice}</span>
              </div>
              <div className="row">
                <span>خصم القسيمة</span>
                <span>${bookingData.couponDiscount}</span>
              </div>
              <div className="row">
                <span>الإجمالي</span>
                <span>${bookingData.totalAmount}</span>
              </div>
            </div>
            <div className="bookingBox three">
              <div className="specialRow">
                <span>طريقة الدفع:</span>
                <span>باي بال</span>
              </div>
            </div>
          </div>
          <h2 className="propertyBookingHead">تفاصيل حجز الطالب</h2>
          <div className="propertyBookingDetails">
            <h4>العقار</h4>
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
            <h5>الرسالة</h5>
            <p>{bookingData.message}</p>
            <div
              className="contactSeller"
              style={{
                margin: "50px auto 0",
                width: "fit-content",
              }}
            >
              <button>
                <img src={Icons.phone} alt="أيقونة" />
                {bookingData.contactPhone}
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

export default ViewBooking;
