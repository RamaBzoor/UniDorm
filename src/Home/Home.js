import HeroSection from "./Hero Section/en/HeroSection";
import PropertiesSection from "./Properties Section/en/Properties";
import PropertiesNearYou from "./Properties Near you section/en/PropertiesNearYou";
import Services from "./ServicesSection/en/Services";
import Offer from "./Offer Section/en/Offer";
import BlogSection from "./Blog Section/en/BlogSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <PropertiesSection />
      <PropertiesNearYou />
      <Services />
      <Offer />
      <BlogSection />
    </>
  );
};

export default Home;
