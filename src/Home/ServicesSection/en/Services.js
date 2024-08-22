import React from "react";
import "../Services.css";

const Services = () => {
  return (
    <section className="services">
      <div className="sectionHeading">
        <h2>Our services for you</h2>
      </div>
      <div className="boxes-container">
        <div className="boxes">
          <div className="card">
            <div className="card-img">
              <img src="./images/icons/fi_home (2).svg" alt="" />
            </div>
            <p className="card-title">Modern and Comfortable Spaces</p>
            <p className="card-describtion">
              Stylish, fully furnished apartments designed for student comfort.
            </p>
          </div>
          <div className="card">
            <div
              className="card-img"
              style={{ background: "rgba(85, 112, 241, 0.16)" }}
            >
              <img src="./images/icons/Location.svg" alt="" />
            </div>
            <p className="card-title">Prime Locations Near Universities</p>
            <p className="card-describtion">
              Strategically located rentals in proximity to major educational
              institutions
            </p>
          </div>
          <div className="card">
            <div
              className="card-img"
              style={{ background: "rgba(248, 179, 46, 0.13)" }}
            >
              <img src="./images/icons/payment.svg" alt="" />
            </div>
            <p className="card-title">Convenient Online Payments</p>
            <p className="card-describtion">
              Effortless and secure online rent payments for your convenience.{" "}
            </p>
          </div>
          <div className="card">
            <div
              className="card-img"
              style={{ background: "rgba(50, 147, 111, 0.13)" }}
            >
              <img src="./images/icons/customer-service.svg" alt="" />
            </div>
            <p className="card-title">Customer Service 24/7</p>
            <p className="card-describtion">
              Dedicated support to address your queries and concerns anytime.{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
