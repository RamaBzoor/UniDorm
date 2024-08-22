import * as React from "react";
import { Link } from "react-router-dom";
import DashboardMenuAr from "../DashboardMenuAr";
import "../DashboardIndex.css";
import { useState, useRef, useEffect } from "react";
import firebase, {
  uploadProfilePicture,
  uploadSellerProfilePicture,
} from "../../firebaseConfig";
import CustomSelect from "../../customSelect";
import "./DashboardProfile.css";
import { useAuth } from "../../AuthContext";
import countries from "../../countries";
import Icons from "../../icons";

const DashboardProfile = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserCountry, setSelectedUserCountry] = useState("Country");
  const [selectedSellerCountry, setSelectedSellerCountry] = useState("Country");
  const fileInputRef = useRef([]);
  const [sellerData, setSellerData] = useState({
    name: "",
    phoneNumber: "",
    country: "",
    state: "",
    profileImageURL: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [user, setUser] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const userId = currentUser.uid;
  const [paypalEmail, setPaypalEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: selectedUserCountry,
    state: "",
    address: "",
    university: "",
    major: "",
    grade: "",
    semester: "",
  });
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (isSeller) {
      setCountryCode(
        countries
          .map((c) => (selectedSellerCountry === c.name ? c.code : ""))
          .join("")
      );
    } else {
      setCountryCode(
        countries
          .map((c) => (selectedUserCountry === c.name ? c.code : ""))
          .join("")
      );
    }
  }, [selectedUserCountry, selectedSellerCountry]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUser(user);
        const userId = user.uid;
        try {
          const userRef = firebase.database().ref(`users/${userId}`);
          const snapshot = await userRef.once("value");
          const userData = snapshot.val();

          if (userData) {
            setFormData({
              name: userData.name || "",
              email: user.email || "",
              phoneNumber: userData.phoneNumber || "",
              country: userData.country || selectedUserCountry,
              state: userData.state || "",
              address: userData.address || "",
              university: userData.university || "",
              major: userData.major || "",
              grade: userData.grade || "",
              semester: userData.semester || "",
            });

            if (userData.country) {
              setSelectedUserCountry(userData.country);
            }

            if (!isSeller) {
              setImagePreview(userData.pfp);
            }

            if (userData.sellerProfile && userData.sellerProfile.paypalmail) {
              setPaypalEmail(userData.sellerProfile.paypalmail);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    const fetchSellerProfile = async () => {
      const userRef = firebase.database().ref(`users/${userId}/sellerProfile`);
      const snapshot = await userRef.once("value");
      const sellerData = snapshot.val();
      if (sellerData) {
        setSellerData({ ...sellerData, uid: userId });
        setImagePreview(sellerData.profileImageURL || "");
        setSelectedSellerCountry(sellerData.country || selectedSellerCountry);
      }
    };

    const checkIfSeller = async () => {
      const isSellerRef = firebase
        .database()
        .ref(`users/${userId}/isCurrentlySeller`);

      isSellerRef.on("value", (snapshot) => {
        const isSeller = snapshot.val();
        setIsSeller(Boolean(isSeller));
      });

      if (isSeller) {
        await fetchSellerProfile();
      }
    };

    fetchUserProfile();
    checkIfSeller();
  }, [userId, isSeller]); // Add isSeller to the dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const userId = firebase.auth().currentUser.uid;

    if (isSeller) {
      setSellerData({
        ...sellerData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  function checkInput(selector) {
    const input = document.querySelector(selector);

    input.style.border = "3px solid #ff3e3e";
  }

  function removeCheckInput(selector) {
    const input = document.querySelector(selector);

    input.style.border = "";
  }

  const handleSaveButton = (e) => {
    const userId = firebase.auth().currentUser.uid;

    if (isSeller) {
      if (sellerData.name.length > 3) {
        firebase
          .database()
          .ref(`users/${userId}/sellerProfile`)
          .update({ name: sellerData.name })
          .then(() => {
            console.log(`name updated successfully.`);
          })
          .catch((error) => {
            console.error(`Error updating name:`, error);
          });
        removeCheckInput("input[name='name']");
      } else {
        checkInput("input[name='name']");
      }

      firebase
        .database()
        .ref(`users/${userId}/sellerProfile`)
        .update({ country: selectedSellerCountry })
        .then(() => {
          console.log("Country updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating country:", error);
        });

      firebase
        .database()
        .ref(`users/${userId}/sellerProfile`)
        .update({ state: sellerData.state })
        .then(() => {
          console.log("State updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating state:", error);
        });

      firebase
        .database()
        .ref(`users/${userId}/sellerProfile`)
        .update({ phoneNumber: sellerData.phoneNumber })
        .then(() => {
          console.log("Phone Number updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating Phone Number:", error);
        });

      firebase
        .database()
        .ref(`users/${userId}/sellerProfile`)
        .update({
          numberWithCountryCode: `${countryCode}${sellerData.phoneNumber}`,
        })
        .then(() => {
          console.log("numberWithCountryCode updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating numberWithCountryCode:", error);
        });
      return;
    }

    if (formData.name.length > 3) {
      firebase
        .database()
        .ref(`users/${userId}`)
        .update({ name: formData.name })
        .then(() => {
          console.log(`name updated successfully.`);
        })
        .catch((error) => {
          console.error(`Error updating name:, error`);
        });
      removeCheckInput("input[name='name']");
    } else {
      checkInput("input[name='name']");
    }

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ country: selectedUserCountry })
      .then(() => {
        console.log("Country updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating country:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ paypalmail: paypalEmail })
      .then(() => {
        console.log("PayPal email updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating PayPal email:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ state: formData.state })
      .then(() => {
        console.log("State updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating state:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ phoneNumber: formData.phoneNumber })
      .then(() => {
        console.log("Phone number updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating Phone number:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({
        numberWithCountryCode: `${countryCode}${formData.phoneNumber}`,
      })
      .then(() => {
        console.log("Number with country code updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating Number with country code:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ address: formData.address })
      .then(() => {
        console.log("Address updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating address:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ university: formData.university })
      .then(() => {
        console.log("university updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating university:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ major: formData.major })
      .then(() => {
        console.log("major updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating major:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ grade: formData.grade })
      .then(() => {
        console.log("grade updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating grade:", error);
      });

    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ semester: formData.semester })
      .then(() => {
        console.log("semester updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating semester:", error);
      });
  };

  const selectUserCountry = (country) => {
    setSelectedUserCountry(country);
    setIsOpen(false);
  };

  const selectSellerCountry = (country) => {
    setSelectedSellerCountry(country);
    setIsOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const userId = firebase.auth().currentUser.uid;
      const uploadFunction = isSeller
        ? uploadSellerProfilePicture
        : uploadProfilePicture;
      uploadFunction(file, userId)
        .then((snapshot) => {
          if (snapshot && snapshot.ref) {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              if (downloadURL) {
                setImagePreview(downloadURL);

                if (isSeller) {
                  firebase
                    .database()
                    .ref(`users/${userId}/sellerProfile`)
                    .update({
                      profileImageURL: downloadURL,
                    })
                    .then(() => {
                      console.log(
                        "Seller's profile picture URL updated successfully."
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating seller's profile picture URL:",
                        error
                      );
                    });
                } else {
                  firebase
                    .database()
                    .ref(`users/${userId}`)
                    .update({
                      pfp: downloadURL,
                    })
                    .then(() => {
                      console.log(
                        "User's profile picture URL updated successfully."
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating user's profile picture URL:",
                        error
                      );
                    });
                }
              } else {
                console.error("Download URL is undefined");
              }
            });
          } else {
            console.error("Snapshot or snapshot.ref is undefined");
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const openFileUploadDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePaypalEmailChange = (e) => {
    setPaypalEmail(e.target.value);
  };

  return (
    <section className="dashboard">
      <div className="container">
        <div
          className="addListingBtnDiv"
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {isSeller ? (
            <Link
              to={`/profile/${sellerData.id}/ar`}
              style={{ backgroundColor: "var(--secondary-100)" }}
            >
              عرض كطالب
            </Link>
          ) : (
            ""
          )}
          <button
            style={{ backgroundColor: "var(--primary-100)" }}
            onClick={handleSaveButton}
          >
            حفظ
          </button>
        </div>
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="chooseImg" onClick={openFileUploadDialog}>
              <img
                className="imagePreview"
                src={imagePreview || sellerData.profileImageURL}
                alt="الملف الشخصي"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="dashboardProfileForm">
            <h3>المعلومات الشخصية</h3>
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              value={isSeller ? sellerData.name : formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              readOnly // Make email field read-only
            />
            <input
              type="text"
              name="countryCode"
              value={countryCode}
              onChange={handleInputChange}
              readOnly
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="رقم الهاتف"
              value={isSeller ? sellerData.phoneNumber : formData.phoneNumber}
              onChange={handleInputChange}
            />
            <CustomSelect
              selectedOption={
                isSeller ? selectedSellerCountry : selectedUserCountry
              }
              setSelectedOption={
                isSeller ? selectSellerCountry : selectUserCountry
              }
              options={countries}
            />
            <input
              type="text"
              name="state"
              placeholder="الولاية"
              value={isSeller ? sellerData.state : formData.state}
              onChange={handleInputChange}
            />
            {isSeller ? (
              ""
            ) : (
              <>
                <input
                  type="text"
                  name="address"
                  placeholder="عنوانك"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="university"
                  placeholder="الجامعة"
                  value={formData.university}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="major"
                  placeholder="التخصص"
                  value={formData.major}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="grade"
                  placeholder="الدرجة"
                  value={formData.grade}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="semester"
                  placeholder="الفصل الدراسي"
                  value={formData.semester}
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>
          {isSeller && (
            <>
              <div className="paymentMethodsCards">
                <div
                  className="paymentMethodsCard"
                  style={{ marginTop: "30px" }}
                >
                  <h4>باي بال</h4>
                  <div>
                    <span>البريد الإلكتروني</span>
                    <span>{paypalEmail}</span>
                  </div>
                </div>
              </div>
              <div className="paymentMethods">
                <h3>طرق الدفع</h3>
                <p>جميع المعاملات آمنة</p>
                <div className="paymentBox">
                  <input
                    onChange={handlePaypalEmailChange}
                    placeholder="البريد الإلكتروني لباي بال"
                    value={paypalEmail}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;
