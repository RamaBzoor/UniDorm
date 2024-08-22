import React, { useState } from "react";
import Icons from "../../../icons"; // Import the Icons object from icons.js
import "../Offer.css";
import Images from "../../../images";

const Offer = () => {
  const [notification, setNotification] = useState(null);

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => setNotification("Link copied to clipboard"))
      .catch(() => setNotification("Failed to copy link"));

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleShareButtonClick = () => {
    const textToCopy = "https://www.Unidorm.com/ambas-refer-a-friend";
    copyToClipboard(textToCopy);
  };

  return (
    <section className="offer-section">
      <div className="container">
        <div className="texts">
          <p className="offer-title">Limited-Time offer</p>
          <p className="offer-subtitle">
            Spread the Word, Earn the <br /> Perks!
          </p>
          <p className="offer-description">
            Refer a Friend to <span className="brand">UniDorm</span> and you
            will get complimentary utilities <br /> including internet, water,
            or electricity in the rent!
          </p>
          <div className="link-copy">
            <p>Copy this link</p>
            <div
              className="link-container"
              onClick={() =>
                copyToClipboard("https://www.Unidorm.com/ambas-refer-a-friend")
              }
            >
              <p>
                https://www.Unidorm.com/ambas <br />
                -refer-a-friend
              </p>
              <img src={Icons.copy} alt="copy" />
            </div>
            <div className="ShareBtn" onClick={handleShareButtonClick}>
              <img src={Icons.share2} alt="" />
              <p>Share</p>
            </div>
          </div>
        </div>

        <div className="offer-image">
          <img src={Images.OfferImg} alt="offer" />
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </section>
  );
};

export default Offer;
