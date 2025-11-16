import AboutBanner from "./AboutBanner";
import Commitment from "./Commitment";
import FutureVision from "./FutureVision";
import MissonVission from "./MissonVission";


export default function Page() {
  return (
    <div className="w-11/12 mx-auto py-12">
     <AboutBanner/>
     <MissonVission/>
     <FutureVision/>
     <Commitment/>

    </div>
  );
}
