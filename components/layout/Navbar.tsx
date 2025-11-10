"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  FiChevronDown,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiGift,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);
  const handleCloseMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMenuOpen(false);
    }, 300); // Match your animation duration (0.3s)
  };
  const categories = [
    {
      name: "Fast Charger",
      subcategories: ["18W Chargers", "33W Chargers", "65W Chargers"],
    },
    {
      name: "Fast Cable",
      subcategories: ["Type-C Cable", "Micro USB", "Lightning Cable"],
    },
    {
      name: "Neckband",
      subcategories: ["Sports Series", "Bass Boost", "Pro Series"],
    },
    {
      name: "TWS",
      subcategories: ["Gaming TWS", "Music TWS", "Noise Cancel TWS"],
    },
    {
      name: "Power Bank",
      subcategories: ["10,000 mAh", "20,000 mAh", "Mini Power Banks"],
    },
    { name: "Ear Phone", subcategories: ["Wired", "Wireless", "Studio Grade"] },
    { name: "About Us", subcategories: [] },
    { name: "Our Blog", subcategories: [] },
    { name: "Contact Us", subcategories: [] },
    { name: "Authentication", subcategories: [] },
  ];

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // For Language dropdown
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }

    // For Navbar submenu
    if (
      submenuRef.current &&
      !submenuRef.current.contains(event.target as Node)
    ) {
      setHoveredCategory(null); // For desktop hover submenus
      setExpandedCategory(null); // For mobile submenu
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <>
      {/* ========= HEADER FIXED AT TOP ========= */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* Top Bar */}
        <div className="py-1 hidden xl:block border-b border-gray-100 bg-black text-white">
          <div className="w-11/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Contact Us 24/7:</span>
              <a
                href="tel:+--854789956"
                className="underline hover:text-yellow-300"
              >
                +--854789956
              </a>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-lg" />
              <span>Store Locations</span>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="w-11/12 mx-auto py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex justify-between w-full md:w-full lg:w-auto items-center">
            <Link href="/">
              <Image
                src="/images/sannailogo.png"
                alt="Sannai Technology Logo"
                width={140}
                height={140}
                className="object-contain w-24 sm:w-32 md:w-28 xl:w-32 2xl:w-36 h-auto"
              />
            </Link>
            {/* Hamburger Icon */}
            <button
              className="text-2xl text-orange-500 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <FiMenu />
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative w-full md:w-96  2xl:w-[550px] mr-6">
              <input
                type="text"
                placeholder="Search your Favourite Accessories."
                className="w-full text-white bg-black border border-black rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
                <FiSearch />
              </button>
            </div>

            <button
              className="flex items-center gap-1 text-white px-5 mr-5 lg:px-4 py-2 rounded-xl text-sm"
              style={{
                background: "linear-gradient(to bottom, #FFD522, #FF6B01)",
              }}
            >
              <FiGift className="text-base mr-1 animate-pulseScaleColor" />{" "}
              Offers
            </button>

            {/* Language Dropdown */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="border hover:text-gray-600 border-gray-400 px-5 py-2 h-[46px] flex items-center gap-2 rounded-md text-md bg-white"
              >
                <span className="underline">English</span>
                <FiChevronDown className="text-black text-2xl" />
              </button>

              <div
                className={`absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50 transform transition-all duration-200 ${
                  open
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  English
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Bangla
                </button>
              </div>
            </div>

            <button className="border hover:text-gray-600 border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-3 text-sm">
              <FiShoppingCart className="text-2xl 2xl:text-3xl" />
              <div className="text-left">
                <h1 className="text-base">Cart</h1>
                <p className="text-xs">01 Items</p>
              </div>
            </button>

            <button className="border hover:text-gray-600 border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-1 text-sm">
              <Link href="/login" className="flex items-center gap-2">
                <FiUser className="text-2xl 2xl:text-3xl" />
                <div className="text-left">
                  <h1 className="text-base">Profile</h1>
                  <p className="text-xs">Amanullah</p>
                </div>
              </Link>
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="bg-orange-500 hidden lg:block">
          <div className="w-11/12 mx-auto flex justify-between items-center h-10">
            <ul className="flex gap-6 text-white font-semibold text-sm">
              {categories.map((category, i) => (
                <li
                  key={i}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center gap-1 hover:text-gray-300 duration-300">
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <FiChevronDown className="text-white text-sm" />
                    )}
                  </div>

                  {category.subcategories.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg transition-all duration-300 transform origin-top ${
                        hoveredCategory === category.name
                          ? "opacity-100 visible scale-100 translate-y-0"
                          : "opacity-0 invisible scale-95 -translate-y-2"
                      }`}
                    >
                      <ul className="min-w-[180px] py-2">
                        {category.subcategories.map((sub, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 text-sm transition"
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Add padding to prevent overlap */}
      <div className="pt-[70px] xl:pt-[150px]"></div>

      {/* ========= MOBILE BOTTOM FIXED NAV ========= */}
      <div className="bg-orange-500 fixed bottom-0 left-0 w-full flex justify-around items-center py-2 text-white lg:hidden z-50">
        <Link href="/" className="flex flex-col items-center text-xs">
          <FiHome className="text-lg mb-1" />
          Home
        </Link>
        <button className="flex flex-col items-center text-xs">
          <FiGift className="text-lg mb-1" />
          Offers
        </button>
        <button className="flex flex-col items-center text-xs">
          <FiShoppingCart className="text-lg mb-1" />
          Cart
        </button>
        <button className="flex flex-col items-center text-xs">
          <FiUser className="text-lg mb-1" />
          Profile
        </button>
      </div>

      {/* ========= MOBILE SIDEBAR ========= */}
      {menuOpen && (
        <>
          {/* Background Overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleCloseMenu}
          ></div>

          {/* Sidebar with slide animation */}
          <div
            className={`fixed left-0 top-0 w-72 sm:w-80 h-full bg-white shadow-lg z-50 overflow-y-auto ${
              closing ? "animate-slideOut" : "animate-slideIn"
            }`}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <Image
                src="/images/sannailogo.png"
                alt="Sannai Logo"
                width={120}
                height={120}
                className="object-contain w-24"
              />
              <button
                className="text-3xl text-orange-500"
                onClick={handleCloseMenu}
              >
                <FiX />
              </button>
            </div>

            <ul ref={submenuRef} className="p-4 space-y-3 text-gray-800 font-medium">
              <button className="mt-1 w-full py-4 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg hover:opacity-90 transition text-sm">
                Buy Dealer Products
              </button>

              {categories.map((cat, index) => (
                <li key={index}>
                  <button
                    className="flex justify-between w-full items-center py-2 text-left"
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === cat.name ? null : cat.name
                      )
                    }
                  >
                    {cat.name}
                    {cat.subcategories.length > 0 && (
                      <FiChevronDown
                        className={`transform transition-transform ${
                          expandedCategory === cat.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  <div
  className={`ml-4 border-l border-gray-200 pl-3 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
    expandedCategory === cat.name
      ? "max-h-40 opacity-100 translate-y-0"
      : "max-h-0 opacity-0 -translate-y-2"
  }`}
>
  <ul className="space-y-1">
    {cat.subcategories.map((sub, subIndex) => (
      <li
        key={subIndex}
        className="py-1 text-sm text-gray-600 hover:text-orange-500 cursor-pointer"
      >
        {sub}
      </li>
    ))}
  </ul>
</div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
