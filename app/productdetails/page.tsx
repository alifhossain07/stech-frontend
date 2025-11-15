"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiShoppingBag,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import YouMayLike from "./YouMayLike";
import FAQ from "./FAQ";
import Reviews from "./Reviews";

const Page = () => {
  const [activeTab, setActiveTab] = useState("spec");

  const tabs = [
    { id: "spec", label: "Specification" },
    { id: "details", label: "Product Details" },
    { id: "review", label: "Review" },
    { id: "faq", label: "Faq" },
  ];

  const products = [
    {
      id: 1,
      name: "AirPods Pro (2nd generation) USB-",
      price: 2600,
      oldPrice: 2800,
      discount: "10% OFF",
      image: "/images/nb.png",
    },
    {
      id: 2,
      name: "AirPods Pro (2nd generation) USB-",
      price: 2600,
      oldPrice: 2800,
      discount: "10% OFF",
      image: "/images/nb.png",
    },
    {
      id: 3,
      name: "AirPods Pro (2nd generation) USB-",
      price: 2600,
      oldPrice: 2800,
      discount: "10% OFF",
      image: "/images/nb.png",
    },
    {
      id: 4,
      name: "AirPods Pro (2nd generation) USB-",
      price: 2600,
      oldPrice: 2800,
      discount: "10% OFF",
      image: "/images/nb.png",
    },
  ];

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
                Delivery Timescale :{" "}
                <span className="font-semibold">3–6 Days</span>
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-[15px] font-medium text-gray-800">
                Quantity :
              </span>
              <div className="flex items-center justify-between bg-gray-50 rounded-full px-4 py-2 w-[120px]">
                <button
                  onClick={decrease}
                  className="text-white rounded-full bg-orange-500 text-lg font-bold "
                >
                  <FiMinus />
                </button>
                <span className="text-lg font-semibold text-gray-800">
                  {quantity}
                </span>
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
              <button className="flex w-1/2 items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-10 py-4 rounded-full text-[15px] transition-all">
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
                  <span className="text-[15px] font-medium text-gray-800">
                    Share :
                  </span>
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
                  <Image
                    src="/images/sp.png"
                    alt="Fast Charging"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="text-[15px] font-medium text-gray-700">
                    Secure Payments
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                  <Image
                    src="/images/scc.png"
                    alt="Fast Charging"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="text-[15px] font-medium text-gray-700">
                    Shipping & Charge
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                  <Image
                    src="/images/rp.png"
                    alt="Fast Charging"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="text-[15px] font-medium text-gray-700">
                    Return Policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specs Container */}
      <div className=" mt-10 flex gap-6 w-full ">
        <div className="w-[80%] ">
          <div className="w-full bg-white rounded-xl">
            {/* --- Tabs --- */}
            <div className="grid grid-cols-4 gap-3 bg-gray-100 p-2 rounded-t-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm sm:text-base font-semibold rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* --- Content Area --- */}
            <div className="border border-t-0 rounded-b-xl overflow-hidden">
              {activeTab === "spec" && (
                <table className="w-full text-left text-[15px] border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="w-1/3 py-5 px-4 font-medium text-gray-800">
                        Brand
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        Sannai Technology
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-5 px-4 font-medium text-gray-800">
                        Model
                      </td>
                      <td className="py-3 px-4 text-gray-700">Tune 500V</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-5 px-4 font-medium text-gray-800">
                        Connection Type
                      </td>
                      <td className="py-3 px-4 text-gray-700">Wired</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-5 px-4 font-medium text-gray-800">
                        Weight
                      </td>
                      <td className="py-3 px-4 text-gray-700">600gm</td>
                    </tr>
                    <tr>
                      <td className="py-5 px-4 font-medium text-gray-800">
                        Other Features
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        Driver Sensitivity: 1kHz/1mW: 24dBV/Pa | Impedance: 32
                        ohms | Flat-Fold Design | Built-in Microphone
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {activeTab === "details" && (
                <div className="p-5 text-gray-700 text-[15px]">
                  The Tune 500V delivers immersive sound, comfortable ear
                  cushions, and premium design with long-lasting build quality.
                </div>
              )}

              {activeTab === "review" && (
                <div className="p-5 text-gray-700 text-[15px]">
                  No reviews yet. Be the first to write a review!
                </div>
              )}

              {activeTab === "faq" && (
                <div className="p-5 text-gray-700 text-[15px]">
                  <p>
                    <strong>Q:</strong> Does this support wireless mode? <br />
                    <strong>A:</strong> No, this model is wired only.
                  </p>
                </div>
              )}
            </div>

            {/* Product Details  */}
            <div className="w-full font-medium  border-t border-gray-200 pt-4">
              {/* Title */}
              <h2 className="text-2xl font-semibold mb-4">- Product Details</h2>

              {/* Main content */}
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left text block */}
                <div className="md:w-[60%]">
                  <p className="text-[15px] mb-2 leading-relaxed">
                    <strong>Technical Specifications:</strong> Mi 20W Charger
                    (Type–C) EU
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[15px]">
                    <li>Product Name: Mi 20W Charger (Type–C)</li>
                    <li>Model: AD201</li>
                    <li>Input: 100–240V~50/60Hz, 0.5A</li>
                    <li>Output Port: USB Type–C</li>
                    <li>Output: 5V/3A, 9V/2.22A, 12V/1.67A (20W Max)</li>
                    <li>Dimensions: 30 x 22.5 x 43 mm</li>
                    <li>Weight: 43.8g</li>
                    <li>Fast Charging: Supports PD and multiple protocols</li>
                    <li>
                      Compatibility: iPhone 12, Mi 11, Samsung S10, iPad Pro,
                      Nintendo Switch
                    </li>
                    <li>Safety Features:</li>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Overvoltage protection</li>
                      <li>Input/output overcurrent protection</li>
                      <li>Short circuit & overheat protection</li>
                      <li>Low electromagnetic interference</li>
                      <li>Low ripple & static electricity resistance</li>
                    </ul>
                    <li>Design: Compact, portable, white finish</li>
                    <li>Note: Data cable not included</li>
                  </ul>
                </div>

                {/* Right image */}
                <div className="md:w-[40%] flex justify-center md:justify-end">
                  <Image
                    src="/images/pdetails.png"
                    alt="charger"
                    width={400}
                    height={400}
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Long paragraph below image */}
              <div className="mt-4 text-[15px] leading-relaxed">
                <p>
                  Sannai 22.5–Watt Fast Charger: Experience lightning-fast
                  charging with our 18W charger, designed for universal
                  compatibility and equipped with advanced safety features.
                  Compact, durable, and perfect for powering up your devices
                  efficiently.{" "}
                  <strong>
                    Sannai 22.5–Watt Fast Charger: The Ultimate Fast Charging
                    Solution
                  </strong>
                </p>
                <p className="mt-3">
                  Looking for a reliable, high–performance charger that powers
                  up your devices quickly and safely? The Sannai 22.5–Watt Fast
                  Charger is the perfect choice for tech–savvy users. With
                  cutting–edge technology, universal compatibility, and robust
                  safety features, this charger ensures a hassle–free charging
                  experience every time.
                </p>
              </div>
            </div>

            {/* image div */}
            <div className="w-full relative mt-8 h-[450px]">
              {" "}
              {/* ← change height later */}
              <Image
                src="/images/fastchargerbanner.png" // replace with your image path
                alt="Product image"
                fill
                className="object-fill rounded-lg"
                priority
              />
            </div>

            <FAQ/>
            <Reviews/>
          </div>
        </div>

        <div className="w-[20.5%] bg-white rounded-2xl shadow-sm ">
          <h2 className="text-lg bg-[#f4f4f4] py-4 font-semibold text-center mb-4">
            Recently Viewed
          </h2>

          <div className="flex flex-col gap-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-[#f4f4f4] rounded-xl p-2 hover:shadow-md transition"
              >
                <div className="w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col text-sm flex-1">
                  <p className="leading-tight text-gray-800 font-medium">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-500 font-semibold">
                      ৳{item.price}
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-[1px] rounded-md font-semibold">
                      {item.discount}
                    </span>
                    <span className="text-gray-400 line-through text-xs">
                      ৳{item.oldPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <YouMayLike />
    </div>
  );
};

export default Page;
