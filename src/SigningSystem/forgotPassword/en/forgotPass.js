import React, { useState, useEffect } from "react";
import firebase from "../../../firebaseConfig";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let errorTimeout;
    if (!emailValid && submitted) {
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false);
        setSubmitted(false);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [emailValid, submitted]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(true);

    setEmailValid(validateEmail(email));

    if (emailValid) {
      try {
        const userSnapshot = await firebase
          .database()
          .ref("users")
          .orderByChild("email")
          .equalTo(email)
          .once("value");

        if (userSnapshot.exists()) {
          await firebase.auth().sendPasswordResetEmail(email);

          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        } else {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error sending password reset email:", error.message);

        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    }
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="signInAllPage">
      <div className="signInPage">
        <div className="signInForm">
          <div className="pageHeading">
            <p>Forgot your password?</p>
            <p className="ForgotPassDetails">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          <div className="signInContent">
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  className={!emailValid && submitted ? "invalid" : ""}
                />
              </div>
              <div className="signInButton">
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className={`errorNotification ${showError ? "visible" : "hidden"}`}>
        {emailValid ? (
          <p>An email has been sent to reset your password.</p>
        ) : (
          <p>Invalid Email, Check your Email!</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
