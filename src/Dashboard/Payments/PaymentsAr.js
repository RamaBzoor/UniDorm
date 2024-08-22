import React, { useState, useEffect } from "react";
import DashboardMenuAr from "../DashboardMenuAr";
import Icons from "../../icons";
import CustomDataTable from "../CustomDataTable";
import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import firebase from "../../firebaseConfig";

const Payments = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const navigate = useNavigate();
  const [paymentsData, setPaymentsData] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [proceededTransactions, setProceededTransactions] = useState(0);
  const [failedTransactions, setFailedTransactions] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState(0);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      try {
        const paymentsRef = firebase
          .database()
          .ref(`users/${userId}/sellerProfile/bookings`);
        paymentsRef.on("value", async (snapshot) => {
          const bookingsData = snapshot.val();
          if (bookingsData) {
            const paymentsArray = [];
            let confirmedCount = 0;
            let cancelledCount = 0;
            let pendingCount = 0;

            for (const bookingId in bookingsData) {
              const paymentData = bookingsData[bookingId].paymentData;
              if (paymentData && paymentData.studentName) {
                paymentsArray.push({
                  id: bookingId,
                  studentName: paymentData.studentName,
                  propertyDetails: paymentData.propertyData.location,
                  bookingDate: paymentData.propertyData.timeUploaded,
                  bookingStatus: paymentData.bookingStatus,
                });

                if (paymentData.bookingStatus === true) {
                  confirmedCount++;
                } else if (paymentData.bookingStatus === false) {
                  cancelledCount++;
                } else {
                  pendingCount++;
                }
              }
            }

            setPaymentsData(paymentsArray);
            setTotalTransactions(paymentsArray.length);
            setProceededTransactions(confirmedCount);
            setFailedTransactions(cancelledCount);
            setPendingTransactions(pendingCount);
          } else {
            setPaymentsData([]);
            setTotalTransactions(0);
            setProceededTransactions(0);
            setFailedTransactions(0);
            setPendingTransactions(0);
          }
        });
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };

    fetchPaymentsData();

    // Unsubscribe from Firebase on unmount
    return () => {
      firebase.database().ref(`users/${userId}/sellerProfile/bookings`).off();
    };
  }, [userId]);

  const navigateToViewBooking = (id) => {
    navigate(`/settings/bookings/${id}/viewBooking`);
  };

  const navigateToEditBooking = (id) => {
    navigate(`/settings/bookings/${id}/editBooking`);
  };

  const paymentsColumns = [
    {
      field: "studentName",
      headerName: "Student",
      width: 150,
    },
    { field: "propertyDetails", headerName: "Property Details", width: 130 },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 150,
      renderCell: (params) => {
        const bookingDate = new Date(params.value);
        return <span>{bookingDate.toLocaleDateString()}</span>;
      },
    },
    {
      field: "bookingStatus",
      headerName: "Booking Status",
      width: 130,
      renderCell: (params) => {
        let status = "";
        switch (params.value) {
          case true:
            status = "Confirmed";
            break;
          case false:
            status = "Cancelled";
            break;
          default:
            status = "Confirmed";
            // status = "Pending";
            break;
        }
        return <span>{status}</span>;
      },
    },
  ];

  return (
    <section className="dashboard wishlist">
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="specialBox"
              style={{ flexBasis: "60%", width: "640px" }}
            >
              <img src={Icons.timeBordered} alt="أيقونة" />
              <div className="quickInfo">
                <div>
                  <span>إجمالي المعاملات</span>
                  <span>{totalTransactions}</span>
                </div>
                <div>
                  <span>المعاملات المكتملة</span>
                  <span>{proceededTransactions}</span>
                </div>
                <div>
                  <span>المعاملات الفاشلة</span>
                  <span>{failedTransactions}</span>
                </div>
                <div>
                  <span>المعاملات المعلقة</span>
                  <span>{pendingTransactions}</span>
                </div>
              </div>
            </div>
            <div
              className="specialBox"
              style={{
                maxWidth: "320px",
                minWidth: "190px",
                height: "fit-content",
              }}
            >
              <img src={Icons.payments} alt="أيقونة" />
              <div className="quickInfo">
                <div>
                  <span>باي بال</span>
                </div>
              </div>
            </div>
          </div>
          <CustomDataTable
            tableTitle="جميع المعاملات"
            rows={paymentsData}
            columns={paymentsColumns}
            pageSize={8}
          />
        </div>
      </div>
    </section>
  );
};

export default Payments;
