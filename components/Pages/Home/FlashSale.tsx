"use client";

import React from "react";
import { FiChevronRight } from "react-icons/fi";

import ProductCard from "@/components/ui/ProductCard"; // adjust import path if needed

const products = [
  {
    id: 1,
    name: "25 Watt Samsung Fast Charger",
    price: 2500,
    oldPrice: 2600,
    discount: "10% Off",
    rating: "3.0",
    reviews: "(1)",
    image: "/images/charger.png",
  },
  {
    id: 2,
    name: "Super Fast Wall Charger",
    price: 2300,
    oldPrice: 2500,
    discount: "8% Off",
    rating: "4.0",
    reviews: "(12)",
    image: "/images/charger.png",
  },
  {
    id: 3,
    name: "Compact USB-C Adapter",
    price: 2200,
    oldPrice: 2400,
    discount: "9% Off",
    rating: "4.5",
    reviews: "(7)",
    image: "/images/charger.png",
  },
  {
    id: 4,
    name: "Dual Port Fast Charger",
    price: 2700,
    oldPrice: 3000,
    discount: "10% Off",
    rating: "3.8",
    reviews: "(4)",
    image: "/images/charger.png",
  },
];

const FlashSale = () => {
  return (
    <div className="md:w-11/12 w-10/12 mx-auto pt-10 pb-24">
      {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left py-6 md:py-8 w-full gap-3">
            <div className="w-full sm:w-7/12">
              <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
                Fast Charger Products
              </h1>
              <p className="text-xs sm:text-sm md:text-lg text-gray-600">
                Discover Our Latest Arrivals Designed to Inspire and Impress
              </p>
            </div>
    
            <button className="bg-black text-xs sm:text-sm md:text-lg flex items-center justify-center gap-2 text-white px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl hover:text-black font-semibold hover:bg-gray-200 duration-300 transition whitespace-nowrap">
              See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
            </button>
          </div>

      {/* Flash Sale Layout */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
        {/* Deal of the Day (Orange Card with Background Image) */}
        <div
          className="relative flex flex-col justify-center items-center rounded-2xl p-8 text-center md:w-96 min-h-full overflow-hidden"
          style={{
            backgroundImage: `url('/images/flashsale.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Orange Overlay */}
          

          {/* Content */}
          <div className="relative text-white space-y-5 z-10">
            <p className="text-sm font-medium opacity-90">
              Only One Week Offer’s
            </p>
            <h1 className="md:text-2xl text-xl font-bold">Deal Of The Day</h1>
            <p className="md:text-lg">
              Explore brand-new products crafted for style, quality, and
              innovation.
            </p>

            {/* Countdown Boxes */}
            <div className="grid grid-cols-4 mt-10 gap-4">
              {[
                { value: "03", label: "Days" },
                { value: "24", label: "Hours" },
                { value: "12", label: "Mins" },
                { value: "36", label: "Sec" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white text-orange-500 rounded-lg py-5 md:px-10 flex flex-col items-center justify-center w-14"
                >
                  <span className="text-2xl font-bold leading-none">
                    {item.value}
                  </span>
                  <span className="text-[16px] font-medium mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Pagination (Right-Aligned, Arrows Only) */}
      <div className="flex justify-end mt-10 space-x-3">
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md  hover:bg-gray-100 transition ">
          &lt;
        </button>
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md  hover:bg-gray-100 hover:text-black transition">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FlashSale;
