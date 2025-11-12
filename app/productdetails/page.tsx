"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiTruck, FiShoppingBag, FiPlus, FiMinus,  } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaLock,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";


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
  const [selectedVariant, setSelectedVariant] = useState("Type-C");
  const [selectedColor, setSelectedColor] = useState("gray");
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const variants = ["Type-C", "Type-B"];
  const colors = ["#666666", "#000000", "#E74C3C", "#27AE60", "#F39C12"];

  
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
          <h1 className="text-4xl font-semibold mb-2">
            Samsung Special Fast Charger
          </h1>
          <div className="flex mb-4 items-center justify-start gap-3 bg-[#f4f4f4] px-4 py-3 rounded-md text-sm text-gray-700">
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

            <div className="text-gray-700 font-medium">Product ID: 187542</div>
          </div>

          <p className="text-orange-500 text-[10px] mb-2">
            ★ Most Viewed Products ★
          </p>

          <div className="flex items-center justify-between w-full">
            {/* -------- Left: Price Section -------- */}
            <div className="flex items-center gap-3 mb-3">
              {/* New Price */}
              <span className="text-[32px] font-semibold text-orange-500">
                ৳2600
              </span>

              {/* Discount Badge */}
              <span className="bg-green-100 text-green-600 text-[16px] font-semibold px-2 py-[2px] rounded-full">
                10% OFF
              </span>

              {/* Old Price */}
              <span className="text-gray-400 line-through text-[16px]">
                ৳2800
              </span>
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
          {/* Quick Overview */}
          <div>
            <p className="tracking-wide text-[14px] font-medium mb-2">
              Quick Overview :
            </p>
            <div className="space-y-2">
              {/* Item 1 */}
              <div className="flex items-center gap-3 bg-[#f4f4f4] rounded-md px-4 py-3">
                <Image
                  src="/images/fastcharge.png"
                  alt="Fast Charging"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-[16px] text-black">
                  Fast Charging Supported
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3 bg-[#f4f4f4] rounded-md px-4 py-3">
                <Image
                  src="/images/watt.png"
                  alt="22.5W"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-[16px] text-black">22.5W</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3 bg-[#f4f4f4] rounded-md px-4 py-3">
                <Image
                  src="/images/cb.png"
                  alt="Compact Build"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-[16px] text-black">Compact Build</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-3 bg-[#f4f4f4] rounded-md px-4 py-3">
                <Image
                  src="/images/sc.png"
                  alt="Smart Chip"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-[16px] text-black">Smart Chip</span>
              </div>

              {/* Item 5 */}
              <div className="flex items-center gap-3 bg-[#f4f4f4] rounded-md px-4 py-3">
                <Image
                  src="/images/warranty.png"
                  alt="2 Years Warranty"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-[16px] text-black underline">
                  2 Years Warranty
                </span>
              </div>
            </div>
          </div>

          {/* Product Compatible */}

          <div className="bg-[#f4f4f4] rounded-xl p-4 mt-2">
            <h1 className="tracking-wide text-[14px] font-medium mb-2">
              Product Compatible
            </h1>
            <div className="flex gap-4">
              <button className="bg-black rounded-full px-4 py-1 text-white text-[16px]">
                Samsung
              </button>
              <button className="bg-black rounded-full px-4 py-1 text-white text-[16px]">
                Vivo
              </button>
              <button className="bg-black rounded-full px-4 py-1 text-white text-[16px]">
                Oppo
              </button>
              <button className="bg-black rounded-full px-4 py-1 text-white text-[16px]">
                Redmi
              </button>
              <button className="bg-black rounded-full px-4 py-1 text-white text-[16px]">
                Apple
              </button>
            </div>
          </div>

        


          <div className="bg-gray-50 px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-4 mt-3">
            {/* Variants */}
            <div className="flex items-center gap-3 ">
              <span className="text-[14px] font-medium text-gray-700">
                Variants :
              </span>
              <div className="flex items-center gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-[4px] rounded-full text-[13px] font-medium border transition-all duration-200 ${
                      selectedVariant === variant
                        ? "bg-gray-200 text-orange-500 border-orange-400"
                        : "bg-gray-100 text-gray-700 border-transparent hover:border-gray-300"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-3 ">
              <span className="text-[14px] font-medium text-gray-700">
                Color :
              </span>
              <div className="flex items-center gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-[2px] transition-all duration-200 ${
                      selectedColor === color
                        ? "border-orange-500 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>

           {/* Delivery, Quantity and Add Buy Buttons  */}

          <div className="mt-6 space-y-5">
      {/* Delivery Timescale */}
      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
        <FiTruck className="text-gray-700 text-lg" />
        <span className="text-[15px] text-black">
          Delivery Timescale : <span className="font-semibold">3–6 Days</span>
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-[15px] font-medium text-gray-800">Quantity :</span>
        <div className="flex items-center justify-between bg-gray-50 rounded-full px-4 py-2 w-[120px]">
          <button
            onClick={decrease}
            className="text-white rounded-full bg-orange-500 text-lg font-bold "
          >
            <FiMinus />
          </button>
          <span className="text-lg font-semibold text-gray-800">{quantity}</span>
          <button
            onClick={increase}
            className="text-white rounded-full bg-orange-500 text-lg font-bold "
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex  items-center gap-4 ">
        <button  className="flex w-1/2 items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-10 py-4 rounded-full text-[15px] transition-all">
          <FiShoppingBag className="text-lg" />
          Buy Now
        </button>

        <button className="flex w-1/2 items-center justify-center gap-2 border border-gray-400 hover:border-gray-600 text-gray-800 font-medium px-10 py-4 rounded-full text-[15px] transition-all">
          <FiPlus className="text-lg" />
          Add to Cart
        </button>
      </div>

      <div className="mt-8 space-y-6">
      {/* --- Share + WhatsApp Row --- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Share Section */}
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-medium text-gray-800">Share :</span>
          <div className="flex items-center gap-3 text-[22px] text-gray-800">
            <FaFacebookF className="cursor-pointer hover:text-orange-500 transition-all" />
            <FaInstagram className="cursor-pointer hover:text-orange-500 transition-all" />
            <FaTwitter className="cursor-pointer hover:text-orange-500 transition-all" />
            <FaYoutube className="cursor-pointer hover:text-orange-500 transition-all" />
          </div>
        </div>

        {/* WhatsApp Button */}
        <button className="flex items-center gap-2 bg-green-100 text-green-700 font-medium text-[15px] px-5 py-2 rounded-full hover:bg-green-200 transition-all">
          <FaWhatsapp className="text-[18px]" />
          Chat with what’sapp
        </button>
      </div>

      {/* --- Info Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-5">
          <FaLock className="text-[20px] text-gray-700" />
          <span className="text-[15px] font-medium text-gray-700">
            Secure Payments
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
          <FaTruck className="text-[20px] text-gray-700" />
          <span className="text-[15px] font-medium text-gray-700">
            Shipping & Charge
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
          <FaUndoAlt className="text-[20px] text-gray-700" />
          <span className="text-[15px] font-medium text-gray-700">
            Return Policy
          </span>
        </div>
      </div>
    </div>

      
    </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
