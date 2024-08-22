import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import firebase from "../../firebaseConfig";
import "../Nav.css";
import Lang from "../../language/ar/LangAr";
import Icons from "../../icons";
import { Link } from "react-router-dom";
import Images from "../../images";

const NavAr = () => {
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
    <header dir="rtl">
      <div className="container">
        <nav>
          <NavLink
            to={window.location.pathname.includes("/ar") ? "/ar" : "/"}
            className="Logo"
          >
            <img className="LogoImage" src={Icons.logo} alt="الشعار" />
          </NavLink>
          <div className="gathered">
            <ul>
              <li>
                <NavLink to="/ar" activeclassname="active" onClick={closeMenu}>
                  الرئيسية
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/properties/ar"
                  activeclassname="active"
                  onClick={closeMenu}
                >
                  السكنات
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog/ar">مدونة</NavLink>
              </li>
              <li>
                <NavLink to="/contact/ar" activeclassname="active">
                  تواصل معنا
                </NavLink>
              </li>
            </ul>
            <div className="notSignedIn">
              {!seller ? (
                <Link
                  className="listAProp"
                  to={"/listaproperty/ar"}
                  onClick={closeMenu}
                >
                  إدراج سكن
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
                    alt="الملف الشخصي"
                  />
                  {user.isCurrentlySeller ? (
                    user.sellerProfile ? (
                      <Link
                        to={`/settings/ar`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.sellerProfile.name}
                      </Link>
                    ) : (
                      <p>اسم الملف الشخصي للبائع</p>
                    )
                  ) : (
                    <Link
                      to={`/settings/ar`}
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
                    alt="التبديل"
                  />
                  <div
                    className={`myProfileMenu ${
                      showProfileMenu ? "" : "myProfileMenuHidden"
                    } `}
                  >
                    {user && seller && user.isCurrentlySeller ? (
                      <Link to="#" onClick={() => switchRole("student")}>
                        التبديل إلى طالب
                      </Link>
                    ) : (
                      user &&
                      seller && (
                        <Link to="#" onClick={() => switchRole("seller")}>
                          التبديل إلى بائع
                        </Link>
                      )
                    )}
                    <Link to="/forgotpassword/ar">إعادة تعيين كلمة المرور</Link>
                    <Link onClick={handleSignOut}>تسجيل الخروج</Link>
                  </div>
                </div>
              ) : (
                <Link className="signIn" to={"/signin/ar"}>
                  تسجيل الدخول
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
                      alt="الملف الشخصي"
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
                        <p>اسم الملف الشخصي للبائع</p>
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
                      alt="التبديل"
                    />
                    <div
                      className={`myProfileMenu ${
                        showProfileMenu ? "" : "myProfileMenuHidden"
                      } `}
                    >
                      {user && seller && user.isCurrentlySeller ? (
                        <Link to="#" onClick={() => switchRole("student")}>
                          التبديل إلى طالب
                        </Link>
                      ) : (
                        user &&
                        seller && (
                          <Link to="#" onClick={() => switchRole("seller")}>
                            التبديل إلى بائع
                          </Link>
                        )
                      )}
                      <Link to="/forgotpassword">إعادة تعيين كلمة المرور</Link>
                      <Link onClick={handleSignOut}>تسجيل الخروج</Link>
                    </div>
                  </div>
                ) : (
                  <Link className="signIn" to={"/signin"} onClick={closeMenu}>
                    تسجيل الدخول
                  </Link>
                )}
                {!seller && (
                  <Link
                    className="listAProp"
                    to={"/listaproperty/ar"}
                    onClick={closeMenu}
                  >
                    إدراج سكن
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
                  الرئيسية
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/properties"
                  activeclassname="active"
                  onClick={closeMenu}
                >
                  السكنات
                </NavLink>
              </li>
              <li>
                <a href="#" onClick={closeMenu}>
                  مدونة
                </a>
              </li>
              <li>
                <NavLink to="/contact" onClick={closeMenu}>
                  الاتصال
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavAr;
