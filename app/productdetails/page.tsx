"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Page = () => {
  const images = [
    "/images/detailsC.png",
    "/images/detailsC.png",
    "/images/detailsC.png",
    "/images/detailsC.png",
    "/images/detailsC.png",
    "/images/detailsC.png",
 
  ];

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="mt-10 w-11/12 mx-auto">
      {/* Product Details Container */}
      <div className="h-[1038px] flex gap-6">
        {/* ---------- Left: Images ---------- */}
        <div className="w-[61.8%] flex flex-col justify-between">
          {/* Main Image */}
          <div className="h-[84%] w-full flex items-center justify-center bg-[#f6f6f6] rounded-xl relative overflow-hidden">
            <Image
              src={images[selectedImage]}
              alt="Product"
              width={500}
              height={500}
              className="object-contain h-full w-auto"
            />

            {/* Navigation Arrows */}
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <FiChevronLeft className="text-gray-700" size={20} />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <FiChevronRight className="text-gray-700" size={20} />
            </button>
          </div>

          {/* Thumbnail Row */}
          <div className="h-[16%] w-full grid grid-cols-6 gap-4 mt-4">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 aspect-square flex items-center justify-center ${
                  selectedImage === index
                    ? "border-orange-500"
                    : "border-transparent hover:border-orange-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumb ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full p-1"
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 border-[3px] border-orange-500 rounded-xl pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right: Product Details ---------- */}
        <div className="w-[38.2%]">
          <h1 className="text-4xl font-semibold mb-3">
            Samsung Special Fast Charger
          </h1>
           <div className="flex mb-4 items-center justify-start gap-3 bg-gray-100 px-4 py-3 rounded-md text-sm text-gray-700">
              <div className="flex items-center gap-1">
                {/* Example 5 stars */}
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-orange-500">
                      ★
                    </span>
                  ))}
                <span className="text-gray-600 ml-1">(10 reviews)</span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-gray-300"></div>

              <div className="text-gray-700 font-medium">Status: In Stock</div>

              <div className="h-4 w-px bg-gray-300"></div>

              <div className="text-gray-700 font-medium">
                Product ID: 187542
              </div>
            </div>

          <p className="text-orange-500 text-[10px] mb-3" >★ Most Viewed Products ★</p>  
          
          <div className="flex items-center justify-between w-full">
  {/* -------- Left: Price Section -------- */}
  <div className="flex items-center gap-3 mb-3">
    {/* New Price */}
    <span className="text-[32px] font-semibold text-orange-500">৳2600</span>

    {/* Discount Badge */}
    <span className="bg-green-100 text-green-600 text-[16px] font-semibold px-2 py-[2px] rounded-full">
      10% OFF
    </span>

    {/* Old Price */}
    <span className="text-gray-400 line-through text-[16px]">৳2800</span>
  </div>

  {/* -------- Right: Compare & Wishlist -------- */}
  <div className="flex items-center gap-4 text-gray-500 text-[16px]">
    <button className="flex items-center gap-1 hover:text-gray-700 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 16h8M8 12h8m-8-4h8m-6 8v4m4-4v4"
        />
      </svg>
      Add to Compare
    </button>

    <button className="flex items-center gap-1 hover:text-gray-700 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5a4.5 4.5 0 00-3.75 2.028A4.5 4.5 0 009 3.75C6.515 3.75 4.5 5.765 4.5 8.25c0 7.125 7.5 11.25 7.5 11.25s7.5-4.125 7.5-11.25z"
        />
      </svg>
      Add wishlist
    </button>
  </div>
</div>

          <div className="space-y-2 bg-gray-100 p-4 rounded-lg">
            <p>✅ Fast Charging Supported</p>
            <p>⚡ 22.5W Output</p>
            <p>💡 Smart Chip</p>
            <p>🛡️ 2 Years Warranty</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
              Buy Now
            </button>
            <button className="border border-gray-400 px-6 py-3 rounded-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
