"use client";

import React, { useEffect, useState } from "react";
import Glide from "@glidejs/glide";
import Image from "next/image";

const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const slider = new Glide(".glide-01", {
      type: "slider",
      focusAt: "center",
      perView: 1,
      autoplay: 3000,
      animationDuration: 700,
      gap: 0,
      classes: {
        swipeable: "glide__swipeable",
        dragging: "glide__dragging",
        direction: { ltr: "glide__ltr", rtl: "glide__rtl" },
        type: { slider: "glide__slider", carousel: "glide__carousel" },
        slide: { active: "glide__slide--active", clone: "glide__slide--clone" },
        arrow: { disabled: "glide__arrow--disabled" },
        nav: { active: "[&>*]:bg-wuiSlate-700" },
      },
    });

    const timeout = setTimeout(() => {
      slider.mount();
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      slider.destroy();
    };
  }, []);

  return (
    <div className="w-11/12 md:w-11/12 mx-auto md:pt-10 pt-5 pb-24">
      {/* Parent Container */}
      <div
        className="
          flex flex-col lg:flex-row 
          gap-5 
          overflow-hidden rounded-xl
          md:h-[590px]
        "
      >
        {/* LEFT: Slider */}
        <div className="w-full lg:w-2/3 h-full relative overflow-hidden">
          <div
            className={`relative w-full h-full glide-01 transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Slides */}
            <div className="overflow-hidden h-full" data-glide-el="track">
              <ul className="flex relative w-full h-full overflow-hidden p-0 m-0">
                <li className="flex-shrink-0 w-full h-full">
                  <Image
                    src="/images/slider1.png"
                    alt="slider1"
                    width={800}
                    height={700}
                    priority
                    className="w-full h-full object-cover"
                  />
                </li>
                <li className="flex-shrink-0 w-full h-full">
                  <Image
                    src="/images/slider2.png"
                    alt="slider2"
                    width={800}
                    height={700}
                    className="w-full h-full object-cover"
                  />
                </li>
              </ul>
            </div>

            {/* Controls */}
            <div
              className="absolute left-0 flex items-center justify-between w-full h-0 px-4 top-1/2 z-10"
              data-glide-el="controls"
            >
              <button
                className="inline-flex items-center justify-center w-10 h-10 transition duration-300 border rounded-full border-slate-700 bg-white/30 text-slate-700 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none"
                data-glide-dir="<"
                aria-label="prev slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
              </button>
              <button
                className="inline-flex items-center justify-center w-10 h-10 transition duration-300 border rounded-full border-slate-700 bg-white/30 text-slate-700 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none"
                data-glide-dir=">"
                aria-label="next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Two stacked images */}
        <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-1/3 h-full">
          <div className="relative w-1/2 lg:w-full h-[200px] md:h-[200px] xl:h-[300px] 2xl:h-[350px] lg:h-1/2">
            <Image
              src="/images/herohover.png"
              alt="right image 1"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
            />
          </div>
          <div className="relative w-1/2 lg:w-full h-[200px] md:h-[200px] xl:h-[300px] 2xl:h-[350px] lg:h-1/2">
            <Image
              src="/images/herohover.png"
              alt="right image 2"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
