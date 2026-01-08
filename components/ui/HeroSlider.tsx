"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";

type Slider = {
  id: number;
  photo: string;
  url: string | null;
};

type Banner = {
  id: number;
  photo: string;
  position: number | string;
  url: string | null;
};

export const dynamic = "force-dynamic";

const HeroSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rightBanners, setRightBanners] = useState<Banner[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch data
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

  // Autoplay slider
  useEffect(() => {
    if (sliders.length === 0) return;

    slideInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 3500);

    setIsLoaded(true);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [sliders]);

  // Manual slide
  const goTo = (index: number) => setCurrent(index);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-11/12 md:w-11/12 mx-auto md:pt-10 pt-5 pb-[56px]">
      {/* Mobile & Tablet Layout (stacked) */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Slider */}
        <div className="relative w-full aspect-[16/9] md:aspect-[16/7] overflow-hidden rounded-sm">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
          ) : (
            <div
              className={`relative w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="overflow-hidden w-full h-full relative">
                <div
                  className="flex w-full h-full transition-transform duration-700"
                  style={{
                    transform: `translateX(-${current * 100}%)`,
                  }}
                >
                  {sliders.map((slide, idx) => (
                    <div
                      className="w-full h-full flex-shrink-0 relative"
                      key={idx}
                    >
                      {slide.url ? (
                        <Link href={slide.url} className="block w-full h-full cursor-pointer">
                          <Image
                            src={slide.photo}
                            alt={`slider-${idx}`}
                            fill
                            priority={idx === 0}
                            className="object-contain"
                          />
                        </Link>
                      ) : (
                        <Image
                          src={slide.photo}
                          alt={`slider-${idx}`}
                          fill
                          priority={idx === 0}
                          className="object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ARROWS */}
              <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                <button
                  onClick={prevSlide}
                  className="text-white bg-black/40 hover:bg-orange-400 px-1 py-1 md:px-3 md:py-3 rounded-full"
                >
                  <HiArrowSmLeft />
                </button>

                <button
                  onClick={nextSlide}
                  className="text-white bg-black/40 hover:bg-orange-400 px-1 py-1 md:px-3 md:py-3 rounded-full"
                >
                  <HiArrowSmRight />
                </button>
              </div>

              {/* DOTS */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {sliders.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-3 h-3 rounded-full transition
                ${i === current
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                      }
              `}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right banners stacked under slider */}
        <div className="flex gap-4">
          {loading
            ? [1, 2].map((i) => (
              <div
                key={i}
                className="relative w-1/2 aspect-[16/9] bg-gray-200 rounded-md"
              />
            ))
            : rightBanners.slice(0, 2).map((banner) => (
              <div
                key={banner.id}
                className="relative w-1/2 aspect-[16/9]"
              >
                {banner.url ? (
                  <Link href={banner.url} className="block w-full h-full cursor-pointer">
                    <Image
                      src={banner.photo}
                      alt="right banner"
                      fill
                      className="object-contain rounded-md"
                    />
                  </Link>
                ) : (
                  <Image
                    src={banner.photo}
                    alt="right banner"
                    fill
                    className="object-contain rounded-md"
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Desktop Layout (side-by-side) */}
      <div className="hidden lg:block">
        <div className="relative w-full aspect-[16/6] xl:aspect-[16/6]">
          <div className="absolute inset-0 flex flex-row gap-5 overflow-hidden xl:rounded-sm">
            {/* LEFT SLIDER */}
            <div className="relative w-2/3 h-full">
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
              ) : (
                <div
                  className={`relative w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <div className="overflow-hidden w-full h-full relative">
                    <div
                      className="flex w-full h-full transition-transform duration-700"
                      style={{
                        transform: `translateX(-${current * 100}%)`,
                      }}
                    >
                      {sliders.map((slide, idx) => (
                        <div
                          className="w-full h-full flex-shrink-0 relative"
                          key={idx}
                        >
                          {slide.url ? (
                            <Link href={slide.url} className="block w-full h-full cursor-pointer">
                              <Image
                                src={slide.photo}
                                alt={`slider-${idx}`}
                                fill
                                priority={idx === 0}
                                className="object-contain"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={slide.photo}
                              alt={`slider-${idx}`}
                              fill
                              priority={idx === 0}
                              className="object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ARROWS */}
                  <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                    <button
                      onClick={prevSlide}
                      className="text-white bg-black/40 hover:bg-orange-400 px-1 py-1 md:px-3 md:py-3 rounded-full"
                    >
                      <HiArrowSmLeft />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="text-white bg-black/40 hover:bg-orange-400 px-1 py-1 md:px-3 md:py-3 rounded-full"
                    >
                      <HiArrowSmRight />
                    </button>
                  </div>

                  {/* DOTS */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {sliders.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-3 h-3 rounded-full transition
                ${i === current
                            ? "bg-white"
                            : "bg-white/40 hover:bg-white/70"
                          }
              `}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT BANNERS */}
            <div className="flex flex-col gap-4 w-1/3 h-full">
              {loading
                ? [1, 2].map((i) => (
                  <div
                    key={i}
                    className="relative w-full h-1/2 bg-gray-200 rounded-md"
                  />
                ))
                : rightBanners.slice(0, 2).map((banner) => (
                  <div
                    key={banner.id}
                    className="relative w-full h-1/2"
                  >
                    {banner.url ? (
                      <Link href={banner.url} className="block w-full h-full cursor-pointer">
                        <Image
                          src={banner.photo}
                          alt="right banner"
                          fill
                          className="object-contain rounded-md"
                        />
                      </Link>
                    ) : (
                      <Image
                        src={banner.photo}
                        alt="right banner"
                        fill
                        className="object-contain rounded-md"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
