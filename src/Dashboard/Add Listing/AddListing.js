import React, { useEffect, useState } from "react";
import firebase, { uploadImage } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import Icons from "../../icons";
import Images from "../../images";
import CustomSelect from "../../customSelect";
import countries from "../../countries";
import DashboardMenu from "../DashboardMenu";
import { useNavigate } from "react-router-dom";

const AddListing = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImageUrl1, setUploadedImageUrl1] = useState("");
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState("");
  const [uploadedImageUrl3, setUploadedImageUrl3] = useState("");
  const [listingId, setListingId] = useState(0);
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
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [amenities, setAmenities] = useState([
    "Air Conditioning",
    "Electricity",
    "Balacony",
    "Heating",
    "Wifi",
    "Smart Tv",
    "Kitchen",
  ]);
  const [resturantsInput, setResturantsInput] = useState("");
  const [resturants, setResturants] = useState([
    "KFC",
    "Elayoupi",
    "Boghdadai",
    "Holmes",
  ]);
  const [transportationInput, setTransportationInput] = useState("");
  const [transportation, setTransportation] = useState(["Bus Stop"]);
  const [selectedCloseToOption, setSelectedCloseToOption] =
    useState("Close to");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          setUser(userData);
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const [publisherName, setPublisherName] = useState("");
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

  useEffect(() => {
    setListingId((prevListingId) => prevListingId + 1);
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

        // Check if the image URL already exists in any of the uploaded images
        if (
          [
            uploadedImageUrl,
            uploadedImageUrl1,
            uploadedImageUrl2,
            uploadedImageUrl3,
          ].includes(listingPhotoDownloadUrl)
        ) {
          // If it exists, reuse the existing URL
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
        } else {
          // If it's a new image, set the URL accordingly
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
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const generateUniqueId = () => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      uniqueId += charset[randomIndex];
    }
    return uniqueId;
  };

  const handleNext = () => {
    const Name = user && user.sellerProfile ? user.sellerProfile.name : "";
    const email = user && user.email ? user.email : "";
    const propertyId = generateUniqueId();
    const sellerId = user && user.sellerProfile ? user.sellerProfile.id : ""; // Extracting the seller ID
    const SellerUID = firebase.auth().currentUser.uid; // Get the SellerUID from the current authenticated user

    if (
      !description ||
      !size ||
      !bedsNumber ||
      !bathrooms ||
      !postalCode ||
      !address ||
      !states ||
      !price ||
      selectedType === "Type" ||
      selectedDate === "Lease Date" ||
      selectedCloseToOption === "Close to" ||
      selectedAmenities.length === 0 ||
      selectedFacilities.length === 0 ||
      selectedCloseTo.length === 0
    ) {
      setErrors("Please fill all inputs");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      !uploadedImageUrl ||
      !uploadedImageUrl1 ||
      !uploadedImageUrl2 ||
      !uploadedImageUrl3
    ) {
      setErrors("Please upload 4 images of the property");
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      const user = firebase.auth().currentUser;
      if (user) {
        firebase
          .database()
          .ref("MainListings")
          .once("value")
          .then((snapshot) => {
            const listingsCount = snapshot.numChildren();
            const publisherNameDef =
              user && user.sellerProfile ? user.sellerProfile.name : "";

            const propertyData = {
              id: propertyId,
              description: description,
              area: size,
              beds: bedsNumber + " beds",
              bathrooms: bathrooms + " bathrooms",
              postalCode: postalCode,
              location: states + "," + address,
              type: selectedType,
              publisher: Name,
              price: price,
              liked: false,
              info: selectedType,
              sellerEmail: email,
              time: selectedDate,
              country: selectedCountry,
              closeTo: selectedCloseToOption,
              Amenities: selectedAmenities,
              facilities: selectedFacilities,
              photo: [uploadedImageUrl],
              transportation: selectedCloseTo,
              "detailed-photos": [
                uploadedImageUrl,
                uploadedImageUrl1,
                uploadedImageUrl2,
                uploadedImageUrl3,
              ],
              postedDate: firebase.database.ServerValue.TIMESTAMP,
              sellerId: sellerId, // Add the seller ID here
              SellerUID: SellerUID, // Add the SellerUID here
              uploadedAt: Date.now(), // Add the time of upload in milliseconds
            };

            firebase
              .database()
              .ref(`/MainListings/${propertyId}`)
              .set(propertyData)
              .then(() => {
                console.log("Property data successfully saved to database");
                navigate("/settings/alllistings");
              })
              .catch((error) => {
                console.error("Error saving property data:", error);
              });
          });
      }
    }
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
            cancel
          </Link>
        </div>
        <div className="addListingBtnDiv">
          <button
            style={{ backgroundColor: "var(--primary-100)" }}
            onClick={handleNext}
          >
            save
          </button>
        </div>
      </div>
      <div className="container">
        <DashboardMenu />
        <div className="content">
          <div className="newPropertyPage">
            <div className="container">
              <div className="newPropertyContent">
                {/* Other sections */}
                {/* Images Section */}
                <div className="imgsAndVids">
                  <div className="dataUpload">
                    <div className="dataUploadHeader">
                      <p>Images</p>
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
                            <p>Add Thumbnail to property</p>
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
                    <p>Basic Info</p>
                  </div>
                  <div className="basicInfoInputs">
                    <textarea
                      rows="10"
                      cols="32"
                      placeholder="Description"
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
                          placeholder="Size"
                        />
                        <div className="unit">m²</div>
                      </div>
                    </div>
                    <div className="thirdRow">
                      <input
                        type="number"
                        value={bedsNumber}
                        min="0"
                        onChange={(e) => setBedsNumber(e.target.value)}
                        placeholder="Beds Number"
                      />
                      <input
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="Bathrooms"
                      />
                    </div>
                    <div className="aminitiesSelect">
                      <div className="customSelect aminitiesField">
                        <div className="customSelectText">
                          <input
                            type="text"
                            value={amenitiesInput}
                            onChange={(e) => setAmenitiesInput(e.target.value)}
                            placeholder="Add Amenities"
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
                            Add
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
                    <p>Location</p>
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
                        placeholder="City"
                      />
                    </div>
                    <div className="secondRow">
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="Postal Code"
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
                      placeholder="Address"
                    />
                  </div>
                </div>
                {/* Pricing Info Section */}
                <div className="pricingInfoProperty">
                  <div className="pricingInfoHeader">
                    <p>Pricing</p>
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
                        <span>$</span>usd
                      </p>
                    </div>
                    <div className="slash"></div>
                    <div className="currencyAndMonth">
                      <p>Month</p>
                    </div>
                  </div>
                </div>
                {/* Facilities Info Section */}
                <div className="facilitiesInfoProperty">
                  <div className="facilitiesInfoHeader">
                    <p>Facilities</p>
                  </div>
                  <div className="facilitiesInfoSubHeading">
                    <p>Nearby Restaurants</p>
                    <p>
                      Adding names of nearby restaurants helps students to know
                      what places around them
                    </p>
                  </div>
                  <div className="facilitiesSelect">
                    <div className="customSelect">
                      <input
                        type="text"
                        placeholder="Add Restaurant Name"
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
                        Add
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
                        placeholder="Add Transportation"
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
                        Add
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

export default AddListing;
