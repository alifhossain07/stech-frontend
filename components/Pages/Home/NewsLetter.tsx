import Image from "next/image";
import React from "react";
import { FiChevronDown } from "react-icons/fi";

const NewsLetter = () => {
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
          bg-[url('/images/newsletter.png')]
          bg-cover bg-center xl:bg-right
        "
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
          <h2
            className="
              text-2xl md:text-2xl md:w-6/12 xl:w-full xl:text-4xl 2xl:text-5xl
              tracking-wide xl:tracking-widest
              leading-[2.3rem] xl:leading-[3.6rem] 2xl:leading-normal
              drop-shadow-md
            "
          >
            Stay Home{" "}
            <span className="bg-black px-2 rounded-md">&amp; Get All</span>{" "}
            <br className="hidden xl:block mb-2" />
            Your Essentials From <br className="hidden xl:block" /> Our Website !
          </h2>

          <p className="text-gray-100 text-sm sm:text-base xl:text-lg">
            Download the app from store or Google Play
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start xl:justify-start items-center gap-3 mt-4">
            <Image
              src="/images/appstore.png"
              alt="App Store"
              width={130}
              height={45}
              className="cursor-pointer hover:scale-105 transition-transform"
            />
            <Image
              src="/images/googleplay.png"
              alt="Google Play"
              width={130}
              height={45}
              className="cursor-pointer hover:scale-105 transition-transform"
            />
            <Image
              src="/images/galaxystore.png"
              alt="Galaxy Store"
              width={130}
              height={45}
              className="cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-10 bg-orange-500 p-8 flex justify-between items-center flex-wrap gap-4 md:text-center xl:text-left">
        <h1 className="xl:text-3xl text-lg text-white tracking-wider flex-1">
          Sannai Technology - Trusted Retail Mobile Accessories Shop in Bangladesh
        </h1>
        <FiChevronDown className="text-white font-bold text-4xl mx-auto xl:mx-0" />
      </div>
    </div>
  );
};

export default NewsLetter;
