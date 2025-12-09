import AboutSection from "@/components/Pages/Home/AboutSection";
import EarbudsProducts from "@/components/Pages/Home/EarbudsProducts";
import FastChargerProduct from "@/components/Pages/Home/FastChargerProducts";
import FeatureProducts from "@/components/Pages/Home/FeatureProducts";
// import FlashSale from "@/components/Pages/Home/FlashSale";
import HomeBannerSection from "@/components/Pages/Home/HomeBannerSection";
import HomeBannerSection2 from "@/components/Pages/Home/HomeBannerSection2";
import NeckBandProducts from "@/components/Pages/Home/NeckBandProducts";
import NeckBandProducts2 from "@/components/Pages/Home/NeckBandProducts2";
import NewArrival from "@/components/Pages/Home/NewArrival";
import NewsLetter from "@/components/Pages/Home/NewsLetter";
import PopularCategories from "@/components/Pages/Home/PopularCategories";
import PowerBankProducts from "@/components/Pages/Home/PowerBankProducts";
import PowerBankProducts2 from "@/components/Pages/Home/PowerBankProducts2";
import HeroSlider from "@/components/ui/HeroSlider";


export default function Home() {
  return (
    <div >
      <HeroSlider /> 
      <PopularCategories />
      <NewArrival/>
      <EarbudsProducts/>
      {/* <FlashSale/> */}
      <FastChargerProduct/>
      <HomeBannerSection/>
      <PowerBankProducts/>
      <NeckBandProducts/>
      <HomeBannerSection2/>
      <PowerBankProducts2/>
      <NeckBandProducts2/>
      <FeatureProducts/>
      <AboutSection/>
      <NewsLetter/>

  
    </div>
  );
}
