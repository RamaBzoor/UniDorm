import React from "react";
import "../CreateProfileLandlord.css";
import Icons from "../../icons";
import { Link } from "react-router-dom";

const CreateProfileLandlord = () => {
  return (
    <div dir="rtl" className="createProfileLandlordPage">
      <div className="container">
        <div className="createProfileLandlord">
          <div className="heading">
            <p>قم بإنشاء ملف التعريف الخاص بك كمالك</p>
          </div>
          <div className="pageContent">
            <div className="contentBox">
              <div className="text">
                <p>معلومات اساسية</p>
                <p>الاسم والخصائص والوصف وجهات الاتصال والجولات</p>
              </div>
              <img style={{ rotate: "180deg" }} src={Icons.arrowRight} />
            </div>
            <div className="contentBox">
              <div className="text">
                <p>عقاراتك</p>
                <p>الصور والمرافق والمرافق والأوصاف</p>
              </div>
              <img style={{ rotate: "180deg" }} src={Icons.arrowRight} />
            </div>
            <div className="contentBox">
              <div className="text">
                <p>بيانات الدفع</p>
              </div>
              <img style={{ rotate: "180deg" }} src={Icons.arrowRight} />
            </div>
          </div>
          <Link to="/CreateProfileAsALandLord/BasicInfo/ar">
            ابدأ الآن
            <img src={Icons.leftArrowWhite} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileLandlord;
