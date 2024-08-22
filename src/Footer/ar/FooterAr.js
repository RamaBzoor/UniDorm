import "../Footer.css";
import SubAr from "./SubAr";
import UnidormInfoCardAr from "./UnidormInfoCardAr";
import Icons from "../../icons"; // Import the Icons object

const Footer = () => {
  return (
    <footer dir="rtl">
      <div className="container">
        <SubAr />
        <div className="unidormInfo">
          <UnidormInfoCardAr
            title="الدعم"
            links={[
              // {
              //   linkTxT: "111",
              //   linkHref:
              //     "https://www.google.com/maps/search/?api=1&query=111+Bijoy+Sarani,+Dhaka,+DH+1515,+Bangladesh",
              //   blank: true,
              // },
              {
                linkTxT: "unidorm616@gmail.com",
                linkHref: "mailto:unidorm616@gmail.com",
                blank: true,
              },
              {
                linkTxT: "+970599269195",
                linkHref: "tel:0599269195",
                blank: true,
              },
            ]}
          />
          <UnidormInfoCardAr
            title="الحساب"
            links={[
              { linkTxT: "حسابي", linkHref: "/settings/profile/ar" },
              { linkTxT: "تسجيل الدخول / التسجيل", linkHref: "/signin/ar" },
              // { linkTxT: "قائمة الرغبات", linkHref: "/settings/wishlist/ar" },
              { linkTxT: "السكنات", linkHref: "/properties/ar" },
            ]}
          />
          <UnidormInfoCardAr
            title="حول UniDorm"
            links={[
              { linkTxT: "الاتصال", linkHref: "/contact" },
              {
                linkTxT: "هل تريد أن تكون بائعًا؟",
                linkHref: "/listaproperty/ar",
              },
            ]}
          />
        </div>
        <div className="unidormSocial">
          <h2>تابعنا</h2>
          <div className="icons">
            <a href="https://www.facebook.com/index.php?next=https%3A%2F%2Fwww.facebook.com%2Fsettings&deoia=1&no_universal_links=1">
            <img src={Icons.facebook} alt="فيسبوك" />
            </a>
            <a href="https://x.com/?lang=ar">
            <img src={Icons.twitter} alt="تويتر" />
            </a>
            <a href="https://www.instagram.com/">
            <img src={Icons.instagram} alt="إنستغرام" />
            </a>
            <a href="https://business.linkedin.com/marketing-solutions/cx/21/11/linkedin-pages?psafe_param=1&src=go-pa&cid=&src=go-pa&trk=sem-ga_campid.13968037418_asid.128607554281_crid.534716649484_kw._d.c_tid.dsa-1210533648947_n.g_mt._geo.2275&mcid=6829211277693452295&cid=&gad_source=1&gclid=EAIaIQobChMIgfSUzIamhwMVUWxBAh0uiQOPEAAYAiAAEgK2j_D_BwE&gclsrc=aw.ds">
            <img src={Icons.linkedin} alt="لينكدإن" />
            </a>
          </div>
        </div>
        <p className="copyright">
          حقوق الطبع والنشر UniDorm 2023. جميع الحقوق محفوظة ©
        </p>
      </div>
    </footer>
  );
};

export default Footer;
