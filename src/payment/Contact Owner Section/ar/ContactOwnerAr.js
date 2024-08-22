import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../ContactOwner.css";

const ContactOwner = () => {
  const { listingId } = useParams();
  const [errors, setErrors] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    numberOfRooms: "",
    leaseDate: "",
    month: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, numberOfRooms, leaseDate, message } =
      formData;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !numberOfRooms ||
      !leaseDate ||
      !message
    ) {
      setErrors("All fields are required.");
      setShowError(true);

      // Hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } else {
      setShowError(false);
      setErrors("");
      // Navigate to the next page with form data
      navigate(`/booknow/stageTwo/${listingId}/ar`, { state: { formData } });
    }
  };

  return (
    <section className="contactOwner">
      <div className="contactOwnerHeading">
        <h2>الاتصال بالمالك</h2>
        <p>ستساعد هذه المعلومات المالك على فهم احتياجاتك</p>
      </div>
      <div className="contactOwnerForm">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="الاسم"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="البريد الإلكتروني"
        />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="رقم الهاتف"
        />
        <input
          type="number"
          name="numberOfRooms"
          value={formData.numberOfRooms}
          onChange={handleChange}
          placeholder="عدد الأسرّة"
        />
        <input
          type="text"
          name="leaseDate"
          value={formData.leaseDate}
          onChange={handleChange}
          placeholder="تاريخ الإيجار"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="الرسالة"
        ></textarea>
      </div>
      <div className="nextBtnContainer">
        <Link to="#" onClick={handleNextClick}>
          التالي
        </Link>
      </div>
      <div className={`errorNotification ${showError ? "visible" : "hidden"}`}>
        <p>{errors}</p>
      </div>
    </section>
  );
};

export default ContactOwner;
