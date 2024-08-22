import React, { useState, useEffect } from "react";
import Images from "../../../images";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../../icons";
import firebase from "../../../firebaseConfig";

const SignupAr = () => {
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

  useEffect(() => {
    let timer;

    const checkEmailVerification = () => {
      const user = firebase.auth().currentUser;
      if (user && !user.emailVerified && !success) {
        user.reload().then(() => {
          if (user.emailVerified) {
            firebaseSignup(user);
          }
        });
      } else if (!user && !success && submitted) {
        clearInterval(timer);
        setShowError(true);
        setErrorMsg(
          "انتهت مهلة التحقق من البريد الإلكتروني. يرجى محاولة الاشتراك مرة أخرى."
        );
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    };

    let count = 0;
    timer = setInterval(() => {
      if (count >= 60) {
        clearInterval(timer);
      }
      checkEmailVerification();
      count++;
    }, 10000);

    return () => clearInterval(timer);
  }, [name, email, success]);

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

        await userCredential.user.sendEmailVerification();

        setVerificationEmailSent(true);

        setShowError(true);
        setErrorMsg("تم إرسال بريد إلكتروني للتحقق إلى المستخدم.");
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      } catch (error) {
        if (error.code === "auth/user-token-expired") {
          setShowError(true);
          setErrorMsg(
            "انتهت صلاحية رمز المستخدم. الرجاء تسجيل الدخول مرة أخرى."
          );
        } else {
          setShowError(true);
          setErrorMsg(getErrorMessage(false, false, error.code));
        }
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } else {
      if (!emailIsValid && email.trim() !== "") {
        setEmailValid(false);
        setShowError(true);
        setErrorMsg("البريد الإلكتروني غير صالح، تحقق من بريدك الإلكتروني!");
      } else {
        setShowError(true);
        setErrorMsg(getErrorMessage(emailIsValid, !passwordsMatch));
      }

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
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

  const firebaseSignup = (user) => {
    firebase
      .database()
      .ref(`users/${user.uid}`)
      .set({
        name: name,
        email: email,
        pfp: "https://i.imgur.com/ZLJafQu.png",
        verified: true,
      })
      .then(() => {
        setErrorMsg("");
        setSuccess(true);
      })
      .catch((error) => {
        setShowError(true);
        setErrorMsg("حدث خطأ أثناء التسجيل. حاول مرة اخرى.");
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      });
  };

  const getErrorMessage = (emailInvalid, passwordsNotMatch, errorCode) => {
    let message = "";
    if (emailInvalid) {
      message = "البريد الإلكتروني غير صالح، تحقق من بريدك الإلكتروني!";
    } else if (passwordsNotMatch) {
      message = "كلمة المرور غير مطابقة";
    } else {
      switch (errorCode) {
        case "auth/email-already-in-use":
          message = "البريد الالكتروني قيد الاستخدام بالفعل";
          break;
        case "auth/invalid-email":
          message = "تنسيق البريد الإلكتروني غير صالح";
          break;
        case "auth/operation-not-allowed":
          message = "لم يتم تمكين حسابات البريد الإلكتروني/كلمة المرور";
          break;
        case "auth/weak-password":
          message = "كلمة مرور ضعيفة";
          break;
        default:
          message = "حدث خطأ غير معروف";
          break;
      }
    }
    return message;
  };
  useEffect(() => {
    if (success) {
      const successTimeout = setTimeout(() => {
        setSuccess(false);
        navigate("/ar"); // Refresh the page
        window.location.reload(); // Refresh the page
      }, 3000);
      return () => clearTimeout(successTimeout);
    }
  }, [success]);

  return (
    <div dir="rtl" className="signInAllPage">
      <div className="signInPage">
        <div className="imgContainer">
          <img src={Images.sally} alt="Sally" />
        </div>
        <div className="signInForm">
          <div className="pageHeading">
            <p>أنشئ حسابك</p>
          </div>
          <div className="signInContent">
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input
                  type="text"
                  placeholder="اسم"
                  value={name}
                  onChange={handleNameChange}
                />
                <input
                  placeholder="البريد الإلكتروني الأكاديمي"
                  value={email}
                  onChange={handleEmailChange}
                  className={!emailValid && submitted ? "invalid" : ""}
                />
                <div className="passwordInputContainer">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <img
                    src={passwordVisible ? Icons.eyeOpen : Icons.eyeClosed}
                    alt="Toggle Password Visibility"
                    style={{ right: "Auto", left: "10px" }}
                    className="passwordToggle"
                    onClick={handleTogglePasswordVisibility}
                  />
                </div>
                <div className="passwordInputContainer">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <img
                    src={
                      confirmPasswordVisible ? Icons.eyeOpen : Icons.eyeClosed
                    }
                    alt="Toggle Confirm Password Visibility"
                    className="passwordToggle"
                    style={{ right: "Auto", left: "10px" }}
                    onClick={handleToggleConfirmPasswordVisibility}
                  />
                </div>
              </div>
              <div className="signInButton">
                <button type="submit">إنشاء حساب</button>
              </div>
            </form>
            <div className="signUporIn">
              <p>
                هل لديك حساب؟ <Link to="/signin/ar"> تسجيل الدخول </Link>
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
          {success && "تم التسجيل بنجاح!"}
          {!success && errorMsg}
        </p>
      </div>
    </div>
  );
};

export default SignupAr;
