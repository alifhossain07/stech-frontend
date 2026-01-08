import Image from "next/image";
import React from "react";

const Commitment = ({ commitment_image, commitment_title, commitment_description }: {
  commitment_image: string;
  commitment_title: string;
  commitment_description: string;
}) => {
  return (
    <div className="mt-[36px] bg-[#f4f4f4] p-8 md:p-10 rounded-xl shadow-sm">

      <div className="flex flex-col xl:flex-row gap-8 md:gap-10 items-start xl:items-stretch">
        <div className="w-full  xl:hidden xl:w-1/2">
          <Image
            src={commitment_image}
            alt="Commitment Image"
            width={600}
            height={600}
            className="w-full h-full rounded-lg object-contain"
          />
        </div>
        {/* LEFT TEXT */}
        <div className="w-full xl:w-1/2 flex flex-col gap-4">

          <h2 className="text-[20px] md:text-[30px] xl:text-[28px] 2xl:text-[36px] font-semibold text-orange-500">
            {commitment_title}
          </h2>

          <p className="text-[14px] md:text-[16px]  2xl:text-[20px] leading-[33px] text-gray-700 text-justify">
            {commitment_description}
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full hidden xl:block xl:w-1/2">
          <Image
            src={commitment_image}
            alt="Commitment Image"
            width={600}
            height={600}
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Commitment;
