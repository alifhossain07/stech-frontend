import Image from "next/image";
import React from "react";

const MissionVision = ({
  mission_icon,
  mission_title,
  mission_description,
  vision_icon,
  vision_title,
  vision_description
}: {
  mission_icon: string;
  mission_title: string;
  mission_description: string;
  vision_icon: string;
  vision_title: string;
  vision_description: string;
}) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-10 mt-14  ">

      {/* Mission */}
      <div className="bg-black rounded-xl p-10 xl:w-1/2 flex flex-col gap-6">
        <Image
          src={mission_icon}
          alt="Mission Icon"
          width={56}
          height={56}
          className="w-[56px] h-[56px]"
        />

        <h1 className="2xl:text-4xl xl:text-3xl text-xl text-white tracking-wide">
          {mission_title}
        </h1>

        <p className="2xl:text-xl xl:text-base text-justify text-base leading-[32px] text-white">
          {mission_description}
        </p>
      </div>

      {/* Vision */}
      <div className="bg-black rounded-xl p-10 xl:w-1/2 flex flex-col gap-6">
        <Image
          src={vision_icon}
          alt="Vision Icon"
          width={56}
          height={56}
          className="w-[56px] h-[56px]"
        />

        <h1 className="2xl:text-4xl xl:text-3xl text-xl text-white tracking-wide">
          {vision_title}
        </h1>

        <p className="2xl:text-xl xl:text-base text-base text-justify leading-[32px] text-white">
          {vision_description}
        </p>
      </div>

    </div>
  );
};

export default MissionVision;
