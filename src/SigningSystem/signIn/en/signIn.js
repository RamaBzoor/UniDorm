import React, { useState, useEffect } from "react";
import Images from "../../../images";
import "../../SigningSystem.css";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../../icons";
import firebase from "../../../firebaseConfig";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let errorTimeout;
    if (!emailValid && submitted) {
      setShowError(true);
      setEmail("");
      setPassword("");
      errorTimeout = setTimeout(() => {
        setShowError(false);
        setSubmitted(false);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [emailValid, submitted]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {});

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(true);

    setEmailValid(validateEmail(email));

    if (emailValid) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);

        setEmail("");
        setPassword("");

        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Error signing in:", error.message);

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

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="signInAllPage">
      <div className="signInPage">
        <div className="imgContainer">
          <img src={Images.sally} alt="Sally" />
        </div>
        <div className="signInForm">
          <div className="pageHeading">
            <p>Sign In</p>
          </div>
          <div className="signInContent">
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  placeholder="Academic Email"
                  value={email}
                  onChange={handleEmailChange}
                  className={!emailValid && submitted ? "invalid" : ""}
                />
                <div className="passwordInputContainer">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <img
                    src={passwordVisible ? Icons.eyeOpen : Icons.eyeClosed}
                    alt="Toggle Password Visibility"
                    className="passwordToggle"
                    onClick={handleTogglePasswordVisibility}
                  />
                </div>
                <Link to="/forgotPassword" className="forgotPassword">
                  Forgot password ?
                </Link>
              </div>
              <div className="signInButton">
                <button type="submit">Sign in</button>
              </div>
            </form>
            <div className="signUporIn">
              <p>
                Don’t have an account ? <Link to="/signup"> sign up </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`errorNotification ${
          showError || success ? "visible" : "hidden"
        } ${success ? "success" : ""}`}
      >
        <p className="success">
          {success && "Signed in successfully!"}
          {!success && "Invalid Email or Password. Please try again."}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
