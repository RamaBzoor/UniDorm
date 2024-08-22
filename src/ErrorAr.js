import React from "react";
import { Link } from "react-router-dom";
import Images from "./images";
import Icons from "./icons";

const Error = () => {
  return (
    <div className="error404Container">
      <img src={Images.Error} alt="خطأ" />
      <div className="errorText">
        <h3>عذرًا! الصفحة غير موجودة</h3>
        <p>
          قد تكون الصفحة التي تبحث عنها قد أُزيلت
          <br />
          أو غير متوفرة مؤقتًا.
        </p>
      </div>
      <Link to="/ar">
        العودة إلى الصفحة الرئيسية
        <img src={Icons.whiteRight} alt="يمين" />
      </Link>
    </div>
  );
};

export default Error;
