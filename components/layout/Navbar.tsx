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
        <div className="w-10/12 mx-auto flex flex-col md:flex-row justify-between gap-3 md:gap-0">
          {/* Left - Info Links */}
          <div className="flex flex-wrap justify-center md:justify-start font-semibold 0 gap-4 text-sm">
            <div className="font-semibold  text-center md:text-right text-sm">
              Contact Us 24/7: +--854789956
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-lg" />
              <span className="hidden sm:inline">Store Locations</span>
            </div>
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
            className="object-contain"
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
  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className=" border border-gray-400 px-5 lg:px-6 py-2 h-[46px] flex items-center gap-2 rounded-md text-sm lg:text-base"
    >
      <span className="underline">English</span>
      <FiChevronDown className="text-black text-2xl" />
    </button>

    {open && (
      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50">
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
          English
        </button>
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
          Bangla
        </button>
      </div>
    )}
  </div>

  <button className=" border border-gray-400 px-5 lg:px-6 py-2 h-[46px] rounded-md flex items-center gap-3 text-sm">
    <div className="flex items-center gap-2">
      <FiShoppingCart className="text-3xl" />
      <div className="text-left">
        <h1 className="text-base">Cart</h1>
        <p className="text-xs">01 Items</p>
      </div>
    </div>
  </button>

  <button className="border border-gray-400 px-5 lg:px-6 py-2 h-[46px] rounded-md flex items-center gap-1 text-sm lg:text-base">
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
          <ul className="hidden md:flex gap-6 lg:gap-4 text-white font-semibold text-sm ">
            <li className="flex items-center gap-1">
             Fast Charger <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Fast Cable <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Neckband <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              TWS <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
             Power Bank <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Ear Phone <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
             About Us <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
             Our Blog <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
             Contact Us <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
             Authentication <FiChevronDown className="text-white text-sm" />
            </li>
          </ul>

          {/* Right Button */}
         
        </div>

        {/* MOBILE: Offers, Cart, Login */}
        <div className="md:hidden  mx-auto py-3 flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-1 bg-orange-400 text-white px-3 py-1 rounded-xl text-sm">
            <FiGift /> Offers
          </button>
          <button className="bg-white text-black px-3 py-1 rounded-xl flex items-center gap-1 text-sm">
            <FiShoppingCart /> 01 Items
          </button>
          <button className="bg-white text-black px-3 py-1 rounded-xl flex items-center gap-1 text-sm">
            <FiUser /> Login & Others
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

              {/* Links */}
              <div className="space-y-3">
                <button className="bg-gray-100 text-black w-full py-2 rounded-md">
                  Exclusive Sale
                </button>
                <button className="bg-gray-100 text-black w-full py-2 rounded-md">
                  Corporate
                </button>
              </div>

              <div className="border-t border-white/30 my-4"></div>

              {/* Category List */}
              <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                <p>iPhone</p>
                <p>Samsung</p>
                <p>Redmi</p>
                <p>Poco</p>
                <p>Walton</p>
                <p>Xiaomi</p>
                <p>Huawei</p>
              </div>
            </div>

           
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
