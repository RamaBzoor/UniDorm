import React, { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import firebase from "../../firebaseConfig";
import "../Nav.css";
import Lang from "../../language/en/Lang";
import Icons from "../../icons";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [seller, setSeller] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setIsLoading(false);
      if (user) {
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          setUser({ ...userData, uid: user.uid });

          // Fetch seller data
          const userRefSeller = firebase
            .database()
            .ref(`users/${user.uid}/Seller`);
          userRefSeller.once("value", (snapshot) => {
            setSeller(!!snapshot.val());
          });
        });
      } else {
        setUser(null);
        setSeller(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setIsRotated(!isRotated);
  };

  const handleSignOut = () => {
    firebase.auth().signOut();
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const switchRole = (newRole) => {
    if (user) {
      const userId = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref("users/" + userId)
        .update({
          isCurrentlySeller: newRole === "seller",
        })
        .then(() => {
          setUser({ ...user, isCurrentlySeller: newRole === "seller" });
        });
    }
  };

  return (
    <header>
      <div className="container">
        <nav>
          <NavLink
            to={window.location.pathname.includes("/ar") ? "/ar" : "/"}
            className="Logo"
          >
            <img className="LogoImage" src={Icons.logo} alt="logo" />
          </NavLink>
          <div className="gathered">
            <ul>
              <li>
                <NavLink to="/" activeclassname="active" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/properties"
                  activeclassname="active"
                  onClick={closeMenu}
                >
                  Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" activeclassname="active">
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" activeclassname="active">
                  Contact
                </NavLink>
              </li>
            </ul>
            <div className="notSignedIn">
              {!seller ? (
                <Link
                  className="listAProp"
                  to="/listaproperty"
                  onClick={closeMenu}
                >
                  list a property
                </Link>
              ) : null}
              {user ? (
                <div className="myProfile" onClick={toggleProfileMenu}>
                  <img
                    className="Defaultpfp"
                    src={
                      user.isCurrentlySeller
                        ? user.sellerProfile
                          ? user.sellerProfile.profileImageURL
                          : null
                        : user.pfp
                    }
                    alt="profile"
                  />
                  {user.isCurrentlySeller ? (
                    user.sellerProfile ? (
                      <Link
                        to={`/settings`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.sellerProfile.name}
                      </Link>
                    ) : (
                      <p>Seller Profile Name</p>
                    )
                  ) : (
                    <Link to={`/settings`} onClick={(e) => e.stopPropagation()}>
                      {user.name}
                    </Link>
                  )}
                  <img
                    src={Icons.down}
                    className={`${showProfileMenu ? "open" : ""} ${
                      isRotated ? "rotated" : ""
                    }`}
                    alt="toggle"
                  />
                  <div
                    className={`myProfileMenu ${
                      showProfileMenu ? "" : "myProfileMenuHidden"
                    } `}
                  >
                    {user && seller && user.isCurrentlySeller ? (
                      <Link to="#" onClick={() => switchRole("student")}>
                        Switch to Student
                      </Link>
                    ) : (
                      user &&
                      seller && (
                        <Link to="#" onClick={() => switchRole("seller")}>
                          Switch to Seller
                        </Link>
                      )
                    )}
                    <Link to="/forgotpassword">Reset Your Password</Link>
                    <Link onClick={handleSignOut}>Sign Out</Link>
                  </div>
                </div>
              ) : (
                <Link className="signIn" to={"/signin"}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="menu" onClick={toggleMenu}>
            <div className={`bar${isOpen ? " open" : ""}`}></div>
            <div className={`bar${isOpen ? " open" : ""}`}></div>
            <div className={`bar${isOpen ? " open" : ""}`}></div>
          </div>
          <div className={`menuScreen ${isOpen ? "open" : ""}`}>
            <div
              className="container mobileContainer"
              style={{ display: "flex", gap: "20px", paddingTop: "15px" }}
            >
              <Lang container={false} />
              <div className="notSignedIn" style={{}}>
                {user ? (
                  <div className="myProfile" onClick={toggleProfileMenu}>
                    <img
                      className="Defaultpfp"
                      src={
                        user.isCurrentlySeller
                          ? user.sellerProfile
                            ? user.sellerProfile.profileImageURL
                            : null
                          : user.pfp
                      }
                      alt="profile"
                    />
                    {user.isCurrentlySeller ? (
                      user.sellerProfile ? (
                        <Link
                          to={`/settings`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {user.sellerProfile.name}
                        </Link>
                      ) : (
                        <p>Seller Profile Name</p>
                      )
                    ) : (
                      <Link
                        to={`/settings`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.name}
                      </Link>
                    )}
                    <img
                      src={Icons.down}
                      className={`${showProfileMenu ? "open" : ""} ${
                        isRotated ? "rotated" : ""
                      }`}
                      alt="toggle"
                    />
                    <div
                      className={`myProfileMenu ${
                        showProfileMenu ? "" : "myProfileMenuHidden"
                      } `}
                    >
                      {user && seller && user.isCurrentlySeller ? (
                        <Link to="#" onClick={() => switchRole("student")}>
                          Switch to Student
                        </Link>
                      ) : (
                        user &&
                        seller && (
                          <Link to="#" onClick={() => switchRole("seller")}>
                            Switch to Seller
                          </Link>
                        )
                      )}
                      <Link to="/forgotpassword">Reset Your Password</Link>
                      <Link onClick={handleSignOut}>Sign Out</Link>
                    </div>
                  </div>
                ) : (
                  <Link className="signIn" to={"/signin"} onClick={closeMenu}>
                    Sign In
                  </Link>
                )}
                {!seller && (
                  <Link
                    className="listAProp"
                    to="/listaproperty"
                    onClick={closeMenu}
                  >
                    list a property
                  </Link>
                )}
              </div>
            </div>
            <ul>
              <li>
                <NavLink
                  exact
                  to="/"
                  activeclassname="active"
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/properties"
                  activeclassname="active"
                  onClick={closeMenu}
                >
                  Properties
                </NavLink>
              </li>
              <li>
                <a href="#" onClick={closeMenu}>
                  Blog
                </a>
              </li>
              <li>
                <NavLink to="/contact" onClick={closeMenu}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
