import Image from "next/image";
import React from "react";

const FutureVision = ({ future_image, future_title, future_description }: {
  future_image: string;
  future_title: string;
  future_description: string;
}) => {
  return (
    <div className=" mt-[36px] bg-[#f4f4f4] p-8 md:p-10 rounded-xl shadow-sm">

      <div className="flex flex-col xl:flex-row gap-8 md:gap-10 items-start xl:items-stretch">

        {/* LEFT IMAGE */}
        <div className="w-full xl:w-1/2">
          <Image
            src={future_image}
            alt="Future Vision"
            width={600}
            height={400}
            className="w-full h-full rounded-lg object-contain"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">

          <h2 className="text-[20px] md:text-[30px] xl:text-[28px] 2xl:text-[36px] font-semibold text-orange-500">
            {future_title}
          </h2>

          <p className="text-[14px] md:text-[16px]  2xl:text-[20px] text-justify leading-[33px] text-gray-700">
            {future_description}
          </p>

        </div>

      </div>
    </div>
  );
};

export default FutureVision;
