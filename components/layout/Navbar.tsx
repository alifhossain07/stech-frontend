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
        <div className="relative w-full md:w-4/12">
          <input
            type="text"
            placeholder="Search your Favourite Accessories."
            className="w-full bg-black border border-black rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
            <FiSearch />
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex  gap-3 lg:gap-4">
          <button className="flex items-center gap-1 bg-orange-500 text-white px-5 lg:px-8 py-2 rounded-xl text-sm lg:text-base">
            <FiGift /> Offers
          </button>
          <div className="relative inline-block">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-200 px-5 py-2 flex items-center gap-2 underline rounded-xl text-sm lg:text-base"
            >
              English <FiChevronDown className="text-black text-lg" />
            </button>

            {open && (
              <div className="absolute mt-2 bg-white border border-gray-300 rounded-xl shadow-md w-32">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  English
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Bangla
                </button>
              </div>
            )}
          </div>

          <button className="bg-gray-200 px-5 lg:px-6 py-2 rounded-xl flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div>
                <FiShoppingCart className="text-3xl" />
              </div>
              <div className="text-left">
                <h1 className="text-base">Cart</h1>
                <p className="text-xs">01 Items</p>
              </div>
            </div>
          </button>
          <button className="bg-gray-200 px-5 lg:px-6 py-2 rounded-xl flex items-center gap-1 text-sm lg:text-base">
            <FiUser /> Login & Others
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-orange-500">
        <div className="w-10/12 hidden mx-auto md:flex justify-between items-center h-14">
          {/* Nav Links (Desktop) */}
          <ul className="hidden md:flex gap-6 lg:gap-10 text-white font-semibold text-sm lg:text-base">
            <li className="flex items-center gap-1">
              iPhone <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Samsung <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Redmi <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Poco <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Walton <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Xiaomi <FiChevronDown className="text-white text-sm" />
            </li>
            <li className="flex items-center gap-1">
              Huawei <FiChevronDown className="text-white text-sm" />
            </li>
          </ul>

          {/* Right Button */}
          <div className="bg-black hidden md:flex items-center px-4 py-3 text-white h-full text-sm lg:text-base font-medium">
            Used Device
          </div>
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

            <button className="bg-black py-2 rounded-md text-white mt-6">
              Used Device
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
