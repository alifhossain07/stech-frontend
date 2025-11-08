import EarbudsProducts from "@/components/Pages/Home/EarbudsProducts";
import NewArrival from "@/components/Pages/Home/NewArrival";
import PopularCategories from "@/components/Pages/Home/PopularCategories";
import HeroSlider from "@/components/ui/HeroSlider";


export default function Home() {
  return (
    <div >
      <HeroSlider /> 
      <PopularCategories />
      <NewArrival/>
      <EarbudsProducts/>

  
    </div>
  );
}
