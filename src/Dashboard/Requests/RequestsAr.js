import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import firebase from "../../firebaseConfig";
import DashboardMenuAr from "../DashboardMenuAr";
import CustomDataTable from "../CustomDataTable";
import IconButton from "@mui/material/IconButton";
import Icons from "../../icons";
import { useNavigate } from "react-router";

const Requests = () => {
  const { currentUser } = useAuth();
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      field: isSeller ? "userName" : "landlordName", // Adjusted to reference the correct field
      headerName: isSeller ? "طالب" : "اسم المالك",
      width: 120,
    },
    { field: "propertyDetails", headerName: "تفاصيل العقار", width: 130 },
    { field: "formattedSentAt", headerName: "تاريخ الإرسال", width: 150 },
    {
      field: "requestStatus",
      headerName: "حالة الطلب",
      width: 120,
    },
    {
      field: "action",
      headerName: "إجراء",
      width: 140,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <IconButton
            onClick={() => {
              navigate(`/settings/requests/${params.id}/viewRequest/ar`);
            }}
          >
            <img
              src={Icons.eye}
              alt="أيقونة"
              style={{ width: 16, height: 16 }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              alert(`تم النقر على زر الصف ${params.id}`);
            }}
          >
            <img
              src={Icons.delete}
              alt="أيقونة"
              style={{ width: 16, height: 16 }}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate(`/settings/requests/${params.id}/editRequest/ar`);
            }}
          >
            <img
              src={Icons.pen}
              alt="أيقونة"
              style={{ width: 16, height: 16 }}
            />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let isMounted = true;

    if (currentUser) {
      const userId = currentUser.uid;

      const isSellerRef = firebase
        .database()
        .ref(`users/${userId}/isCurrentlySeller`);
      isSellerRef.on("value", (snapshot) => {
        const isSeller = snapshot.val();
        if (isMounted && isSeller !== null) {
          setIsSeller(Boolean(isSeller));
        }
      });

      const fetchRequests = (path) => {
        firebase
          .database()
          .ref(path)
          .once("value", (snapshot) => {
            if (!isMounted) return;
            const reqsData = snapshot.val();
            if (reqsData) {
              const formattedReqs = Object.keys(reqsData).map((reqId) => ({
                id: reqId,
                landlordName: reqsData[reqId].landlordName || "Unknown",
                userName: reqsData[reqId].userName || "Unknown",
                propertyDetails: reqsData[reqId].propDetails || "N/A",
                sentAt: reqsData[reqId].sentAt, // Store the original timestamp
                formattedSentAt: formatTime(reqsData[reqId].sentAt), // Format the time for display
                requestStatus: reqsData[reqId].approved
                  ? "Approved"
                  : reqsData[reqId].declined
                  ? "Declined"
                  : "Pending",
              }));
              setRequestsData(formattedReqs);
            } else {
              setRequestsData([]);
            }
            setLoading(false);
          });
      };

      if (isSeller) {
        fetchRequests(`users/${userId}/sellerProfile/requests`);
      } else {
        fetchRequests(`users/${userId}/requests`);
      }

      return () => {
        isMounted = false;
        isSellerRef.off(); // Cleanup listener
      };
    }
  }, [currentUser, isSeller]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalRequests = requestsData.length;

  // Function to check if a request was sent within the last 24 hours
  const isWithinLast24Hours = (time) => {
    const currentTime = Date.now();
    return currentTime - time <= 86400000; // 24 hours in milliseconds
  };

  // Count requests sent within the last 24 hours
  const todaysRequests = requestsData.filter((request) =>
    isWithinLast24Hours(request.sentAt)
  ).length;

  return (
    <section className="dashboard">
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
                  <span>إجمالي الطلبات</span>
                  <span>{totalRequests}</span>
                </div>
                <div>
                  <span>طلبات اليوم</span>
                  <span>{todaysRequests}</span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <CustomDataTable
            tableTitle="الطلبات الحديثة"
            rows={requestsData}
            columns={columns}
            pageSize={8}
          />
        </div>
      </div>
    </section>
  );
};

// Function to format time for display
const formatTime = (time) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const elapsedSeconds = currentTime - Math.floor(time / 1000);

  if (elapsedSeconds < 60) {
    return "just now";
  } else if (elapsedSeconds < 3600) {
    const minutes = Math.floor(elapsedSeconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (elapsedSeconds < 86400) {
    const hours = Math.floor(elapsedSeconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (elapsedSeconds < 2592000) {
    const days = Math.floor(elapsedSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (elapsedSeconds < 31536000) {
    const months = Math.floor(elapsedSeconds / 2592000);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(elapsedSeconds / 31536000);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
};

export default Requests;
