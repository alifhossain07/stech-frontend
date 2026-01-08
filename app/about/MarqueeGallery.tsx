"use client";

import Image from "next/image";
import React from "react";

import { SocialPost } from "@/types/about";

const MarqueeGallery = ({ social_posts }: { social_posts: SocialPost[] }) => {

  return (
    <div className="w-full mt-[36px] overflow-hidden py-6 marquee-wrapper">
      <div className="animate-marquee gap-4 flex">
        {[...social_posts, ...social_posts].map((post, i) => {
          return (
            <div
              key={i}
              className="relative rounded-md overflow-hidden"
              style={{ width: "337.38px", height: "389.23px" }}
            >
              <Image src={post.image} alt="marquee item" fill className="object-cover" />

              {/* Smoother Hover Overlay */}
              <div
                className="
                  absolute inset-0 
                  bg-black/60
                  opacity-0 hover:opacity-100 
                  transition-all duration-500
                  flex items-center justify-center
                "
              >
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    bg-white rounded-full p-4 
                    shadow-lg 
                    scale-75 hover:scale-100 
                    transition-all duration-500
                  "
                >
                  <Image
                    src={post.icon}
                    width={36}
                    height={36}
                    alt="social icon"
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeGallery;
