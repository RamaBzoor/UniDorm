import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import firebase from "../../../firebaseConfig";
import Images from "../../../images";
import PayPalButton from "../../../PaymentMethods/PayPal/Paypal";
import "../PaymentSection.css";
import { useAuth } from "../../../AuthContext";

const PaymentSection = ({ listingId }) => {
  const [isSeller, setIsSeller] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userId = currentUser.uid;
  const location = useLocation();
  const initialFormUserData = location.state?.formData || {};
  const [formUserData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    save: false,
    ...initialFormUserData,
  });
  const [payPalSuccess, setPayPalSuccess] = useState(false);
  const [errors, setErrors] = useState("");
  const [showError, setShowError] = useState(false);
  const [paymentUploaded, setPaymentUploaded] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [propertyData, setPropertyData] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (localStorage.getItem("formUserData")) {
      const localStorageFormUserData = JSON.parse(
        localStorage.getItem("formUserData")
      );

      if (localStorageFormUserData.save) {
        setUserFormData(localStorageFormUserData);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formUserData", JSON.stringify(formUserData));
  }, [formUserData]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const propertyRef = firebase
          .database()
          .ref(`MainListings/${listingId}`);
        const snapshot = await propertyRef.once("value");
        const data = snapshot.val();
        setPropertyData(data);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [listingId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setUserFormData((prevState) => ({ ...prevState, save: checked }));
  };

  const handleCouponChange = (e) => {
    const { value } = e.target;
    setCoupon(value);
    setDiscount(value === "UniD0rm" ? 0.5 : 0);
  };

  const validateForm = () => {
    const { firstName, lastName, email, country, state } = formUserData;
    if (!firstName || !lastName || !email || !country || !state) {
      setErrors("All fields are required.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return false;
    }
    return true;
  };

  const handlePayClick = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (!isFormValid) {
      setErrors("Please fill in all fields.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    if (!payPalSuccess) {
      setErrors("Please complete the PayPal payment.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const { firstName, lastName, email, country, state, phoneNumber } =
      formUserData;
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const bookingTime = Date.now();
      const bookingData = {
        listingId: listingId,
        paid: true,
        name: `${firstName} ${lastName}`,
        email: email,
        country: country,
        state: state,
        phoneNumber: phoneNumber,
        time: bookingTime,
        landlordName: propertyData.publisher,
        propertyPrice: propertyData.price,
        couponDiscount: discount,
        totalAmount: propertyData.price - discount,
        userUID: userId,
        message: formUserData.message,
        confirmed: true,
        pending: false,
        cancelled: false,
        paymentData: {
          studentName: `${firstName} ${lastName}`,
          propertyData: {
            location: propertyData.location,
          },
          confirmed: true,
          pending: false,
          cancelled: false,
        },
      };

      try {
        const userBookingRef = firebase
          .database()
          .ref(`users/${userId}/bookings`);
        const bookingKey = userBookingRef.push().key;
        await userBookingRef.child(bookingKey).set(bookingData);
        console.log("Booking saved successfully to user's node.");

        const sellerId = propertyData.SellerUID;
        const sellerBookingRef = firebase
          .database()
          .ref(`users/${sellerId}/sellerProfile/bookings`);
        const sellerBookingKey = sellerBookingRef.push().key;
        await sellerBookingRef.child(sellerBookingKey).set(bookingData);
        console.log("Booking saved successfully to seller's sellerProfile.");
        setPaymentUploaded(true);
      } catch (error) {
        console.error("Error saving booking:", error);
        setErrors("Error occurred while saving booking. Please try again.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } else {
      console.error("User is not authenticated.");
      setErrors("User is not authenticated. Please log in and try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }

    navigate("/settings");
  };

  useEffect(() => {
    if (paymentUploaded) {
      const { firstName, lastName, email, country, state } = formUserData;
      const bookingTime = Date.now();

      const paymentData = {
        studentName: `${firstName} ${lastName}`,
        propertyData: {
          location: propertyData.location,
          
        },
        confirmed: true,
        pending: false,
        cancelled: false,
      };

      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const sellerId = propertyData.SellerUID;
          const paymentRef = firebase
            .database()
            .ref(`users/${sellerId}/sellerProfile/payments`);
          const paymentKey = paymentRef.push().key;
          paymentRef.child(paymentKey).set(paymentData);
          console.log("Payment saved successfully to seller's profile.");
        } else {
          console.error("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error saving payment to seller's profile:", error);
      }
    }
  }, [paymentUploaded, formUserData, propertyData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (payPalSuccess) {
        e.preventDefault();
        e.returnValue =
          "You have successfully made a PayPal payment. If you leave now, your money will be lost.";
      }
    };

    if (payPalSuccess) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [payPalSuccess]);

  const total = propertyData ? propertyData.price - discount : 0;

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="paymentSection">
      <h2>سوف تدفع أول شهر من الإيجار لتأكيد الحجز</h2>
      <div className="paymentSectionContainer">
        <div className="billingNSummary">
          <div className="billing">
            <h3>تفاصيل الفواتير</h3>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="الاسم الأول"
              value={formUserData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="الاسم الأخير"
              value={formUserData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formUserData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="الدولة"
              value={formUserData.country}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="الولاية"
              value={formUserData.state}
              onChange={handleInputChange}
            />
            <label>
              <input
                type="checkbox"
                name="save"
                checked={formUserData.save}
                onChange={handleCheckboxChange}
                style={{ width: "20px", height: "20px" }}
              />
              احفظ معلوماتي لتسريع عملية الدفع
            </label>
          </div>
          <div className="summary">
            <h3>ملخص الحجز</h3>
            <div className="summaryProperty">
              <img
                src={propertyData.photo || Images.blog2}
                alt="صورة العقار"
                style={{ width: "54px", height: "49px" }}
              />
              <p>{propertyData.location}</p>
              <div className="price">
                <span>{propertyData.price}$</span> / الشهر
              </div>
            </div>
            <div className="calcs">
              <div>
                <span>المجموع الفرعي</span>
                <span>{propertyData.price}$</span>
              </div>
              <div>
                <span>التوفير</span>
                <span>
                  {discount > 0 ? `-$${discount.toFixed(2)}` : "-$0.00"}
                </span>
              </div>
              <div>
                <span>المجموع الكلي</span>
                <span>{total.toFixed(2)}$</span>
              </div>
            </div>
          </div>
        </div>
        <div className="coupon">
          <h3>
            هل لديك قسيمة؟ <span>(اختياري)</span>
          </h3>
          <p>أدخل قسيمتك للحصول على أفضل سعر</p>
          <div>
            <input type="text" value={coupon} onChange={handleCouponChange} />
            <button>تطبيق القسيمة</button>
          </div>
        </div>
        <div className="paymentMethods">
          <h3>طرق الدفع</h3>
          <p>جميع المعاملات آمنة</p>
          <div className="paymentBox">
            {!payPalSuccess ? (
              <PayPalButton
                price={total.toFixed(2)}
                onSuccess={(orderId) => {
                  console.log("نجاح الدفع بواسطة باي بال", orderId);
                  setPayPalSuccess(true);
                }}
              />
            ) : (
              <>
                <span
                  className="material-icons"
                  style={{ color: "#5570f1", width: "100px" }}
                >
                  check_circle
                </span>
              </>
            )}
          </div>
        </div>
        <div className="nextBtnContainer">
          <Link to="#" onClick={handlePayClick}>
            الدفع
          </Link>
        </div>
      </div>
      <div className={`errorNotification ${showError ? "visible" : "hidden"}`}>
        <p>{errors}</p>
      </div>
    </section>
  );
};

export default PaymentSection;
