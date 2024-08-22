import ContactOwner from "./Contact Owner Section/en/ContactOwner";
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Icons from "../icons";
import "./Payment.css";

const Payment = () => {
  const { listingId } = useParams();

  const stagesOfPayment = useRef(null);

  return (
    <>
      <div className="container">
        <h1 className="paymentNPropertyHeading" style={{ marginTop: "50px" }}>
          Home / Properties / {" "}
          <span>Booking property</span>
        </h1>
      </div>
      <div
        className="stagesOfPayment"
        data-contact="true"
        data-payment="false"
        data-review="false"
      >
        <div>
          <span>1</span>
          <span>Contact</span>
        </div>
        <div>
          <span>2</span>
          <span>Payment</span>
        </div>
        <div>
          <span>3</span>
          <span>Review</span>
        </div>
      </div>
      <ContactOwner />
      {/* <PaymentSection listingId={listingId} /> */}
    </>
  );
};

export default Payment;
