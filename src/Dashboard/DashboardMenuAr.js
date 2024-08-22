import Icons from "../icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./DashboardIndex.css";
import { useRef, useState, useEffect } from "react";
import firebase from "../firebaseConfig";
import { useAuth } from "../AuthContext";

const DashboardMenu = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [toggleOptions, setToggleOptions] = useState(false);

  function handleToggleOptions() {
    setToggleOptions((prev) => !prev);
  }

  useEffect(() => {
    const isSellerRef = firebase
      .database()
      .ref(`users/${userId}/isCurrentlySeller`);

    isSellerRef.on("value", (snapshot) => {
      const isSeller = snapshot.val();
      setIsSeller(Boolean(isSeller));
    });
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth <= 1177) {
      handleRemovingDashboardMenu();
    }
  }, [windowWidth]);

  const dashboardMenu = useRef(null);

  function handleDashboardMenu() {
    const myButton = document.querySelector(".changePosition");
    const content = document.querySelector(".content");

    if (dashboardMenu.current.classList.toggle("disappear")) {
      myButton.style.rotate = "180deg";
      content.style.minWidth = "100%";
      content.style.translate = "-235px";
      return;
    }
    myButton.style.rotate = "0deg";
    content.style.minWidth = "";
    content.style.translate = "0";
  }

  function handleRemovingDashboardMenu() {
    const myButton = document.querySelector(".changePosition");
    const content = document.querySelector(".content");

    dashboardMenu.current.classList.add("disappear");
    myButton.style.rotate = "180deg";
    content.style.minWidth = "100%";
    content.style.translate = "-235px";
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="dashboardMenu" ref={dashboardMenu}>
      <button className="changePosition" onClick={handleDashboardMenu}>
        <img src={Icons.leftArrow} alt="تغيير موضع القائمة" />
      </button>
      <ul>
        <li>
          <NavLink
            to="/settings/ar"
            className={({ isActive }) =>
              isActive && location.pathname === "/settings/ar" ? "active" : ""
            }
          >
            <img src={Icons.dashboard} alt="أيقونة" />
            لوحة التحكم
          </NavLink>
        </li>
        {isSeller ? (
          <>
            <li>
              <button onClick={handleToggleOptions}>
                <img src={Icons.dashboardHome} alt="أيقونة" />
                العقارات
                <img
                  src={Icons.down}
                  alt="أيقونة"
                  style={
                    toggleOptions
                      ? { rotate: "-90deg", transition: "0.3s" }
                      : { transition: "0.3s" }
                  }
                />
              </button>
            </li>
            {toggleOptions && (
              <>
                <li className="specialLink">
                  <NavLink
                    to="/settings/alllistings/ar"
                    className={({ isActive }) =>
                      (isActive &&
                        location.pathname === "/settings/alllistings/ar") ||
                      location.pathname === "/settings/alllistings/ar/"
                        ? "active"
                        : ""
                    }
                  >
                    جميع العقارات
                  </NavLink>
                </li>
                <li className="specialLink">
                  <NavLink
                    to="/settings/addlisting/ar"
                    className={({ isActive }) =>
                      (isActive &&
                        location.pathname === "/settings/addlisting/ar") ||
                      location.pathname === "/settings/addlisting/ar/"
                        ? "active"
                        : ""
                    }
                  >
                    إضافة عقار
                  </NavLink>
                </li>
              </>
            )}
          </>
        ) : (
          ""
        )}
        <li>
          <NavLink to="/settings/bookings/ar" activeclassname="active">
            <img src={Icons.bookings} alt="أيقونة" />
            الحجوزات
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings/requests/ar" activeclassname="active">
            <img src={Icons.requests} alt="أيقونة" />
            الطلبات
          </NavLink>
        </li>
        {isSeller ? (
          <li>
            <NavLink
              to="/settings/payments/ar"
              className={({ isActive }) => {
                switch (location.pathname) {
                  case "/settings/payments/ar":
                  case "/settings/payments/ar/":
                    return isActive ? "active" : "";
                  default:
                    return "";
                }
              }}
            >
              <img src={Icons.payments} alt="أيقونة" />
              المدفوعات
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {!isSeller && (
          <li>
            <NavLink
              to="/settings/wishlist/ar"
              className={({ isActive }) => {
                switch (location.pathname) {
                  case "/settings/wishlist/ar":
                  case "/settings/wishlist/ar/":
                    return isActive ? "active" : "";
                  default:
                    return "";
                }
              }}
            >
              <img src={Icons.wishlist} alt="أيقونة" />
              قائمة الرغبات
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/settings/profile/ar"
            className={({ isActive }) => {
              switch (location.pathname) {
                case "/settings/profile/ar":
                case "/settings/profile/ar/":
                  return isActive ? "active" : "";
                default:
                  return "";
              }
            }}
          >
            <img src={Icons.myProfile} alt="أيقونة" />
            ملفي الشخصي
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout}>
            <img src={Icons.logOut} alt="أيقونة" />
            تسجيل الخروج
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
