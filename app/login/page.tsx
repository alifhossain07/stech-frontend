"use client";

import React from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Page = () => {
  return (
    <div className="flex items-center justify-center py-12 md:py-20  px-4">
      <div className="w-full sm:w-11/12 xl:w-10/12 md:w-[95%] lg:w-8/12 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full md:w-11/12 2xl:w-9/12 sm:w-[80%]">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 text-center 2xl:text-3xl 2xl:mb-4 md:text-left">
              Welcome To{" "}
              <span className="text-[#FF6B01]">Sannai Technology!</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 text-center md:text-left">
              Signup/login to enjoy the feature of Revolute
            </p>
            <div className="w-10/12 md:w-full xl:w-9/12  mx-auto md:mx-0">
              {/* Form */}
              <form className="space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                {/* Login Field */}
                <div className="relative">
                  <label
                    htmlFor="login"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-orange-600"
                  >
                    Login with mobile number/e-mail
                  </label>
                  <input
                    type="password"
                    id="login"
                    className="w-full border border-orange-600 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                <div className="text-right">
                  <a
                    href="#"
                    className="text-xs text-gray-400 hover:text-[#FF6B01]"
                  >
                    Forgot Your Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF6B01] text-white py-2 sm:py-3 rounded-md font-semibold hover:bg-orange-600 transition text-sm sm:text-base"
                >
                  Sign up/Login
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-2 my-6">
                <div className="h-px bg-gray-300 w-full"></div>
                <p className="text-gray-400 text-sm">or</p>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>

              {/* Social Logins */}
              <div className="space-y-3">
                <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full hover:bg-gray-100 transition text-sm sm:text-base">
                  <FcGoogle className="text-lg" />
                  <span className="text-gray-700">
                    Sign up / Login with Google
                  </span>
                </button>

                <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full hover:bg-gray-100 transition text-sm sm:text-base">
                  <FaFacebookF className="text-[#1877F2]" />
                  <span className="text-gray-700">
                    Sign up / Login with Facebook
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block w-full md:w-1/2 bg-[#FF6B01]/10">
          <Image
            src="/images/loginImage.webp"
            alt="Login Banner"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
