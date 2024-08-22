import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import firebase from "../../firebaseConfig";
import Icons from "../../icons";
import CustomDataTable from "../CustomDataTable";
import DashboardMenuAr from "../DashboardMenuAr";
import { useAuth } from "../../AuthContext";

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

const UseFormatTime = (time, isSeller, setIsSeller) => {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    let isMounted = true;

    const isSellerRef = userId
      ? firebase.database().ref(`users/${userId}/isCurrentlySeller`)
      : null;

    if (isSellerRef) {
      isSellerRef.on("value", (snapshot) => {
        const isSeller = snapshot.val();
        if (isMounted && isSeller !== null) {
          setIsSeller(Boolean(isSeller));
        }
      });
    }

    return () => {
      if (isSellerRef) {
        isSellerRef.off();
      }
      isMounted = false;
    };
  }, [time, userId, setIsSeller]);

  return formatElapsedTime(time);
};

const Bookings = () => {
  const [userBookingsData, setUserBookingsData] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const navigate = useNavigate(); // Move useNavigate inside the component

  useEffect(() => {
    let isMounted = true;

    const fetchBookingsData = async () => {
      try {
        if (currentUser) {
          const path = isSeller
            ? `users/${userId}/sellerProfile/bookings`
            : `users/${userId}/bookings`;

          const userRefBookings = firebase.database().ref(path);
          const bookingsSnapshot = await userRefBookings.once("value");
          const bookingsData = bookingsSnapshot.val();

          if (isMounted) {
            if (bookingsData) {
              const formattedBookings = Object.keys(bookingsData)
                .map((bookingId) => ({
                  id: bookingId,
                  propertyDetails:
                    bookingsData[bookingId].country +
                      ", " +
                      bookingsData[bookingId].state || "N/A",
                  bookingDate: bookingsData[bookingId].time || "N/A",
                  userName: bookingsData[bookingId].name || "",
                  LandlordName: bookingsData[bookingId].landlordName || "",
                  bookingStatus: bookingsData[bookingId].paid
                    ? "تم الدفع"
                    : "لم يتم الدفع",
                }))

                .sort((a, b) => b.bookingDate - a.bookingDate);

              setUserBookingsData(formattedBookings.slice(0, 4));
            } else {
              setUserBookingsData([]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching bookings data:", error);
      }
    };

    fetchBookingsData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isSeller, userId]);

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
        <span>
          {UseFormatTime(new Date(params.value), isSeller, setIsSeller)}
        </span>
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
    <section className="dashboard">
      <div
        className="container"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        {isSeller ? (
          <div className="addListingBtnDiv">
            <Link
              to="/settings/bookings/editBooking/ar"
              style={{ backgroundColor: "var(--primary-100)" }}
            >
              إنشاء حجز
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          {isSeller ? (
            <div
              className="specialBox"
              style={{
                maxWidth: "580px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img src={Icons.timeBordered} alt="أيقونة" />
              <div className="quickInfo">
                <div>
                  <span>إجمالي الحجوزات</span>
                  <span>{userBookingsData.length}</span>
                </div>
                <div>
                  <span>المعاملات الناجحة</span>
                  <span>
                    {
                      userBookingsData.filter(
                        (booking) => booking.bookingStatus === "paid"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <CustomDataTable
            tableTitle="الحجوزات الأخيرة"
            rows={userBookingsData}
            columns={bookingColumns}
            pageSize={8}
          />
        </div>
      </div>
    </section>
  );
};

export default Bookings;
