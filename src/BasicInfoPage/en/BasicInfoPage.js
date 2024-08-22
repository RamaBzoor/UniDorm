import React, { useState, useRef, useEffect } from "react";
import Icons from "../../icons";
import "../BasicInfoPage.css";
import { Link } from "react-router-dom";
import CustomSelect from "../../customSelect";
import firebase, { uploadSellerProfilePicture } from "../../firebaseConfig";
import countries from "../../countries";

const BasicInfoPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [isRotated, setIsRotated] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState("");
  const [showError, setShowError] = useState("");

  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    setCountryCode(
      countries.map((c) => (selectedCountry === c.name ? c.code : "")).join("")
    );
  }, [selectedCountry]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const userId = firebase.auth().currentUser.uid;
      uploadSellerProfilePicture(file, userId)
        .then((snapshot) => {
          console.log("Snapshot:", snapshot); // Log the snapshot object
          if (snapshot && snapshot.ref) {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
              if (downloadURL) {
                setImagePreview(downloadURL);
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

  const handlePhoneNumberValidation = (phoneNumber) => {
    const isValidPhoneNumber = /^\d+$/.test(phoneNumber);
    return isValidPhoneNumber;
  };

  const generateUniqueId = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleSubmit = () => {
    const nameInput = document.querySelector(".nameInput").value;
    const phoneNumberInput = document.querySelector(".phoneNumberInput").value;
    const stateInput = document.querySelector(".stateInput").value;

    if (
      !nameInput ||
      !phoneNumberInput ||
      selectedCountry === "Country" ||
      !stateInput ||
      !imagePreview
    ) {
      setErrors("Please fill all inputs");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    const phoneNumberValid = handlePhoneNumberValidation(phoneNumberInput);

    if (!phoneNumberValid) {
      setErrors("Phone number is not valid");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    if (imagePreview) {
      const userId = firebase.auth().currentUser.uid;
      const sellerId = generateUniqueId(24); // Generate a unique ID with 24 characters
      const sellerProfile = {
        id: sellerId,
        name: nameInput,
        phoneNumber: phoneNumberInput, // Include phone number in the profile data
        numberWithCountryCode: `${countryCode}${phoneNumberInput}`, // Include phone number in the profile data
        country: selectedCountry,
        state: stateInput,
        profileImageURL: imagePreview,
      };

      firebase
        .database()
        .ref("users/" + userId + "/sellerProfile")
        .set(sellerProfile)
        .then(() => {
          firebase
            .database()
            .ref("users/" + userId)
            .update({
              Seller: true,
              isCurrentlySeller: true,
              
            })
            .then(() => {
              setErrors("");
              setShowError(false);
            })
            .catch((error) => {
              console.error("Error setting isSeller: ", error);
            });
        })
        .catch((error) => {
          console.error("Error adding seller profile: ", error);
        });
    } else {
      setErrors("Please select a profile image.");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <div className="basicInfoPage">
      <div className="container">
        <div className="back">
          <Link to="/CreateProfileAsALandLord">
            <img src={Icons.doubleArrowLeftBlack} alt="dblarr" />
            Back
          </Link>
        </div>
        <div className="basicInfoContent">
          <div className="sellerPagesHeader">
            <p>Basic Information</p>
          </div>
          <div className="chooseImg" onClick={openFileUploadDialog}>
            <img className="imagePreview" src={imagePreview} alt="Profile" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <img src={Icons.image} alt="choose image" />
            <div className="chooseImgText">
              <p>Choose Image</p>
              <img
                src={Icons.cameraBlue}
                alt="camera icon"
                onClick={openFileUploadDialog}
              />
            </div>
          </div>
          <div className="basicInfoInputs">
            <div className="personalInfoText">
              <p>Personal Info</p>
            </div>
            <div className="inputs">
              <input className="nameInput" placeholder="Name" />
              <div className="secondRow">
                <input
                  className="CountryCode"
                  type="tel"
                  value={countryCode}
                  readOnly
                  style={{ maxWidth: "170px" }}
                  placeholder="Country Code"
                />
                <input
                  className="phoneNumberInput"
                  type="tel"
                  maxLength="15"
                  pattern="[0-9]"
                  placeholder="Phone Number"
                />
              </div>
              <div className="thirdRow">
                <CustomSelect
                  selectedOption={selectedCountry}
                  setSelectedOption={setSelectedCountry}
                  options={countries}
                />
                <input className="stateInput" placeholder="State" />
              </div>
            </div>
            <div className="nextButton">
              <Link to="/settings" onClick={handleSubmit}>
                Done
                <img src={Icons.doubleArrowRightWhite} alt="next" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={`errorNotification ${showError ? "visible" : "hidden"}`}>
        <p>{errors}</p>
      </div>
    </div>
  );
};

export default BasicInfoPage;
