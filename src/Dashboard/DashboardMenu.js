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
        <img src={Icons.leftArrow} alt="change the menu position" />
      </button>
      <ul>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive && location.pathname === "/settings" ? "active" : ""
            }
          >
            <img src={Icons.dashboard} alt="icon" />
            Dashboard
          </NavLink>
        </li>
        {isSeller ? (
          <>
            <li>
              <button onClick={handleToggleOptions}>
                <img src={Icons.dashboardHome} alt="icon" />
                Listings
                <img
                  src={Icons.down}
                  alt="icon"
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
                    to="/settings/alllistings"
                    className={({ isActive }) =>
                      isActive && location.pathname === "/settings/alllistings"
                        ? "active"
                        : ""
                    }
                  >
                    All Listings
                  </NavLink>
                </li>
                <li className="specialLink">
                  <NavLink
                    to="/settings/addlisting"
                    className={({ isActive }) =>
                      isActive && location.pathname === "/settings/addlisting"
                        ? "active"
                        : ""
                    }
                  >
                    Add Listing
                  </NavLink>
                </li>
              </>
            )}
          </>
        ) : (
          ""
        )}
        <li>
          <NavLink to="/settings/bookings" activeclassname="active">
            <img src={Icons.bookings} alt="icon" />
            Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings/requests" activeclassname="active">
            <img src={Icons.requests} alt="icon" />
            Requests
          </NavLink>
        </li>
        {isSeller ? (
          <li>
            <NavLink
              to="/settings/payments"
              className={({ isActive }) => {
                switch (location.pathname) {
                  case "/settings/payments":
                  case "/settings/payments/":
                    return isActive ? "active" : "";
                  default:
                    return "";
                }
              }}
            >
              <img src={Icons.payments} alt="icon" />
              Payments
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {isSeller ? (
          ""
        ) : (
          <li>
            <NavLink
              to="/settings/wishlist"
              className={({ isActive }) => {
                switch (location.pathname) {
                  case "/settings/wishlist":
                  case "/settings/wishlist/":
                    return isActive ? "active" : "";
                  default:
                    return "";
                }
              }}
            >
              <img src={Icons.wishlist} alt="icon" />
              Wishlist
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/settings/profile"
            className={({ isActive }) => {
              switch (location.pathname) {
                case "/settings/profile":
                case "/settings/profile/":
                  return isActive ? "active" : "";
                default:
                  return "";
              }
            }}
          >
            <img src={Icons.myProfile} alt="icon" />
            My Profile
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout}>
            <img src={Icons.logOut} alt="icon" />
            Log-out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
