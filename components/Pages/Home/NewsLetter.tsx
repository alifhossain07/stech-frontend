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

    fetchBottomBanner();
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

  {/* 1️⃣ Best Computer Shop */}
  <div>
    <h1 className="text-xl font-bold mb-2">
      Best Computer Shop in Bangladesh
    </h1>
    <p className="text-gray-700 leading-relaxed">
      Tech Land BD, established in 2016, stands out as the best Computer Shop in 
      BD (Bangladesh) and the go-to computer shop in Dhaka. We are your trusted 
      source for high-quality computer hardware, laptops, office equipment, home 
      appliances, and tech gadgets. With an extensive selection of products and 
      unbeatable prices, Tech Land has solidified its reputation as the top 
      computer shop in Bangladesh.
    </p>
  </div>

  {/* 2️⃣ Laptop Shop */}
  <div>
    <h1 className="text-xl font-bold mb-2">
      Buy the Best Laptop in Bangladesh from Tech Land BD
    </h1>
    <p className="text-gray-700 leading-relaxed">
      Discover the best laptop shop in BD – Tech Land, your go-to destination for 
      laptops in Bangladesh. We sell the best laptop prices in BD. Explore top 
      brands like HP, Asus, Acer, Lenovo, MSI, Gigabyte, Apple, Xiaomi, Huawei, 
      and Microsoft. Whether youre a gamer or a student, find the perfect laptop 
      that suits your needs and budget. Tech Land, the trusted name in gaming 
      laptops, brings you the latest models from Razer and more. Shop with 
      confidence at Tech Land, the ultimate laptop seller in Bangladesh.
    </p>
  </div>

  {/* 3️⃣ Desktop PC */}
  <div>
    <h1 className="text-xl font-bold mb-2">
      Best Desktop PC Shop in Bangladesh
    </h1>
    <p className="text-gray-700 leading-relaxed">
      Looking for where to buy a Desktop PC in BD or Dhaka? Look no further – 
      Tech Land is your answer. As a leading gaming PC seller in BD and a gaming 
      PC shop in BD, we cater to the needs of tech enthusiasts and gamers. But 
      thats not all; were also a comprehensive computer store in BD, serving 
      customers nationwide. Experience the difference at Tech Land – your trusted 
      partner for brands like Corsair, Razer, Lian Li, NZXT, Cooler Master, 
      Antec, Gamdias, Gigabyte, and more. Techland BD is most popular for AMD 
      5600G and AMD 5700G processors in Bangladesh. If you want to buy a desktop 
      PC, Techland BD is the best computer shop in BD.
    </p>
  </div>

  {/* 4️⃣ Gadgets */}
  <div>
    <h1 className="text-xl font-bold mb-2">
      Best Gadgets PC Shop in Bangladesh
    </h1>
    <p className="text-gray-700 leading-relaxed">
      Discover the best gadget shop in BD for top-notch tech solutions! Explore 
      our wide range of gadgets at unbeatable prices, including smartwatches from 
      leading brands like Xiaomi and Amazfit, premium earbuds, powerful gimbals, 
      and more. Find the perfect balance of quality and affordability with our 
      collection featuring DJI, Zhiyun, Kieslect, Huawei, Anker, OnePlus, Apple, 
      Baseus, HOCO, Havit, Ugreen, Vention, Orico, Belkin, and other renowned 
      brands. Shop now and simplify your daily life with our innovative tech 
      offerings. Techland BD is the best computer shop in BD and also a top 
      gadget store.
    </p>
  </div>

</div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
