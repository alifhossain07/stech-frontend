"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
// import { MdOutlineHeadsetMic, MdOutlineLocalShipping } from "react-icons/md";
import {
  FiChevronDown,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiGift,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full relative z-50">
      {/* Top Bar */}
      <div className="py-3 shadow-md border-b border-gray-100 bg-black text-white">
        <div className="w-10/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white md:font-semibold text-center sm:text-left">
          {/* Left - Contact */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span>Contact Us 24/7:</span>
            <a
              href="tel:+--854789956"
              className="underline hover:text-yellow-300"
            >
              +--854789956
            </a>
          </div>

          {/* Right - Store Location */}
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <FaMapMarkerAlt className="text-lg" />
            <span className="sm:inline">Store Locations</span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="w-10/12 mx-auto py-8 flex flex-col md:flex-row items-center justify-between  gap-4 md:gap-0">
        {/* Logo + Mobile Menu Button */}
        <div className="flex justify-between w-full md:w-auto items-center">
          <Image
            src="/images/sannailogo.png"
            alt="Like Telecom Logo"
            width={140}
            height={140}
            className="object-contain  w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
          />

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-2xl text-orange-500"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu />
          </button>
        </div>

        {/* Search Bar */}
        {/* <div className="relative w-full md:w-4/12">
          <input
            type="text"
            placeholder="Search your Favourite Accessories."
            className="w-full bg-black border border-black rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
            <FiSearch />
          </button>
        </div> */}

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center    gap-3 lg:gap-4">
          <div>
            <div className="relative w-full md:w-96 mr-6">
              <input
                type="text"
                placeholder="Search your Favourite Accessories."
                className="w-full bg-black border border-black rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
                <FiSearch />
              </button>
            </div>
          </div>

          <button
            className="flex items-center gap-1 text-white px-5 mr-5 lg:px-4 py-2 rounded-xl text-sm lg:text-base"
            style={{
              background: "linear-gradient(to bottom, #FFD522, #FF6B01)",
            }}
          >
            <FiGift className="text-xl mr-1 animate-pulseScaleColor" /> Offers
          </button>

          {/* Language Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={() => setOpen(!open)}
              className="border hover:text-gray-600 duration-300 border-gray-400 px-5 lg:px-3 py-2 h-[46px] flex items-center gap-2 rounded-md text-sm lg:text-base bg-white"
            >
              <span className="underline">English</span>
              <FiChevronDown className="text-black text-2xl" />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50 transform transition-all duration-200 ease-out ${
                open
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
              style={{
                position: "absolute",
                overflow: "hidden",
                willChange: "transform",
              }}
            >
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                English
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Bangla
              </button>
            </div>
          </div>
          <button className=" border hover:text-gray-600 duration-300 border-gray-400 px-5 lg:px-4 py-2 h-[46px] rounded-md flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-3xl" />
              <div className="text-left">
                <h1 className="text-base">Cart</h1>
                <p className="text-xs">01 Items</p>
              </div>
            </div>
          </button>

          <button className="border hover:text-gray-600 duration-300 border-gray-400 px-5 lg:px-4 py-2 h-[46px] rounded-md flex items-center gap-1 text-sm lg:text-base">
            <div className="flex items-center gap-2">
              <FiUser className="text-3xl" />
              <div className="text-left">
                <h1 className="text-base">Profile</h1>
                <p className="text-xs">Amanullah</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-orange-500">
        <div className="w-10/12 hidden mx-auto md:flex justify-between items-center h-14">
          {/* Nav Links (Desktop) */}
          <ul className="hidden cursor-pointer  md:flex gap-6 lg:gap-4 text-white font-semibold  text-sm ">
            <li className="flex hover:text-gray-300 duration-300  items-center gap-1">
              Fast Charger <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              Fast Cable <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300  items-center gap-1">
              Neckband <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              TWS <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              Power Bank <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Ear Phone <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              About Us <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              Our Blog <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              Contact Us <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex hover:text-gray-300 duration-300 items-center gap-1">
              Authentication <FiChevronDown className="text-white text-sm" />
            </li>
          </ul>

          {/* Right Button */}
        </div>

        {/* MOBILE: Offers, Cart, Login */}
        <div className="md:hidden  mx-auto py-3 flex flex-wrap justify-center gap-3">
          <button
            className="flex items-center gap-1 text-white px-3 rounded-xl text-sm lg:text-base"
            style={{
              background: "linear-gradient(to bottom, #FFD522, #FF6B01)",
            }}
          >
            <FiGift className="text-xl mr-1 animate-pulseScaleColor" /> Offers
          </button>
          <button className=" bg-white border border-gray-400 px-3 h-[46px] rounded-md flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-3xl" />
              <div className="text-left">
                <h1 className="text-sm">Cart</h1>
                <p className="text-xs">01 Items</p>
              </div>
            </div>
          </button>
          <button className="border px-3 bg-white border-gray-400 h-[46px] rounded-md flex items-center gap-1 text-sm lg:text-base">
            <div className="flex items-center gap-2">
              <FiUser className="text-3xl" />
              <div className="text-left">
                <h1 className="text-sm">Profile</h1>
                <p className="text-xs">Amanullah</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* SIDE DRAWER MENU */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 w-72 h-full bg-orange-600 text-white font-semibold shadow-2xl z-50 p-6 flex flex-col justify-between animate-slideIn">
            <div>
              {/* Close button */}
              <button
                className="text-white text-2xl mb-6"
                onClick={() => setMenuOpen(false)}
              >
                <FiX />
              </button>

              <ul className="space-y-3">
                {[
                  "Fast Charger",
                  "Fast Cable",
                  "Neckband",
                  "TWS",
                  "Power Bank",
                  "Ear Phone",
                  "About Us",
                  "Our Blog",
                  "Contact Us",
                  "Authentication",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="py-2 border-b border-white/20 text-sm hover:text-yellow-200 transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
