import React, { useState } from "react";
import Icons from "../../../icons"; // Import the Icons object from icons.js
import "../Offer.css";
import Images from "../../../images";

const Offer = () => {
  const [notification, setNotification] = useState(null);

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => setNotification("تم نسخ الرابط إلى الحافظة"))
      .catch(() => setNotification("فشل نسخ الرابط"));

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
          <p className="offer-title">عرض لوقت محدود</p>
          <p className="offer-subtitle">
            انشر الموقع، واكسب <br />
            الامتيازات!
          </p>
          <p className="offer-description">
            قم بإحالة صديق إلى <span className="brand">UniDorm</span> وأنت سوف
            تحصل على مرافق مجانية <br /> بما في ذلك الإنترنت والمياه، أو
            الكهرباء في الإيجار!
          </p>
          <div className="link-copy">
            <p>انسخ هذا الرابط</p>
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
              <img
                src={Icons.copy}
                style={{
                  left: "0",
                  right: "auto",
                  marginLeft: "28px",
                  marginRight: "0",
                }}
                alt="copy"
              />
            </div>
            <div className="ShareBtn" onClick={handleShareButtonClick}>
              <img
                src={Icons.share2}
                style={{
                  marginLeft: "28px",
                  marginRight: "0",
                }}
                alt=""
              />
              <p>شارك</p>
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
