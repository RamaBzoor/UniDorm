import React from "react";
import Images from "../../../images";
import "../HowToBegin.css";

const HowToBegin = () => {
  return (
    <section dir="rtl" className="howToBegin">
      <div className="container">
        <div className="sectionHeading">
          <h2>كيف تبدأ عملك</h2>{" "}
        </div>
        <div className="listAProbBoxContainer listAProbBoxContainerAr">
          <div className="listAProbBox">
            <img src={Images.PhoneProfile} alt="reason" />
            <h2>اصنع حسابك الشخصي</h2>
            <p>
              اسم عملك، <br /> معلومات الاتصال، ملخص وصف ل
              <br /> خدماتهم..
            </p>
          </div>
          <img src={Images.Line} />
          <div className="listAProbBox">
            <img src={Images.onRock} alt="reason" />
            <h2>احصل على عمل</h2>
            <p>
              استقبال طلبات الطلاب
              <br /> والتواصل معهم.
            </p>
          </div>
          <img src={Images.Line} />
          <div className="listAProbBox">
            <img src={Images.Coins} alt="reason" />
            <h2>الحصول على أموال</h2>
            <p>
              سيقوم الطلاب بحجز <br />
              الممتلكات الخاصة بك ودفع ثمنها.{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBegin;
