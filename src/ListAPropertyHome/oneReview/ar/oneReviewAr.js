import React from "react";
import Images from "../../../images";
import "../oneReview.css";
import Icons from "../../../icons";

const oneReview = () => {
  return (
    <section dir="rtl" className="oneReviewSection">
      <div className="container">
        <div className="imgContainer imgContainerAr">
          <img src={Images.oneReview} alt="ReviewImg" />
        </div>
        <div className=" reviewTextAr">
          <img src={Icons.quote} alt="Quote" />
          <p>
            لقد استخدمت Unidorm وكانت تجربة رائعة. كان لدي الكثير من الطلاب
            الذين يستأجرون ممتلكاتي في كندا وقد وصلت إليهم من خلالهم هذا الموقع.
            أنا حقا أحب اليونيدورم.{" "}
          </p>
          <p>آدم محمد</p>
        </div>
      </div>
    </section>
  );
};

export default oneReview;
