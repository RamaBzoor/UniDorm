import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import firebase, { uploadImage } from "../../../firebaseConfig";
import Icons from "../../../icons";
import Images from "../../../images";
import CustomSelect from "../../../customSelect";
import countries from "../../../countries";
import DashboardMenuAr from "../../DashboardMenuAr";
import { useNavigate } from "react-router";

const EditListing = () => {
  const { listingId } = useParams();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImageUrl1, setUploadedImageUrl1] = useState("");
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState("");
  const [uploadedImageUrl3, setUploadedImageUrl3] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedCloseTo, setSelectedCloseTo] = useState([]);
  const [description, setDescription] = useState("");
  const [states, setStates] = useState("");
  const [size, setSize] = useState("");
  const [bedsNumber, setBedsNumber] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Lease Date");
  const [selectedType, setSelectedType] = useState("Type");
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [selectedCloseToOption, setSelectedCloseToOption] =
    useState("Close to");
  const [publisherName, setPublisherName] = useState("");
  const [existingListingData, setExistingListingData] = useState(null);
  const [sellerEmail, setSellerEmail] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [resturantsInput, setResturantsInput] = useState("");
  const [resturants, setResturants] = useState([]);
  const [transportationInput, setTransportationInput] = useState("");
  const [transportation, setTransportation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          setUser(userData);
          setSellerEmail(user.email);
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref(`users/${user.uid}/sellerProfile/name`)
        .once("value")
        .then((snapshot) => {
          setPublisherName(snapshot.val());
        });
    }
  }, []);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .update({
          isCurrentlySeller: true,
        })
        .then(() => {
          console.log("isCurrentlySeller updated to true");
        })
        .catch((error) => {
          console.error("Error updating isCurrentlySeller:", error);
        });
    }
  }, []);

  const updateIsCurrentlySeller = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .update({
          isCurrentlySeller: true,
        })
        .then(() => {
          console.log("isCurrentlySeller updated to true");
        })
        .catch((error) => {
          console.error("Error updating isCurrentlySeller:", error);
        });
    }
  };

  useEffect(() => {
    updateIsCurrentlySeller();
  }, []);

  useEffect(() => {
    if (listingId) {
      firebase
        .database()
        .ref(`MainListings/${listingId}`)
        .once("value")
        .then((snapshot) => {
          const listingData = snapshot.val();
          if (listingData) {
            setExistingListingData(listingData);
            setDescription(listingData.description);
            setSize(listingData.area);
            setBedsNumber(listingData.beds.split(" ")[0]);
            setBathrooms(listingData.bathrooms.split(" ")[0]);
            setPostalCode(listingData.postalCode);
            setAddress(listingData.location.split(",")[1]);
            setStates(listingData.location.split(",")[0]);
            setPrice(listingData.price);
            setSelectedType(listingData.type);
            setSelectedDate(listingData.time);
            setSelectedCountry(listingData.country);
            setSelectedCloseToOption(listingData.closeTo);
            setSelectedAmenities(listingData.Amenities);
            setSelectedFacilities(listingData.facilities);
            setSelectedCloseTo(listingData.transportation);
            setUploadedImageUrl(listingData.photo[0]);
            setUploadedImageUrl1(listingData["detailed-photos"][1]);
            setUploadedImageUrl2(listingData["detailed-photos"][2]);
            setUploadedImageUrl3(listingData["detailed-photos"][3]);
            setAmenities(listingData.Amenities);
            setResturants(listingData.facilities);
            setTransportation(listingData.transportation);
          }
        })
        .catch((error) => {
          console.error("Error fetching listing details:", error);
        });
    }
  }, [listingId]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const toggleFacility = (facility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(
        selectedFacilities.filter((item) => item !== facility)
      );
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const toggleCloseTo = (option) => {
    if (selectedCloseTo.includes(option)) {
      setSelectedCloseTo(selectedCloseTo.filter((item) => item !== option));
    } else {
      setSelectedCloseTo([...selectedCloseTo, option]);
    }
  };

  const handleImageUpload = async (event, boxIndex) => {
    const file = event.target.files[0];
    const user = firebase.auth().currentUser;

    if (user && (boxIndex === "thumbnail" || boxIndex.startsWith("mainBox"))) {
      try {
        const { listingPhotoRef } = await uploadImage(
          file,
          user.uid,
          listingId,
          boxIndex
        );

        const listingPhotoDownloadUrl = await listingPhotoRef.getDownloadURL();

        switch (boxIndex) {
          case "thumbnail":
            setUploadedImageUrl(listingPhotoDownloadUrl);
            break;
          case "mainBox1":
            setUploadedImageUrl1(listingPhotoDownloadUrl);
            break;
          case "mainBox2":
            setUploadedImageUrl2(listingPhotoDownloadUrl);
            break;
          case "mainBox3":
            setUploadedImageUrl3(listingPhotoDownloadUrl);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSave = () => {
    if (
      !description ||
      !size ||
      !bedsNumber ||
      !bathrooms ||
      !postalCode ||
      !address ||
      !price ||
      !selectedType ||
      !selectedDate ||
      !selectedCountry ||
      !selectedCloseToOption ||
      selectedAmenities.length === 0 ||
      selectedFacilities.length === 0 ||
      selectedCloseTo.length === 0 ||
      !uploadedImageUrl ||
      !uploadedImageUrl1 ||
      !uploadedImageUrl2 ||
      !uploadedImageUrl3
    ) {
      setErrors("Please fill in all required fields.");
      setShowError(true);
      return;
    }

    if (!existingListingData) {
      setErrors("Listing data is not loaded yet.");
      setShowError(true);
      return;
    }

    const currentUser = firebase.auth().currentUser;

    const listingData = {
      Amenities: selectedAmenities,
      SellerUID: existingListingData.SellerUID,
      area: size,
      bathrooms: `${bathrooms} Bathrooms`,
      beds: `${bedsNumber} Beds`,
      closeTo: selectedCloseToOption,
      country: selectedCountry,
      description,
      "detailed-photos": [
        uploadedImageUrl,
        uploadedImageUrl1,
        uploadedImageUrl2,
        uploadedImageUrl3,
      ],
      facilities: selectedFacilities,
      transportation: selectedCloseTo,
      id: existingListingData.id,
      info: selectedType,
      liked: false,
      location: `${states}, ${address}`,
      photo: [uploadedImageUrl],
      postalCode,
      postedDate: existingListingData.postedDate,
      price,
      publisher: existingListingData.publisher,
      sellerEmail,
      sellerId: existingListingData.sellerId,
      time: selectedDate,
      type: selectedType,
      uploadedAt: firebase.database.ServerValue.TIMESTAMP,
      
    };

    firebase
      .database()
      .ref(`MainListings/${listingId}`)
      .set(listingData)
      .then(() => {
        console.log("Listing updated successfully");
        setErrors("");
        setShowError(false);
      })
      .catch((error) => {
        console.error("Error updating listing:", error);
        setErrors("Error updating listing. Please try again.");
        setShowError(true);
      });

    navigate(`/properties/${listingId}`);
  };

  return (
    <section className="dashboard">
      <div
        className="container"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        <div className="addListingBtnDiv">
          <Link
            to="/settings/alllistings"
            style={{
              backgroundColor: "transparent",
              color: "#FF0404",
              border: "2px solid #FF0404",
            }}
          >
            إلغاء
          </Link>
        </div>
        <div className="addListingBtnDiv">
          <button
            style={{ backgroundColor: "var(--primary-100)" }}
            onClick={handleSave}
          >
            حفظ
          </button>
        </div>
      </div>
      <div className="container">
        <DashboardMenuAr />
        <div className="content">
          <div className="newPropertyPage">
            <div className="container">
              <div className="newPropertyContent">
                {/* Other sections */}
                {/* Images Section */}
                <div className="imgsAndVids">
                  <div className="dataUpload">
                    <div className="dataUploadHeader">
                      <p>الصور</p>
                    </div>
                    <div className="dataUploadBoxs">
                      <label htmlFor="imageUploadInput">
                        <div className="thumbBox">
                          <div>
                            <input
                              id="imageUploadInput"
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                handleImageUpload(event, "thumbnail")
                              }
                              style={{ display: "none" }}
                            />
                            {/* Render the uploaded image preview */}
                            {uploadedImageUrl ? (
                              <img
                                src={uploadedImageUrl}
                                className="UploadedPreview"
                                alt="thumbnail"
                              />
                            ) : (
                              <img src={Icons.image} alt="thumbnail" />
                            )}
                          </div>
                          <div className="textUnder">
                            <p>أضف صورة مصغرة للسكن</p>
                            <img src={Icons.cameraBlue} alt="camera icon" />
                          </div>
                        </div>
                      </label>
                      <div className="dataUploadBoxs">
                        {/* Main Box 1 */}
                        <label htmlFor="imageUploadInput1">
                          <div className="mainBox">
                            <input
                              id="imageUploadInput1"
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                handleImageUpload(event, "mainBox1")
                              }
                              style={{ display: "none" }}
                            />
                            {/* Render the uploaded image preview */}
                            {uploadedImageUrl1 ? (
                              <img
                                src={uploadedImageUrl1}
                                className="UploadedPreview"
                                alt="thumbnail"
                              />
                            ) : (
                              <img
                                src={Images.emptyUploadField}
                                alt="empty upload field"
                              />
                            )}
                          </div>
                        </label>
                        {/* Main Box 2 */}
                        <label htmlFor="imageUploadInput2">
                          <div className="mainBox">
                            <input
                              id="imageUploadInput2"
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                handleImageUpload(event, "mainBox2")
                              }
                              style={{ display: "none" }}
                            />
                            {/* Render the uploaded image preview */}
                            {uploadedImageUrl2 ? (
                              <img
                                src={uploadedImageUrl2}
                                className="UploadedPreview"
                                alt="thumbnail"
                              />
                            ) : (
                              <img
                                src={Images.emptyUploadField}
                                alt="empty upload field"
                              />
                            )}
                          </div>
                        </label>
                        <label htmlFor="imageUploadInput3">
                          <div className="mainBox">
                            <input
                              id="imageUploadInput3"
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                handleImageUpload(event, "mainBox3")
                              }
                              style={{ display: "none" }}
                            />
                            {/* Render the uploaded image preview */}
                            {uploadedImageUrl3 ? (
                              <img
                                src={uploadedImageUrl3}
                                className="UploadedPreview"
                                alt="thumbnail"
                              />
                            ) : (
                              <img
                                src={Images.emptyUploadField}
                                alt="empty upload field"
                              />
                            )}
                          </div>
                        </label>
                        {/* Add more main boxes as needed */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Basic Info Section */}
                <div className="basicInfoProperty">
                  <div className="basicInfoHeader">
                    <p>المعلومات الأساسية</p>
                  </div>
                  <div className="basicInfoInputs">
                    <textarea
                      rows="10"
                      cols="32"
                      placeholder="الوصف"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>{" "}
                    <div className="secondRow">
                      <CustomSelect
                        selectedOption={selectedType}
                        setSelectedOption={setSelectedType}
                        options={[
                          "Studio",
                          "Department",
                          "Shared Room",
                          "Private Room",
                          "Student residence",
                        ]}
                      />
                      <div
                        style={{ display: "flex", gap: "20px", width: "100%" }}
                      >
                        <input
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          type="number"
                          min="0"
                          placeholder="المساحة"
                        />
                        <div className="unit">م²</div>
                      </div>
                    </div>
                    <div className="thirdRow">
                      <input
                        type="number"
                        value={bedsNumber}
                        min="0"
                        onChange={(e) => setBedsNumber(e.target.value)}
                        placeholder="عدد الأسرة"
                      />
                      <input
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="الحمامات"
                      />
                    </div>
                    <div className="aminitiesSelect">
                      <div className="customSelect aminitiesField">
                        <div className="customSelectText">
                          <input
                            type="text"
                            value={amenitiesInput}
                            onChange={(e) => setAmenitiesInput(e.target.value)}
                            placeholder="أضف المرافق"
                            maxLength="20"
                          />
                          <button
                            onClick={() => {
                              if (amenities !== "") {
                                setAmenities((p) => [...p, amenitiesInput]);
                                setAmenitiesInput("");
                              }
                            }}
                          >
                            أضف
                          </button>
                        </div>
                      </div>
                      <div className="aminityBoxes">
                        {amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className={`aminityBox ${
                              selectedAmenities.includes(amenity)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => toggleAmenity(amenity)}
                          >
                            <p>{amenity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <CustomSelect
                      selectedOption={selectedDate}
                      setSelectedOption={setSelectedDate}
                      options={[
                        "Full Year",
                        "Semester",
                        "Academic Year",
                        "Month-to-Month",
                      ]}
                    />
                  </div>
                </div>
                {/* Location Info Section */}
                <div className="locationInfoProperty">
                  <div className="locationInfoHeader">
                    <p>الموقع</p>
                  </div>
                  <div className="locationInfoInputs">
                    <div className="firstRow">
                      <CustomSelect
                        selectedOption={selectedCountry}
                        setSelectedOption={setSelectedCountry}
                        options={countries}
                      />
                      <input
                        value={states}
                        onChange={(e) => setStates(e.target.value)}
                        placeholder="المدينة"
                      />
                    </div>
                    <div className="secondRow">
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="الرمز البريدي"
                      />
                      <CustomSelect
                        selectedOption={selectedCloseToOption}
                        setSelectedOption={setSelectedCloseToOption}
                        options={[
                          "Close to University",
                          "Neighborhood",
                          "City",
                        ]}
                      />
                    </div>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="العنوان"
                    />
                  </div>
                </div>
                {/* Pricing Info Section */}
                <div className="pricingInfoProperty">
                  <div className="pricingInfoHeader">
                    <p>التسعير</p>
                  </div>
                  <div className="pricingInfoInput">
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      type="number"
                    />
                    <div className="currencyAndMonth">
                      <p>
                        <span>$</span>USD
                      </p>
                    </div>
                    <div className="slash"></div>
                    <div className="currencyAndMonth">
                      <p>شهر</p>
                    </div>
                  </div>
                </div>
                {/* Facilities Info Section */}
                <div className="facilitiesInfoProperty">
                  <div className="facilitiesInfoHeader">
                    <p>المرافق</p>
                  </div>
                  <div className="facilitiesInfoSubHeading">
                    <p>المطاعم القريبة</p>
                    <p>
                      إضافة أسماء المطاعم القريبة يساعد الطلاب على معرفة الأماكن
                      حولهم
                    </p>
                  </div>
                  <div className="facilitiesSelect">
                    <div className="customSelect">
                      <input
                        type="text"
                        placeholder="أضف اسم المطعم"
                        value={resturantsInput}
                        onChange={(e) => setResturantsInput(e.target.value)}
                        maxLength="20"
                      />
                      <button
                        onClick={() => {
                          if (resturantsInput !== "") {
                            setResturants((p) => [...p, resturantsInput]);
                            setResturantsInput("");
                          }
                        }}
                      >
                        أضف
                      </button>
                    </div>
                    <div className="facilityBoxes">
                      {resturants.map((facility, index) => (
                        <div
                          key={index}
                          className={`facilityBox ${
                            selectedFacilities.includes(facility)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => toggleFacility(facility)}
                        >
                          <p>{facility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="facilitiesInfoSubHeading Transportation">
                    <div className="customSelect">
                      <input
                        type="text"
                        value={transportationInput}
                        onChange={(e) => setTransportationInput(e.target.value)}
                        placeholder="أضف وسائل النقل"
                        maxLength="20"
                      />
                      <button
                        onClick={() => {
                          if (transportation !== "") {
                            setTransportation((p) => [
                              ...p,
                              transportationInput,
                            ]);
                            setTransportationInput("");
                          }
                        }}
                      >
                        أضف
                      </button>
                    </div>
                  </div>
                  <div className="facilitiesSelect">
                    <div className="facilityBoxes">
                      {transportation.map((facility, index) => (
                        <div
                          key={index}
                          className={`facilityBox ${
                            selectedCloseTo.includes(facility) ? "selected" : ""
                          }`}
                          onClick={() => toggleCloseTo(facility)}
                        >
                          <p>{facility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`errorNotification ${
                  showError ? "visible" : "hidden"
                }`}
              >
                <p>{errors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditListing;
