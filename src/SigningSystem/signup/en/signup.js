import React, { useState, useEffect } from "react";
import Images from "../../../images";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../../icons";
import firebase from "../../../firebaseConfig";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let errorTimeout;
    if ((!emailValid || !passwordsMatch) && submitted) {
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false);
        setSubmitted(false);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [emailValid, passwordsMatch, submitted]);

  useEffect(() => {
    if (success) {
      const successTimeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(successTimeout);
    }
  }, [success]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailIsValid = validateEmail(email);
    const passwordsMatch = password === confirmPassword;

    if (emailIsValid && passwordsMatch) {
      setSubmitted(true);

      try {
        const userCredential = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);

        const user = userCredential.user;

        // Save user data to the Realtime Database
        await firebase.database().ref(`users/${user.uid}`).set({
          name: name,
          email: email,
          pfp: "https://i.imgur.com/ZLJafQu.png",
          verified: false,
          isCurrentlySeller: false,
          Seller: false,
        });

        await user.sendEmailVerification();

        setVerificationEmailSent(true);
        setShowError(true);
        setErrorMsg("Verification email sent to user.");

        const intervalId = setInterval(async () => {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(intervalId);
            updateVerificationStatus(user.uid);
          }
        }, 1000);

        // Stop checking after 10 minutes
        setTimeout(() => clearInterval(intervalId), 600000);

        setTimeout(() => {
          setShowError(false);
        }, 3000);
      } catch (error) {
        console.error("Error signing up:", error.message);
        handleAuthError(error);
      }
    } else {
      handleValidationError(emailIsValid, passwordsMatch);
    }
  };

  const handleAuthError = (error) => {
    let message;
    if (error.code === "auth/user-token-expired") {
      message = "User token expired. Please sign in again.";
    } else {
      message = getErrorMessage(false, false, error.code);
    }
    setShowError(true);
    setErrorMsg(message);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const handleValidationError = (emailIsValid, passwordsMatch) => {
    if (!emailIsValid && email.trim() !== "") {
      setEmailValid(false);
      setShowError(true);
      setErrorMsg("Invalid Email, Check your Email!");
    } else {
      setShowError(true);
      setErrorMsg(getErrorMessage(emailIsValid, !passwordsMatch));
    }

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);

    const isValid = validateEmail(value);
    setEmailValid(isValid);
  };

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateVerificationStatus = (userId) => {
    firebase
      .database()
      .ref(`users/${userId}`)
      .update({ verified: true })
      .then(() => {
        setErrorMsg("");
        setSuccess(true);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating verification status:", error.message);

        setShowError(true);
        setErrorMsg("Error updating verification status. Please try again.");
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  };

  const getErrorMessage = (emailInvalid, passwordsNotMatch, errorCode) => {
    let message = "";
    if (emailInvalid) {
      message = "Invalid Email, Check your Email!";
    } else if (passwordsNotMatch) {
      message = "Passwords do not match";
    } else {
      switch (errorCode) {
        case "auth/email-already-in-use":
          message = "Email is already in use";
          break;
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/operation-not-allowed":
          message = "Email/password accounts are not enabled";
          break;
        case "auth/weak-password":
          message = "Weak password";
          break;
        default:
          message = "Unknown error occurred";
          break;
      }
    }
    return message;
  };

  return (
    <div className="signInAllPage">
      <div className="signInPage">
        <div className="imgContainer">
          <img src={Images.sally} alt="Sally" />
        </div>
        <div className="signInForm">
          <div className="pageHeading">
            <p>Create your account</p>
          </div>
          <div className="signInContent">
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                />
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
                    src={passwordVisible ? Icons.eyeOpen: Icons.eyeClosed}
                    alt="Toggle Password Visibility"
                    className="passwordToggle"
                    onClick={handleTogglePasswordVisibility}
                  />
                </div>
                <div className="passwordInputContainer">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <img
                    src={
                      confirmPasswordVisible ? Icons.eyeOpen : Icons.eyeClosed
                    }
                    alt="Toggle Confirm Password Visibility"
                    className="passwordToggle"
                    onClick={handleToggleConfirmPasswordVisibility}
                  />
                </div>
              </div>
              <div className="signInButton">
                <button type="submit">Create account</button>
              </div>
            </form>
            <div className="signUporIn">
              <p>
                Already Have an account? <Link to="/signin"> sign In </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
