import AboutBanner from "./AboutBanner";
import Commitment from "./Commitment";
import Features from "./Features";
import FutureVision from "./FutureVision";
import MarqueeGallery from "./MarqueeGallery";
import MissonVission from "./MissonVission";
import NewsLetter from "./NewsLetter";


export default function Page() {
  return (
    <div className="w-11/12 mx-auto py-12">
     <AboutBanner/>
     <MissonVission/>
     <FutureVision/>
     <Commitment/>
     <Features/>
     <MarqueeGallery/>
     <NewsLetter/>

    </div>
  );
}
