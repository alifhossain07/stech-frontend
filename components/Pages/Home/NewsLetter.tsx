"use client";

import Loader from "@/components/ui/Loader";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";


type HomeBottomBanner = {
  image: string;
};

const NewsLetter = () => {
  const [open, setOpen] = useState(false);
  const [seoData, setSeoData] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [data, setData] = useState<HomeBottomBanner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBottomBanner = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const json = await res.json();
        setData(json.homeBottomBanner);
      } catch (error) {
        console.error("Failed to load bottom banner:", error);
      }
    };

    const fetchBottomInfo = async () => {
      try {
        const res = await fetch("/api/home-bottom-seo", { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setSeoData({
            title: json.title,
            description: json.description,
          });
        }
      } catch (error) {
        console.error("Failed to load bottom info:", error);
      }
    };

    Promise.all([fetchBottomBanner(), fetchBottomInfo()]).finally(() => setLoading(false));
  }, []);

  // ---- Skeleton Loader ----
  const SkeletonLoader = () => (
    <div className="w-11/12 mx-auto space-y-6 animate-pulse">
      {/* Main Section */}
      <div className="relative rounded-md overflow-hidden flex flex-col xl:flex-row items-center xl:items-center justify-center xl:justify-start xl:h-[650px] h-[400px] bg-gray-200">
        <div className="w-11/12 xl:w-1/2 space-y-4 xl:space-y-6 px-4 sm:px-6 md:pl-12 xl:pl-20 2xl:pl-28 py-10 xl:py-0 flex flex-col items-center md:items-start">
          <div className="h-10 md:h-16 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-6 md:h-8 w-1/2 bg-gray-300 rounded"></div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-[130px] h-[45px] bg-gray-300 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Text Section */}
      <div className="mt-10 bg-orange-500 p-8 flex justify-between items-center flex-wrap gap-4 cursor-pointer select-none">
        <div className="h-6 xl:h-10 w-3/4 bg-gray-300 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

      {/* Dropdown Content */}
      <div className="overflow-hidden transition-all duration-500 max-h-[2000px] opacity-100 mt-4">
        <div className="p-6 bg-white rounded-md shadow-md space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;

  if (!data)
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-11/12 mx-auto">
      {/* Main Section */}
      <div className="relative w-full rounded-md overflow-hidden">
        {data.image && (
          <Image
            src={data.image}
            alt="Newsletter"
            width={1600}
            height={650}
            className="w-full h-auto object-contain rounded-md"
            priority
          />
        )}
      </div>

      {/* Bottom Text Section */}
      <div
        onClick={() => setOpen(!open)}
        className="mt-10 bg-orange-500 p-8 flex justify-between items-center flex-wrap gap-4 md:text-center xl:text-left cursor-pointer select-none"
      >
        <h1 className="xl:text-3xl text-lg text-white tracking-wider flex-1">
          {seoData.title || "Sannai Technology - Trusted Retail Mobile Accessories Shop in Bangladesh"}
        </h1>

        <FiChevronDown
          className={`text-white font-bold text-4xl mx-auto xl:mx-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
            }`}
        />
      </div>

      {/* DROPDOWN CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-6 bg-white rounded-md shadow-md">
          <div
            className="text-gray-700 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: seoData.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
