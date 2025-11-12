"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Page = () => {
  const images = [
    "/images/detailsCharger.png",
    "/images/detailsCharger.png",
    "/images/detailsCharger.png",
    "/images/detailsCharger.png",
    "/images/detailsCharger.png",
    "/images/detailsCharger.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-11/12 mx-auto mt-10">
      <div className="w-full flex justify-center bg-white py-10 px-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ---------- Left: Image Gallery ---------- */}
          <div className="flex flex-col items-center w-7/12">
            {/* Main Image */}
            <div className="relative w-full h-[500px] flex justify-center items-center bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={prevImage}
                className="absolute left-3 bg-white shadow rounded-full p-2 hover:bg-gray-100 z-10"
              >
                <FiChevronLeft size={24} />
              </button>

              <Image
                src={images[currentIndex]}
                alt="Product Image"
                fill
                className="object-contain transition-all duration-500 ease-in-out"
              />

              <button
                onClick={nextImage}
                className="absolute right-3 bg-white shadow rounded-full p-2 hover:bg-gray-100 z-10"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-20 h-20 rounded-lg border cursor-pointer overflow-hidden transition-all duration-300 ${
                    currentIndex === index
                      ? "border-orange-500 scale-105 ring-2 ring-orange-400"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Right: Product Info ---------- */}
          <div className=" flex flex-col gap-4 justify-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Samsung Special Fast Charger
            </h1>
            <div className="flex items-center justify-start gap-3 bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-700">
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

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-orange-600">৳2600</span>
              <span className="text-gray-400 line-through">৳2800</span>
              <span className="text-green-600 text-sm font-semibold">
                10% OFF
              </span>
            </div>

            <p className="text-sm text-gray-500">
              <span className="font-semibold">Status:</span> In Stock &nbsp; |
              &nbsp;
              <span className="font-semibold">Product ID:</span> 187542
            </p>

            <div className="border-t border-gray-200 my-3"></div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Quick Overview:
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>Fast Charging Supported</li>
                <li>22.5W Power Output</li>
                <li>Compact Build</li>
                <li>Smart Chip Protection</li>
                <li>2 Years Warranty</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mt-3 mb-2">
                Product Compatible:
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Samsung", "Vivo", "Oppo", "Redmi", "Apple"].map((brand) => (
                  <span
                    key={brand}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-600 hover:bg-orange-100 cursor-pointer"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mt-3 mb-2">
                Variants:
              </h3>
              <div className="flex gap-2">
                {["Type-C", "Type-B"].map((v) => (
                  <button
                    key={v}
                    className="px-3 py-1 rounded-full text-sm border border-gray-300 hover:border-orange-500 hover:text-orange-600"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mt-3 mb-1">Color:</h3>
              <div className="flex gap-2">
                {["black", "white", "gray", "red", "green"].map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 rounded-full border cursor-pointer"
                    style={{ backgroundColor: c }}
                  ></div>
                ))}
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-3">
              Delivery Timescale:{" "}
              <span className="font-semibold">3–6 Days</span>
            </p>

            <div className="flex items-center gap-3 mt-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-6 py-2.5 rounded-full">
                Buy Now
              </button>
              <button className="border border-gray-300 text-sm px-6 py-2.5 rounded-full hover:border-orange-400 hover:text-orange-500">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
