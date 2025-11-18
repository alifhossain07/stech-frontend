"use client";

import React, { useEffect, useState } from "react";
import Glide from "@glidejs/glide";
import Image from "next/image";

type Slider = {
  id: number;
  photo: string;
};

type Banner = {
  id: number;
  photo: string;
  position: number | string;
};

const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rightBanners, setRightBanners] = useState<Banner[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const data = await res.json();

        setRightBanners(data.rightBanners || []);
        setSliders(data.sliders || []);

      } catch (e) {
        console.error("Home API load error", e);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Slider mount
  useEffect(() => {
    if (sliders.length === 0) return;

    const slider = new Glide(".glide-01", {
      type: "slider",
      focusAt: "center",
      perView: 1,
      autoplay: 3000,
      animationDuration: 700,
      gap: 0,
    });

    const timeout = setTimeout(() => {
      slider.mount();
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      slider.destroy();
    };
  }, [sliders]);

  return (
    <div className="w-11/12 md:w-11/12 mx-auto md:pt-10 pt-5 pb-[56px]">

      {/* PARENT CONTAINER */}
      <div
        className="
          flex flex-col lg:flex-row 
          gap-5 
          overflow-hidden xl:rounded-sm
          md:h-[590px]
        "
      >

        {/* =============================== */}
        {/*   LEFT SECTION WITH SKELETON   */}
        {/* =============================== */}
        <div className="w-full lg:w-2/3 h-full relative">

          {loading ? (
            // LEFT SKELETON
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          ) : (
            <div
              className={`relative w-full h-full glide-01 transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="overflow-hidden h-full" data-glide-el="track">
                <ul className="flex relative w-full h-full overflow-hidden p-0 m-0">
                  {sliders.map((slide, idx) => (
                    <li key={idx} className="flex-shrink-0 w-full h-full">
                      <Image
                        src={slide.photo}
                        alt={`slider-${idx}`}
                        width={800}
                        height={700}
                        priority={idx === 0}
                        className="w-full h-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* =============================== */}
        {/*   RIGHT TWO BANNERS + SKELETON */}
        {/* =============================== */}
        <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-1/3 h-full">

          {loading
            ? // RIGHT SKELETONS
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1/2 lg:w-full h-[200px] md:h-[200px] xl:h-[300px] 2xl:h-[350px] lg:h-1/2 bg-gray-200 animate-pulse rounded-md"
                />
              ))
            : rightBanners.slice(0, 2).map((banner) => (
                <div
                  key={banner.id}
                  className="relative w-1/2 lg:w-full h-[200px] md:h-[200px] xl:h-[300px] 2xl:h-[350px] lg:h-1/2"
                >
                  <Image
                    src={banner.photo}
                    alt="right banner"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 xl:rounded-md"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
