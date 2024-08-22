import React, { useState, useEffect } from "react";
import Images from "../../images";
import Icons from "../../icons";
import "../contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (showError || success) {
      timeout = setTimeout(() => {
        setShowError(false);
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showError, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const constructMailTo = () => {
    const emailRecipient = "unidorm616@gmail.com";
    const subjectTitle = "You Contacted Unidorm!";
    const bodyContent = `Hi!

Your Name is: ${formData.name}

Your Phone number is: ${formData.phoneNumber}

${formData.message}`;
    return `mailto:${emailRecipient}?subject=${encodeURIComponent(
      subjectTitle
    )}&body=${encodeURIComponent(bodyContent)}`;
  };

  const handleSendMail = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (formData.name && formData.phoneNumber && formData.message) {
      const mailtoLink = constructMailTo();
      window.open(mailtoLink, "_blank");
      setSuccess(true);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="signInAllPage" dir="rtl">
      <div className="signInPage">
        <div className="imgContainer">
          <img src={Images.ShakingHands} alt="مصافحة" />
        </div>
        <div className="signInForm">
          <div className="pageHeading">
            <p>نستجيب بسرعة!</p>
          </div>
          <div className="signInContent">
            <form onSubmit={handleSendMail}>
              <div className="inputs">
                <input
                  type="text"
                  placeholder="الاسم"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="رقم الهاتف"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <textarea
                  rows="10"
                  cols="50"
                  placeholder="اكتب رسالتك"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <div className="sendButton">
                <button type="submit">
                  <img src={Icons.send} alt="أيقونة الإرسال" />
                  أرسلها!
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`errorNotification ${
            showError || success ? "visible" : "hidden"
          } ${success ? "success" : ""}`}
        >
          <p className="success">
            {!success && "يرجى ملء جميع الحقول قبل الإرسال."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
