import PaymentSectionAr from "./Payment Section/ar/PaymentSectionAr";
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
          الرئيسية / السكنات /  {" "}
          <span>حجز السكن</span>
        </h1>
      </div>
      <div
        className="stagesOfPayment"
        ref={stagesOfPayment}
        data-contact="true"
        data-payment="true"
        data-review="false"
      >
        <div>
          <span>1</span>
          <span>الاتصال</span>
        </div>
        <div>
          <span>2</span>
          <span>الدفع</span>
        </div>
        <div>
          <span>3</span>
          <span>المراجعة</span>
        </div>
      </div>
      {/* <ContactOwner /> */}
      <PaymentSectionAr listingId={listingId} />
    </>
  );
};

export default Payment;
