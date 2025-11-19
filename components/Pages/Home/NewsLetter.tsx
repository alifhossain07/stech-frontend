"use client";

import Loader from "@/components/ui/Loader";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type BottomBannerIcon = {
  photo: string;
  link: string | null;
};

type HomeBottomBanner = {
  image: string;
  title: string;
  subtitle: string;
  icons: BottomBannerIcon[];
};

const NewsLetter = () => {
  const [open, setOpen] = useState(false);
  const [infoRows, setInfoRows] = useState<
  { title: string; paragraph: string }[]
>([]);
  const formatTitle = (title: string) => {
    return title
      .replace(/\*(.*?)\*/g, (_, text) => {
        return `<span class="highlight-banner-text">${text}</span>`;
      })
      .replace(/\n/g, "<br/>");
  };
  const [data, setData] = useState<HomeBottomBanner | null>(null);

  useEffect(() => {
    const fetchBottomBanner = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" });
        const json = await res.json();
        console.log("TITLE FROM API:", json.homeBottomBanner.title);
        setData(json.homeBottomBanner);
      } catch (error) {
        console.error("Failed to load bottom banner:", error);
      }
    };
 const fetchBottomInfo = async () => {
    try {
      const res = await fetch("/api/home-info-seo", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setInfoRows(json.rows);
    } catch (error) {
      console.error("Failed to load bottom info:", error);
    }
  };
    fetchBottomBanner();
     fetchBottomInfo();
  }, []);

  if (!data)
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-11/12 mx-auto">
      {/* Main Section */}
      <div
        className="
          relative rounded-md overflow-hidden
          flex flex-col xl:flex-row
          items-center xl:items-center
          justify-center xl:justify-start
          xl:h-[650px] h-auto
          text-center md:text-left
          bg-cover bg-center xl:bg-right
        "
        style={{
          backgroundImage: `url(${data.image})`,
        }}
      >
        {/* Left Content */}
        <div
          className="
            text-white
            w-11/12 xl:w-1/2
            space-y-4 xl:space-y-6
            px-4 sm:px-6 md:pl-12 xl:pl-20 2xl:pl-28
            py-10 xl:py-0
            flex flex-col items-center md:items-start
          "
        >
          {/* Dynamic Title */}
          <h2
            className="text-2xl md:text-2xl md:w-6/12 xl:w-full xl:text-4xl 2xl:text-5xl
  tracking-wide xl:tracking-widest leading-[2.3rem] xl:leading-[3.6rem]
  2xl:leading-normal drop-shadow-md"
            dangerouslySetInnerHTML={{ __html: formatTitle(data.title) }}
          />

          {/* Dynamic Subtitle */}
          <p className="text-gray-100 text-sm sm:text-base xl:text-lg">
            {data.subtitle}
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
            {data.icons?.map((icon, index) => (
              <a
                key={index}
                href={icon.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={icon.photo}
                  alt={`Icon-${index}`}
                  width={130}
                  height={45}
                  className="cursor-pointer hover:scale-105 transition-transform rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Text Section */}
      <div
        onClick={() => setOpen(!open)}
        className="mt-10 bg-orange-500 p-8 flex justify-between items-center flex-wrap gap-4 md:text-center xl:text-left cursor-pointer select-none"
      >
        <h1 className="xl:text-3xl text-lg text-white tracking-wider flex-1">
          Sannai Technology - Trusted Retail Mobile Accessories Shop in
          Bangladesh
        </h1>

        <FiChevronDown
          className={`text-white font-bold text-4xl mx-auto xl:mx-0 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* DROPDOWN CONTENT */}
    <div
  className={`
    overflow-hidden transition-all duration-500
    ${open ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"}
  `}
>
        <div className="p-6 bg-white rounded-md shadow-md">
          <div className="space-y-10">
  {infoRows.map((row, index) => (
    <div key={index}>
      <h1 className="text-xl font-bold mb-2">{row.title}</h1>
      <p className="text-gray-700 leading-relaxed">{row.paragraph}</p>
    </div>
  ))}
</div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
