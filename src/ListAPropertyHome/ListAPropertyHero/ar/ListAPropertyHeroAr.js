import React, { useState } from "react";
import "../ListAPropertyHero.css";
import Images from "../../../images";
import GetStartedButtonAr from "../../GetStartedButton/ar/GetStartedButtonAr";

const ListAPropertyHeroAr = () => {
  return (
    <section dir="rtl" className="hero">
      <div className="container">
        <div className="text">
          <h1>هل تريد استئجار عقاراتك والحصول على المال؟</h1>
          <p>
            UniDorm هي شركة تقوم بعملية البحث عن الطلاب السكن
            <br />
            أكثر وضوحا من خلال تسهيل اكتشاف الطلاب السكن المقبول <br />
            خيارات.{" "}
          </p>
          <GetStartedButtonAr />
        </div>
        <div className="image listImgAr">
          <img src={Images.ListAPropHero} draggable="false" alt="Photo" />
        </div>
      </div>
    </section>
  );
};

export default ListAPropertyHeroAr;
