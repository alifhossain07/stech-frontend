"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

type Banner = {
  photo: string;
  url?: string;
};

export default function HomeBannerSection2() {
  const [bottomBanners, setBottomBanners] = useState<Banner[]>([]);

  useEffect(() => {
    axios.get("/api/banners").then((res) => {
      setBottomBanners(res.data.bottomBanners || []);
    });
  }, []);

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="flex flex-col md:flex-row gap-4">

        {/* Banner 1 */}
        <div className="w-full md:w-1/2">
          {bottomBanners[0] && (
            <Image
              src={bottomBanners[0].photo}
              alt="Bottom Banner 1"
              width={600}
              height={400}
              className="rounded-xl object-cover w-full h-[220px] sm:h-[280px] md:h-[450px] hover:scale-[1.02] transition-transform duration-300"
            />
          )}
        </div>

        {/* Banner 2 */}
        <div className="w-full md:w-1/2">
          {bottomBanners[1] && (
            <Image
              src={bottomBanners[1].photo}
              alt="Bottom Banner 2"
              width={600}
              height={400}
              className="rounded-xl object-cover w-full h-[220px] sm:h-[280px] md:h-[450px] hover:scale-[1.02] transition-transform duration-300"
            />
          )}
        </div>

      </div>
    </div>
  );
}
