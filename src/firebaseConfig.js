import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy1-rxysFWRV7tDmXpfx3k2tplUvVgyBI",
  authDomain: "unidorm-749a6.firebaseapp.com",
  databaseURL: "https://unidorm-749a6-default-rtdb.firebaseio.com",
  projectId: "unidorm-749a6",
  storageBucket: "unidorm-749a6.appspot.com",
  messagingSenderId: "820591789479",
  appId: "1:820591789479:web:3ef03a70beb7b2f08ee282",
  measurementId: "G-D20TKWG92T",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Enable session persistence
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    console.log("Session persistence enabled");
  })
  .catch((error) => {
    console.error("Error enabling session persistence:", error);
  });

const uploadImage = async (file, userId, listingId, boxIndex) => {
  console.log("Box Index:", boxIndex); // Log the boxIndex value

  const storageRef = firebase.storage().ref();

  // Set folder path based on box index
  let folderPath = `images/Sellers/${userId}/${listingId}/listingImages`;

  // Adjust folder path based on box index
  if (boxIndex === "thumbnail") {
    folderPath += "/Thumbnail/";
  } else {
    folderPath += `/MainBox${boxIndex.charAt(boxIndex.length - 1)}/`;
  }

  // Set image name based on box index
  let imageName;
  if (boxIndex === "thumbnail") {
    imageName = "thumb.webp";
  } else if (boxIndex === "mainBox1") {
    imageName = "mainbox1.webp";
  } else if (boxIndex === "mainBox2") {
    imageName = "mainbox2.webp";
  }

  // Upload image to the specified folder path with the specified name
  const listingPhotoRef = storageRef.child(`${folderPath}${imageName}`);
  await listingPhotoRef.put(file);

  return { listingPhotoRef };
};

const uploadProfilePicture = async (file, userId) => {
  try {
    const storageRef = firebase.storage().ref();
    const profilePictureRef = storageRef.child(
      `images/Profiles/${userId}/profilePicture.jpg`
    );
    const snapshot = await profilePictureRef.put(file);
    return snapshot; // Return the snapshot object
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

const uploadSellerProfilePicture = async (file, userId) => {
  try {
    const storageRef = firebase.storage().ref();
    const sellerProfilePictureRef = storageRef.child(
      `images/Profiles/${userId}/sellerProfilePicture.jpg`
    );
    const snapshot = await sellerProfilePictureRef.put(file);
    return snapshot; // Return the snapshot object
  } catch (error) {
    console.error("Error uploading seller profile picture:", error);
    throw error;
  }
};

export const auth = firebase.auth();
export default firebase;
export { uploadImage, uploadProfilePicture, uploadSellerProfilePicture };
