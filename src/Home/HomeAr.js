import HeroSectionAr from "./Hero Section/ar/HeroSectionAr";
import PropertiesAr from "./Properties Section/ar/PropertiesAr";
import PropertiesNearYouAr from "./Properties Near you section/ar/PropertiesNearYouAr";
import ServicesAr from "./ServicesSection/ar/ServicesAr";
import OfferAr from "./Offer Section/ar/OfferAr";
import BlogSectionAr from "./Blog Section/ar/BlogSectionAr";

const HomeAr = () => {
  return (
    <div dir="rtl">
      <HeroSectionAr />
      <PropertiesAr />
      <PropertiesNearYouAr />
      <ServicesAr />
      <OfferAr />
      <BlogSectionAr />
    </div>
  );
};

export default HomeAr;
