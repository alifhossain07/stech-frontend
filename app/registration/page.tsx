"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // note the relative path
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { signup, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    register_by: "phone" as "phone" | "email",
    email_or_phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await signup({
        name: form.name,
        register_by: form.register_by,
        email_or_phone: form.email_or_phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      toast.success("Account created & logged in");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 md:py-20 px-4">
      <div className="w-full sm:w-11/12 xl:w-10/12 md:w-[95%] lg:w-8/12 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        {/* Left Section - Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 order-2 md:order-1">
          <div className="w-full md:w-11/12 2xl:w-9/12 sm:w-[80%]">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 text-center 2xl:text-3xl 2xl:mb-4 md:text-left">
              Create your{" "}
              <span className="text-[#FF6B01]">account</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 text-center md:text-left">
              Sign up to start shopping and track your orders
            </p>

            <div className="w-10/12 md:w-full xl:w-9/12 mx-auto md:mx-0">
              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alif Hossain"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                {/* Register By */}
                <div className="relative">
                  <label
                    htmlFor="register_by"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Register By
                  </label>
                  <select
                    id="register_by"
                    name="register_by"
                    value={form.register_by}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm bg-white focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                {/* Email or Phone */}
                <div className="relative">
                  <label
                    htmlFor="email_or_phone"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    id="email_or_phone"
                    name="email_or_phone"
                    value={form.email_or_phone}
                    onChange={handleChange}
                    placeholder="01645305138"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                {/* Password Confirmation */}
                <div className="relative">
                  <label
                    htmlFor="password_confirmation"
                    className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full border border-gray-300 rounded-md px-4 py-3 sm:py-4 text-sm focus:border-[#FF6B01] focus:ring-1 focus:ring-[#FF6B01] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B01] text-white py-2 sm:py-3 rounded-md font-semibold hover:bg-orange-600 transition text-sm sm:text-base disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Register"}
                </button>

                <p className="mt-3 text-xs sm:text-sm text-center text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#FF6B01] font-medium hover:underline"
                  >
                    Log In
                  </Link>
                </p>
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
                  <span className="text-gray-700">Sign up with Google</span>
                </button>

                <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 w-full hover:bg-gray-100 transition text-sm sm:text-base">
                  <FaFacebookF className="text-[#1877F2]" />
                  <span className="text-gray-700">Sign up with Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Image (stays on right) */}
        <div className="hidden md:block w-full md:w-1/2 bg-[#FF6B01]/10 order-1 md:order-2">
          <Image
            src="/images/loginImage.webp"
            alt="Registration Banner"
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
