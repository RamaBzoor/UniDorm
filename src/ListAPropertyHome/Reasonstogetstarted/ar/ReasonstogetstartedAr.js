import React from "react";
import "../Reasonstogetstarted.css";
import Images from "../../../images";

const Reasonstogetstarted = () => {
  return (
    <section dir="rtl" className="reasonsToGetStarted">
      <div className="container">
        <div className="sectionHeading">
          <h2>أسباب كثيرة للبدء</h2>{" "}
        </div>
        <div className="listAProbBoxContainer">
          <div className="listAProbBox">
            <img src={Images.Reason1} alt="reason" />
            <h2>الوصول إلى المزيد من الطلاب</h2>
            <p>
              سوقنا لديه مستخدم كبير ومتزايد
              <br /> قاعدة أصحاب الحيوانات الأليفة.
            </p>
          </div>
          <div className="listAProbBox">
            <img src={Images.Reason2} alt="reason" />
            <h2>زيادة مبيعاتك</h2>
            <p>
              يُسهل سوقنا على العملاء <br /> العثور عليه والعثور عليه خصائص
              الكتاب.
            </p>
          </div>
          <div className="listAProbBox">
            <img src={Images.Reason3} alt="reason" />
            <h2>احصل على دعم خبراء النموذج</h2>
            <p>
              لدينا فريق من الخبراء الموجودين هنا من أجل
              <br /> نساعدك على النجاح في سوقنا.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reasonstogetstarted;
