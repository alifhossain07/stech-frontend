"use client";
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="md:mt-10 mt-5 w-11/12 mx-auto animate-pulse">
      {/* Product Details Container */}
      <div className="xl:h-[1038px] flex flex-col xl:flex-row gap-6">
        {/* ---------- Left: Images ---------- */}
        <div className="2xl:w-[55%] xl:w-[50%] flex flex-col justify-between">
          {/* Main Image Container */}
          <div className="h-[84%] w-full flex items-center justify-center bg-[#f6f6f6] rounded-xl relative overflow-hidden">
            <div className="absolute top-7 left-10 z-20">
              <div className="w-14 h-14 md:w-20 xl:w-32 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-64 h-80 md:w-80 md:h-96 xl:w-[600px] xl:h-[600px] 2xl:w-[600px] 2xl:h-[600px] bg-gray-300 rounded-lg"></div>
          </div>
          {/* Thumbnail Row */}
          <div className="h-[16%] w-full grid grid-cols-6 gap-4 mt-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="relative cursor-pointer border-2 rounded-xl overflow-hidden bg-gray-300">
                <div className="w-full h-full bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right: Product Details ---------- */}
        <div className="2xl:w-[44%] xl:w-[48%] space-y-4">
          {/* Product Title */}
          <div className="2xl:h-12 xl:h-10 h-8 bg-gray-300 rounded-lg w-3/4"></div>
          
          {/* Rating & Status Row */}
          <div className="flex items-center justify-start gap-3 bg-[#f4f4f4] xl:px-4 py-3 rounded-md">
            <div className="flex items-center gap-1 w-24 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 w-px bg-gray-400"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-px bg-gray-400"></div>
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
          </div>

          {/* Most Viewed Badge */}
          <div className="h-3 w-32 bg-gray-300 rounded-sm"></div>

          {/* Price Section */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="2xl:h-12 xl:h-10 h-8 w-20 bg-gray-300 rounded-lg"></div>
              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              <div className="h-5 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full md:hidden"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full md:hidden"></div>
            </div>
          </div>

          {/* Quick Overview */}
          <div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="space-y-2">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center gap-3 bg-[#f4f4f4] rounded-md xl:px-4 xl:py-2 py-1">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <div className={`h-4 bg-gray-300 rounded w-${index === 4 ? 'full' : '2/3'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Compatible */}
          <div className="bg-[#f4f4f4] rounded-xl p-4">
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-400 h-6 rounded-full w-16 md:w-20"></div>
              ))}
            </div>
          </div>

          {/* Variants & Colors */}
          <div className="bg-gray-50 px-4 py-3 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
              <div className="flex items-center gap-2">
                {Array(2).fill(0).map((_, index) => (
                  <div key={index} className="w-12 h-6 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
              <div className="flex items-center gap-2">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-gray-400"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery, Quantity, Buttons */}
          <div className="space-y-4">
            {/* Delivery */}
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-5 w-full bg-gray-300 rounded"></div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
              <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 w-[120px]">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 mx-2 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-12 bg-gray-300 border-2 border-gray-400 rounded-full"></div>
            </div>

            {/* Share & WhatsApp */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 bg-gray-300 rounded"></div>
                  <div className="flex gap-2">
                    {Array(4).fill(0).map((_, index) => (
                      <div key={index} className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="h-10 w-36 bg-gray-300 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specs Container */}
      <div className="mt-10 flex flex-col xl:flex-row gap-6 w-full">
        <div className="xl:w-[80%] w-full">
          <div className="w-full bg-white rounded-xl">
            {/* Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-100 p-2 rounded-t-xl">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-10 md:h-12 bg-gray-300 rounded-md"></div>
              ))}
            </div>
            {/* Content */}
            <div className="border border-t-0 rounded-b-xl p-6">
              <div className="space-y-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="w-1/3 h-5 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-5 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full border-t border-gray-200 pt-4 mt-6 space-y-4">
            <div className="h-10 w-48 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Recently Viewed Sidebar */}
        <div className="xl:w-[20.5%] w-full bg-white rounded-2xl shadow-sm">
          <div className="h-12 bg-[#f4f4f4] rounded-t-2xl"></div>
          <div className="p-4 space-y-3">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex items-center gap-3 bg-[#f4f4f4] rounded-xl p-2">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                    <div className="h-4 w-10 bg-gray-300 rounded-sm"></div>
                    <div className="h-3 w-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
