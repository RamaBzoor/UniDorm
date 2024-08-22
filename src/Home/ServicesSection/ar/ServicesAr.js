import React from "react";
import "../Services.css";
import Icons from "../../../icons"; // Import the Icons object from icons.js

const Services = () => {
  return (
    <section className="services">
      <div className="container">
        <div className="sectionHeading">
          <h2>خدماتنا لك</h2>
        </div>
        <div className="boxes-container">
          <div className="boxes">
            <div className="card">
              <div className="card-img">
                <img src={Icons.home} alt="" />{" "}
                {/* Use the icon from icons.js */}
              </div>
              <p className="card-title">مساحات حديثة ومريحة</p>
              <p className="card-describtion">
                شقق أنيقة ومفروشة بالكامل مصممة لراحة الطلاب.
              </p>
            </div>
            <div className="card">
              <div
                className="card-img"
                style={{ background: "rgba(85, 112, 241, 0.16)" }}
              >
                <img src={Icons.location} alt="icon" />{" "}
                {/* Use the icon from icons.js */}
              </div>
              <p className="card-title">مواقع مميزة بالقرب من الجامعات</p>
              <p className="card-describtion">
                الإيجارات ذات موقع استراتيجي بالقرب من المؤسسات التعليمية
                الكبرى.
              </p>
            </div>
            <div className="card">
              <div
                className="card-img"
                style={{ background: "rgba(248, 179, 46, 0.13)" }}
              >
                <img src={Icons.payment} alt="" />{" "}
                {/* Use the icon from icons.js */}
              </div>
              <p className="card-title">مدفوعات مريحة عبر الإنترنت</p>
              <p className="card-describtion">
                دفعات الإيجار عبر الإنترنت سهلة وآمنة لراحتك.
              </p>
            </div>
            <div className="card">
              <div
                className="card-img"
                style={{ background: "rgba(50, 147, 111, 0.13)" }}
              >
                <img src={Icons.customerService} alt="" />{" "}
                {/* Use the icon from icons.js */}
              </div>
              <p className="card-title">خدمة العملاء 24/7</p>
              <p className="card-describtion">
                دعم مخصص لمعالجة استفساراتك ومخاوفك في أي وقت.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
