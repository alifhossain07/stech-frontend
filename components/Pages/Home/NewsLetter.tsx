import Image from "next/image";
import React from "react";
import { FiChevronDown } from "react-icons/fi";

const NewsLetter = () => {
  return (
    <div className="w-11/12 mx-auto py-10 md:py-14">
      <div
        className="relative rounded-md overflow-hidden flex flex-col md:flex-row items-center md:h-[650px] h-auto text-center md:text-left"
        style={{
          backgroundImage: "url('/images/newsletter.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left Content */}
        <div className="text-white md:w-1/2 w-11/12 space-y-4 md:space-y-6 px-4 sm:px-6 md:pl-20 lg:pl-28 py-10 md:py-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl 2xl:text-5xl md:tracking-widest leading-[1.6] md:leading-[1.4]   drop-shadow-md">
            Stay Home{" "}
            <span className="bg-black px-2 rounded-md">&amp; Get All</span> <br className="hidden md:block" />
            Your Essentials From <br className="hidden md:block" /> Our Website !
          </h2>

          <p className="text-gray-100 text-sm sm:text-base md:text-lg">
            Download the app from store or Google Play
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4">
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

      <div className="mt-10 bg-orange-500 p-8 flex justify-between items-center">
        <h1 className="xl:text-3xl text-lg text-white tracking-wider">Sannai Technology - Trusted Retail Mobile Accessories Shop in Bangladesh</h1>
        <FiChevronDown className="text-white font-bold text-4xl" />

      </div>
    </div>
  );
};

export default NewsLetter;
