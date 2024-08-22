import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Layout from "./Layout"; // Layout components that include Nav, Footer, and Lang
import LayoutAr from "./LayoutAr"; // Layout components that include Nav, Footer, and Lang
import Home from "./Home/Home";
import HomeAr from "./Home/HomeAr";
import Properties from "./Properties/Properties";
import PropertiesAr from "./Properties/PropertiesAr";
import Profile from "./Profile/Profile";
import ProfileAr from "./Profile/ProfileAr";
import Property from "./Property/Property";
import PropertyAr from "./Property/PropertyAr";
import SignIn from "./SigningSystem/signIn/en/signIn";
import SignInAr from "./SigningSystem/signIn/ar/signInAr";
import SignUp from "./SigningSystem/signup/en/signup";
import SignupAr from "./SigningSystem/signup/ar/signupAr";
import ForgotPassword from "./SigningSystem/forgotPassword/en/forgotPass";
import ForgotPassAr from "./SigningSystem/forgotPassword/ar/forgotPassAr";
import Contact from "./contact/en/contact";
import ContactAr from "./contact/ar/contactAr";
import Payment from "./payment/Payment";
import PaymentAr from "./payment/PaymentAr";
import PaymentStageTwo from "./payment/PaymentStageTwo";
import PaymentStageTwoAr from "./payment/PaymentStageTwoAr";
import ListAPropertyHome from "./ListAPropertyHome/ListAPropertyHome";
import ListAPropertyHomeAr from "./ListAPropertyHome/ListAPropertyHomeAr";
import CreateProfileLandLord from "./CreateProfileLandlord/en/CreateProfileLandlord";
import CreateProfileLandLordAr from "./CreateProfileLandlord/ar/CreateProfileLandlordAr";
import BasicInfoPage from "./BasicInfoPage/en/BasicInfoPage";
import BasicInfoPageAr from "./BasicInfoPage/ar/BasicInfoPageAr";
import Dashboard from "./Dashboard/Dashboard";
import DashboardAr from "./Dashboard/DashboardAr";
import Bookings from "./Dashboard/Bookings/Bookings";
import BookingsAr from "./Dashboard/Bookings/BookingsAr";
import ViewBooking from "./Dashboard/Bookings/View Booking/ViewBooking";
import ViewBookingAr from "./Dashboard/Bookings/View Booking/ViewBookingAr";
import EditBooking from "./Dashboard/Bookings/Edit Booking/EditBooking";
import EditBookingAr from "./Dashboard/Bookings/Edit Booking/EditBookingAr";
import Requests from "./Dashboard/Requests/Requests";
import RequestsAr from "./Dashboard/Requests/RequestsAr";
import ViewRequest from "./Dashboard/Requests/View Request/ViewRequest";
import ViewRequestAr from "./Dashboard/Requests/View Request/ViewRequestAr";
import EditRequest from "./Dashboard/Requests/Edit Request/EditRequest";
import EditRequestAr from "./Dashboard/Requests/Edit Request/EditRequestAr";
import Wishlist from "./Dashboard/Wishlist/Wishlist";
import WishlistAr from "./Dashboard/Wishlist/WishlistAr";
import DashboardProfile from "./Dashboard/DashboardProfile/DashboardProfile";
import DashboardProfileAr from "./Dashboard/DashboardProfile/DashboardProfileAr";
import AllListings from "./Dashboard/All Listings/AllListings";
import AllListingsAr from "./Dashboard/All Listings/AllListingsAr";
import EditListing from "./Dashboard/All Listings/Edit Listing/EditListing";
import EditListingAr from "./Dashboard/All Listings/Edit Listing/EditListingAr";
import AddListing from "./Dashboard/Add Listing/AddListing";
import AddListingAr from "./Dashboard/Add Listing/AddListingAr";
import Payments from "./Dashboard/Payments/Payments";
import PaymentsAr from "./Dashboard/Payments/PaymentsAr";
import Error from "./Error";
import ErrorAr from "./ErrorAr";
import { AverageRatingProvider } from "./AverageRatingContext";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteSeller from "./PrivateRouteSeller";
import PrivateRouteUser from "./PrivateRouteUser";
import PrivateRouteNotUser from "./PrivateRouteNotUser";
import PrivateRouteUserNotSeller from "./PrivateRouteUserNotSeller";
import { BlogPage } from "./BlogPage/en/BlogPage";
import { BlogPageAr } from "./BlogPage/ar/BlogPageAr";
import NotVerifiedAr from "./notVerified/ar/NotVerifiedAr";
import NotVerified from "./notVerified/en/NotVerified";

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const containsArabic = (text) => {
      const arabicRegex = /[\u0600-\u06FF]/;
      return arabicRegex.test(text);
    };

    const applyFontFamily = () => {
      const bodyElement = document.body;
      const contentElements = document.querySelectorAll(
        "*:not(script):not(style)"
      );

      for (const element of contentElements) {
        if (containsArabic(element.innerText)) {
          bodyElement.style.fontFamily = "Cairo, sans-serif";
          return;
        }
      }

      bodyElement.style.fontFamily = "Roboto, sans-serif";
    };

    applyFontFamily();
  }, [location.pathname]);

  return (
    <AverageRatingProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <NotVerified />
              <Home />
            </Layout>
          }
        />
        <Route
          path="/properties"
          element={
            <Layout>
              <NotVerified />
              <Properties />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <NotVerified />
              <BlogPage />
            </Layout>
          }
        />
        <Route
          path="/profile/:sellerId"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/properties/:id"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Property />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/signin"
          element={
            <PrivateRouteNotUser
              element={
                <Layout>
                  <SignIn />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/signup"
          element={
            <PrivateRouteNotUser
              element={
                <Layout>
                  <SignUp />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/booknow/:listingId"
          element={
            <PrivateRouteUser
              element={
                <Layout>
                  <Payment />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/booknow/stagetwo/:listingId"
          element={
            <PrivateRouteUser
              element={
                <Layout>
                  <PaymentStageTwo />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/bookings"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Bookings />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/bookings/:bookingId/viewbooking"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <ViewBooking />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/bookings/:bookingId/editbooking"
          element={
            <PrivateRouteUser
              element={
                <Layout>
                  <EditBooking />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/requests"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Requests />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/requests/:requestId/viewrequest"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <ViewRequest />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/requests/:requestId/editrequest"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <EditRequest />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/wishlist"
          element={
            <PrivateRouteUser
              element={
                <Layout>
                  <Wishlist />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/profile"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <DashboardProfile />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/alllistings"
          element={
            <PrivateRouteSeller
              element={
                <Layout>
                  <AllListings />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/:listingId/editlisting"
          element={
            <PrivateRouteSeller
              element={
                <Layout>
                  <EditListing />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/addlisting"
          element={
            <PrivateRouteSeller
              element={
                <Layout>
                  <AddListing />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/settings/payments"
          element={
            <PrivateRouteSeller
              element={
                <Layout>
                  <Payments />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/listaproperty"
          element={
            <PrivateRouteUserNotSeller
              element={
                <Layout>
                  <ListAPropertyHome />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/createprofileasalandlord"
          element={
            <PrivateRouteUserNotSeller
              element={
                <Layout>
                  <CreateProfileLandLord />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/createprofileasalandlord/basicinfo"
          element={
            <PrivateRouteUserNotSeller
              element={
                <Layout>
                  <BasicInfoPage />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/createprofileasalandlord/basicinfo/ar"
          element={
            <PrivateRouteUserNotSeller
              element={
                <LayoutAr>
                  <BasicInfoPageAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="*"
          element={
            !location.pathname.endsWith("/ar") &&
            !location.pathname.endsWith("/ar/") ? (
              <Layout>
                <Error />
              </Layout>
            ) : (
              <LayoutAr>
                <ErrorAr />
              </LayoutAr>
            )
          }
        />
        {/* Arabic routes */}
        <Route
          path="/ar"
          element={
            <LayoutAr>
              <NotVerifiedAr />
              <HomeAr />
            </LayoutAr>
          }
        />
        <Route
          path="/properties/ar"
          element={
            <LayoutAr>
              <NotVerifiedAr />
              <PropertiesAr />
            </LayoutAr>
          }
        />
        <Route
          path="/blog/ar"
          element={
            <LayoutAr>
              <NotVerifiedAr />
              <BlogPageAr />
            </LayoutAr>
          }
        />
        <Route
          path="/properties/:id/ar"
          element={
            <LayoutAr>
              <PropertyAr />
            </LayoutAr>
          }
        />
        <Route
          path="/profile/:sellerId/ar" // translated
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <ProfileAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/signin/ar"
          element={
            <PrivateRouteNotUser
              element={
                <LayoutAr>
                  <SignInAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/signup/ar"
          element={
            <PrivateRouteNotUser
              element={
                <LayoutAr>
                  <SignupAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/forgotpassword/ar"
          element={
            <LayoutAr>
              <ForgotPassAr />
            </LayoutAr>
          }
        />
        <Route
          path="/contact/ar"
          element={
            <LayoutAr>
              <ContactAr />
            </LayoutAr>
          }
        />
        <Route
          path="/listaproperty/ar"
          element={
            <LayoutAr>
              <ListAPropertyHomeAr />
            </LayoutAr>
          }
        />
        <Route
          path="/createprofileasalandlord/ar"
          element={
            <LayoutAr>
              <CreateProfileLandLordAr />
            </LayoutAr>
          }
        />
        <Route
          path="/createprofileasalandlord/BasicInfo/ar"
          element={
            <LayoutAr>
              <CreateProfileLandLordAr />
            </LayoutAr>
          }
        />
        <Route
          path="/booknow/:listingId/ar"
          element={
            <PrivateRouteUser
              element={
                <LayoutAr>
                  <PaymentAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/booknow/stagetwo/:listingId/ar"
          element={
            <PrivateRouteUser
              element={
                <LayoutAr>
                  <PaymentStageTwoAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <DashboardAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/alllistings/ar"
          element={
            <PrivateRouteSeller
              element={
                <LayoutAr>
                  <AllListingsAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/bookings/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <BookingsAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/bookings/:bookingId/viewbooking/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <ViewBookingAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/bookings/:bookingId/editbooking/ar"
          element={
            <PrivateRouteUser
              element={
                <LayoutAr>
                  <EditBookingAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/requests/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <RequestsAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/requests/:requestId/viewrequest/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <ViewRequestAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/:listingId/editlisting/ar"
          element={
            <PrivateRouteSeller
              element={
                <LayoutAr>
                  <EditListingAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/requests/:requestId/editrequest/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <EditRequestAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/profile/ar"
          element={
            <PrivateRoute
              element={
                <LayoutAr>
                  <DashboardProfileAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/wishlist/ar"
          element={
            <PrivateRouteUser
              element={
                <LayoutAr>
                  <WishlistAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/addlisting/ar"
          element={
            <PrivateRouteSeller
              element={
                <LayoutAr>
                  <AddListingAr />
                </LayoutAr>
              }
            />
          }
        />
        <Route
          path="/settings/payments/ar"
          element={
            <PrivateRouteSeller
              element={
                <LayoutAr>
                  <PaymentsAr />
                </LayoutAr>
              }
            />
          }
        />
      </Routes>
    </AverageRatingProvider>
  );
};

export default App;
