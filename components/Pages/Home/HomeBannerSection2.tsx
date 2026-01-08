"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
            bottomBanners[0].url ? (
              <Link href={bottomBanners[0].url} target="_blank" className="block cursor-pointer">
                <div className="relative w-full aspect-[866/381] rounded-xl overflow-hidden">
                  <Image
                    src={bottomBanners[0].photo}
                    alt="Bottom Banner 1"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative w-full aspect-[866/381] rounded-xl overflow-hidden">
                <Image
                  src={bottomBanners[0].photo}
                  alt="Bottom Banner 1"
                  fill
                  className="object-contain"
                />
              </div>
            )
          )}
        </div>

        {/* Banner 2 */}
        <div className="w-full md:w-1/2">
          {bottomBanners[1] && (
            bottomBanners[1].url ? (
              <Link href={bottomBanners[1].url} target="_blank" className="block cursor-pointer">
                <div className="relative w-full aspect-[866/381] rounded-xl overflow-hidden">
                  <Image
                    src={bottomBanners[1].photo}
                    alt="Bottom Banner 2"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative w-full aspect-[866/381] rounded-xl overflow-hidden">
                <Image
                  src={bottomBanners[1].photo}
                  alt="Bottom Banner 2"
                  fill
                  className="object-contain"
                />
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
