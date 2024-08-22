import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import firebase from "../firebaseConfig";
import DashboardMenuAr from "./DashboardMenuAr";
import "./DashboardIndex.css";
import "./Dashboard.css";
import CustomDataTable from "./CustomDataTable";
import IconButton from "@mui/material/IconButton";
import Icons from "../icons";

const UseFormatTime = (time) => {
  const [elapsedTime, setElapsedTime] = useState(formatElapsedTime(time));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(formatElapsedTime(time));
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return elapsedTime;
};

const formatElapsedTime = (time) => {
  const currentTime = Math.floor(Date.now());
  const elapsedMilliseconds = currentTime - time;

  if (elapsedMilliseconds < 60000) {
    return "just now";
  } else if (elapsedMilliseconds < 3600000) {
    const minutes = Math.floor(elapsedMilliseconds / 60000);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (elapsedMilliseconds < 86400000) {
    const hours = Math.floor(elapsedMilliseconds / 3600000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (elapsedMilliseconds < 2592000000) {
    const days = Math.floor(elapsedMilliseconds / 86400000);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (elapsedMilliseconds < 31536000000) {
    const months = Math.floor(elapsedMilliseconds / 2592000000);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(elapsedMilliseconds / 31536000000);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [sellerData, setSellerData] = useState({});
  const [userReqsData, setUserReqsData] = useState([]);
  const [userBookingsData, setUserBookingsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userRefUser = firebase.database().ref(`users/${userId}`);
        const userRefReqs = isSeller
          ? firebase.database().ref(`users/${userId}/sellerProfile/requests`)
          : firebase.database().ref(`users/${userId}/requests`);
        const userRefBookings = isSeller
          ? firebase.database().ref(`users/${userId}/sellerProfile/bookings`)
          : firebase.database().ref(`users/${userId}/bookings`);

        try {
          const userSnapshot = await userRefUser.once("value");
          setUserData(userSnapshot.val());

          const reqsSnapshot = await userRefReqs.once("value");
          const reqsData = reqsSnapshot.val();
          if (reqsData) {
            const formattedReqs = Object.keys(reqsData)
              .map((reqId) => ({
                id: reqId,
                landlordName: reqsData[reqId].landlordName || "Unknown",
                userName: reqsData[reqId].userName || "Unknown",
                propertyDetails: reqsData[reqId].propDetails || "N/A",
                sentAt: reqsData[reqId].sentAt || "N/A",
                requestStatus: reqsData[reqId].approved
                  ? "Approved"
                  : reqsData[reqId].declined
                  ? "Declined"
                  : "Pending",
              }))
              .sort((a, b) => b.sentAt - a.sentAt);

            setUserReqsData(formattedReqs.slice(0, 4));
          } else {
            setUserReqsData([]);
          }

          const bookingsSnapshot = await userRefBookings.once("value");
          const bookingsData = bookingsSnapshot.val();
          if (bookingsData) {
            const formattedBookings = Object.keys(bookingsData)
              .map((bookingId) => ({
                id: bookingId,
                propertyDetails:
                  bookingsData[bookingId].country +
                    ", " +
                    bookingsData[bookingId].state || "N/A",
                bookingDate: bookingsData[bookingId].time || "N/A",
                bookingStatus: bookingsData[bookingId].paid ? "paid" : "unpaid",
                userName: bookingsData[bookingId].name || "",
                LandlordName: bookingsData[bookingId].landlordName || "",
              }))
              .sort((a, b) => b.bookingDate - a.bookingDate);

            setUserBookingsData(formattedBookings.slice(0, 4));
          } else {
            setUserBookingsData([]);
          }

          const userRefSeller = firebase
            .database()
            .ref(`users/${userId}/sellerProfile`);
          const snapshot = await userRefSeller.once("value");
          const data = snapshot.val();
          setSellerData(data); // Corrected line

          const isSellerRef = firebase
            .database()
            .ref(`users/${userId}/isCurrentlySeller`);

          isSellerRef.on("value", (snapshot) => {
            const isSeller = snapshot.val();
            setIsSeller(Boolean(isSeller));
          });

          return () => {
            isSellerRef.off();
            isMounted = false;
          };
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => (isMounted = false);
  }, [currentUser, isSeller]);

  const handleDeleteRequest = async (requestId) => {
    try {
      // Delete request from user's data
      await firebase
        .database()
        .ref(`users/${currentUser.uid}/requests/${requestId}`)
        .remove();

      // Check if user is a seller and delete request from seller's sellerProfile
      if (isSeller) {
        await firebase
          .database()
          .ref(`users/${currentUser.uid}/sellerProfile/requests/${requestId}`)
          .remove();
      }

      // Update userReqsData state to remove the deleted request
      setUserReqsData((prevData) =>
        prevData.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const requestColumns = [
    {
      field: isSeller ? "userName" : "landlordName",
      headerName: isSeller ? "الطالب" : "اسم المالك",
      width: 150,
    },
    { field: "propertyDetails", headerName: "تفاصيل العقار", width: 130 },
    {
      field: "sentAt",
      headerName: "تاريخ الإرسال",
      width: 150,
      renderCell: (params) => <span>{UseFormatTime(params.value)}</span>,
    },
    { field: "requestStatus", headerName: "حالة الطلب", width: 130 },
    {
      field: "action",
      headerName: "الإجراء",
      width: 140,
      renderCell: (params) => (
        <div
          style={{ display: "flex", marginTop: "auto", marginBottom: "auto" }}
        >
          <IconButton
            onClick={() =>
              navigate(`/settings/requests/${params.id}/viewRequest`)
            }
          >
            <img src={Icons.eye} alt="عرض" style={{ width: 20, height: 20 }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteRequest(params.id)}>
            <img
              src={Icons.delete}
              alt="حذف"
              style={{ width: 20, height: 20 }}
            />
          </IconButton>
          {isSeller ? (
            ""
          ) : (
            <IconButton
              onClick={() =>
                navigate(`/settings/requests/${params.id}/editRequest`)
              }
            >
              <img
                src={Icons.pen}
                alt="تعديل"
                style={{ width: 20, height: 20 }}
              />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  const bookingColumns = [
    {
      field: isSeller ? "userName" : "landlordName",
      headerName: isSeller ? "الطالب" : "اسم المالك",
      width: 150,
    },
    { field: "propertyDetails", headerName: "تفاصيل العقار", width: 130 },
    {
      field: "bookingDate",
      headerName: "تاريخ الحجز",
      width: 150,
      renderCell: (params) => (
        <span>{UseFormatTime(new Date(params.value))}</span>
      ),
    },
    { field: "bookingStatus", headerName: "حالة الحجز", width: 130 },
    {
      field: "action",
      headerName: "الإجراء",
      width: 140,
      renderCell: (params) => (
        <div
          style={{ display: "flex", marginTop: "auto", marginBottom: "auto" }}
        >
          <IconButton
            onClick={() =>
              navigate(`/settings/bookings/${params.id}/viewBooking`)
            }
          >
            <img src={Icons.eye} alt="عرض" style={{ width: 20, height: 20 }} />
          </IconButton>
          {isSeller ? (
            ""
          ) : (
            <IconButton
              onClick={() =>
                navigate(`/settings/bookings/${params.id}/editBooking`)
              }
            >
              <img
                src={Icons.pen}
                alt="تعديل"
                style={{ width: 20, height: 20 }}
              />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="dashboardSection dashboard">
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div className="profileQuikeInfos">
            <div className="firstBox myBox">
              <div className="image">
                {!isSeller ? (
                  <img src={userData.pfp} alt="صورة الملف الشخصي" />
                ) : (
                  <img
                    src={sellerData.profileImageURL}
                    alt="صورة الملف الشخصي"
                  />
                )}
              </div>
              <div style={{ width: "100%" }}>
                {!isSeller ? (
                  <h3>{userData.name}</h3>
                ) : (
                  <h3>{sellerData.name}</h3>
                )}
                <div className="contactInfo">
                  <span>
                    <img src={Icons.emailBordered} alt="البريد الإلكتروني" />
                    {userData.email}
                  </span>
                  {isSeller ? (
                    <>
                      <span>
                        <img src={Icons.phoneBordered} alt="الهاتف" />
                        {sellerData.phoneNumber}
                      </span>
                      <span>
                        <img src={Icons.mapBordered} alt="الموقع" />
                        {sellerData.country + ", " + sellerData.state}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="secondBox myBox">
              <img src={Icons.timeBordered} alt="أيقونة" />
              <div className="quikeInfo">
                <div>
                  <span>إجمالي الطلبات</span>
                  <span>{userReqsData ? userReqsData.length : 0}</span>
                </div>
                <div>
                  <span>إجمالي الحجوزات</span>
                  <span>{userBookingsData ? userBookingsData.length : 0}</span>
                </div>
                <div>
                  <span>المعاملات الناجحة</span>
                  <span>{userBookingsData ? userBookingsData.length : 0}</span>
                </div>
              </div>
            </div>
          </div>
          <CustomDataTable
            tableTitle="الطلبات الأخيرة"
            link="/settings/requests/ar"
            rows={userReqsData}
            columns={requestColumns}
            pageSize={4}
          />
          <CustomDataTable
            tableTitle="الحجوزات الأخيرة"
            link="/settings/bookings/ar"
            rows={userBookingsData}
            columns={bookingColumns}
            pageSize={4}
          />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
