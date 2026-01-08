import Image from 'next/image'
import React from 'react'

import { FeatureCard } from '@/types/about'

const AboutBanner = ({ hero_image, hero_heading, hero_description, feature_cards }: {
  hero_image: string;
  hero_heading: string;
  hero_description: string;
  feature_cards: FeatureCard[];
}) => {
  return (
    <div>
      {/* =========================
          TOP OFFICE IMAGE
      ========================== */}
      <div className="w-full rounded-xl overflow-hidden mb-10">
        <Image
          src={hero_image}
          alt="Office"
          width={2000}
          height={900}
          className="w-full h-auto object-contain rounded-xl"
        />
      </div>

      {/* =========================
          TITLE + PARAGRAPH
      ========================== */}
      <div className=" mx-auto mb-12 w-11/12">
        <h2 className="xl:text-[28px] text-[20px] font-semibold text-black mb-2">
          {hero_heading}
        </h2>

        <p className="2xl:text-[28px] xl:text-[18px] text-[18px] text-justify leading-[32px] md:leading-[42px] text-gray-700">
          {hero_description}
        </p>
      </div>

      {/* =========================
          3 FEATURE CARDS
      ========================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {feature_cards.map((card, index) => (
          <div key={index} className="border rounded-xl p-8 bg-white">
            <p className="text-gray-400 text-[14px] mb-24">({card.number})</p>

            <h3 className="min-h-[60px] 2xl:text-[22px] text-[18px]  font-semibold text-orange-500 mb-2">
              {card.title}
            </h3>

            <p className="2xl:text-[20px] text-[16px]  leading-[32px] text-orange-500">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutBanner
