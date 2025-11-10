import React from "react";
import Image from "next/image";

const HomeBannerSection = () => {
  return (
    <div className="w-11/12 mx-auto pb-[56px] ">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Banner 1 */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/banner1.png"
            alt="Banner 1"
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-[220px] sm:h-[280px] md:h-[450px] hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* Banner 2 */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/banner2.png"
            alt="Banner 2"
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-[220px] sm:h-[280px] md:h-[450px] hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBannerSection;
