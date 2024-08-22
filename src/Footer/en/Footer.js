import "../Footer.css";
import Sub from "./Sub";
import UnidormInfoCard from "./UnidormInfoCard";
import Icons from "../../icons"; // Import the Icons object

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <Sub />
        <div className="unidormInfo">
          <UnidormInfoCard
            title="Support"
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
          <UnidormInfoCard
            title="Account"
            links={[
              { linkTxT: "My Account", linkHref: "/settings/profile" },
              { linkTxT: "Login / Register", linkHref: "/signin" },
              // { linkTxT: "Wishlist", linkHref: "/settings/wishlist" },
              { linkTxT: "Properties", linkHref: "/properties" },
            ]}
          />
          <UnidormInfoCard
            title="About UniDorm"
            links={[
              { linkTxT: "Contact", linkHref: "/contact" },
              { linkTxT: "Want to be A seller ?", linkHref: "/listaproperty" },
            ]}
          />
        </div>
        <div className="unidormSocial">
          <h2>Follow Us</h2>
          <div className="icons">
            <a href="https://www.facebook.com/index.php?next=https%3A%2F%2Fwww.facebook.com%2Fsettings&deoia=1&no_universal_links=1">
            <img src={Icons.facebook} alt="Facebook" />
            </a>
            <a href="https://x.com/?lang=ar">
            <img src={Icons.twitter} alt="Twitter" />
            </a>
            <a href="https://www.instagram.com">
            <img src={Icons.instagram} alt="Instagram" />
            </a>
            <a href="https://business.linkedin.com/marketing-solutions/cx/21/11/linkedin-pages?psafe_param=1&src=go-pa&cid=&src=go-pa&trk=sem-ga_campid.13968037418_asid.128607554281_crid.534716649484_kw._d.c_tid.dsa-1210533648947_n.g_mt._geo.2275&mcid=6829211277693452295&cid=&gad_source=1&gclid=EAIaIQobChMIgfSUzIamhwMVUWxBAh0uiQOPEAAYAiAAEgK2j_D_BwE&gclsrc=aw.ds">
            <img src={Icons.linkedin} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <p className="copyright">
          Copyright UniDorm 2023. All right reserved ©
        </p>
      </div>
    </footer>
  );
};

export default Footer;
