"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Banner = {
  id?: number;
  photo: string;
  url?: string;
  position: number | string;
};

const HomeBannerSection = () => {
  const [leftBanners, setLeftBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const data = await res.json();

        if (data?.success) {
          setLeftBanners(data.leftBanners || []);
        }
      } catch (error) {
        console.log("Home banner error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="flex flex-col md:flex-row gap-4">
        {loading &&
          [1, 2].map((i) => (
            <div
              key={i}
              className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-[450px] bg-gray-200 animate-pulse rounded-xl"
            />
          ))}

        {!loading &&
          leftBanners.slice(0, 2).map((banner, index) => (
            <div key={index} className="w-full md:w-1/2">
              <a href={banner.url || "#"} target="_blank">
                <Image
                  src={banner.photo}
                  alt={`Banner ${index + 1}`}
                  width={600}
                  height={400}
                  className="rounded-xl object-cover w-full h-[220px] sm:h-[280px] md:h-[450px] hover:scale-[1.02] transition-transform duration-300"
                />
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomeBannerSection;
