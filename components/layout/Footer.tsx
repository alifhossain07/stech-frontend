import Image from "next/image";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
} from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 mt-36 ">
      {/* Outer Wrapper */}
      <div className="w-10/12 mx-auto border-b border-gray-700 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* LEFT SECTION (4/12) */}
          <div className="md:col-span-4">
              <Image
                        src="/images/sannailogo.png"
                        alt="Like Telecom Logo"
                        width={140}
                        height={140}
                        className="object-contain  w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
                      />
            <p className="text-gray-400 mt-5 text-sm leading-relaxed mb-4">
             Sannai is dedicated to delivering innovative solutions 
with a focus on quality, creativity, and customer -
satisfaction. We believe in building experiences -
that inspire growth and trust.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
              >
                <FaTiktok className="text-white text-sm" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
              >
                <FaInstagram className="text-white text-sm" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
              >
                <FaYoutube className="text-white text-sm" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
              >
                <FaFacebookF className="text-white text-sm" />
              </a>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-4 items-center">
<p className="text-sm font-medium mb-2">Pay With</p>
            <div className="flex items-center gap-4 text-3xl ">
              <FaCcVisa className="text-blue-400 transition" />
              <FaCcMastercard className="text-red-500 transition" />
              <FaCcAmex className="text-blue-300 transition" />
              <FaCcPaypal className="text-blue-500 transition" />
           
            </div>
            </div>
            
          </div>

          {/* RIGHT SECTION (8/12) */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h3 className="text-md font-semibold mb-3">About Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Regarding Us</li>
                <li>Terms and Conditions</li>
                <li>Career</li>
              </ul>
            </div>

            {/* Important Link */}
            <div>
              <h3 className="text-md font-semibold mb-3">Important Link</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Delivery Policy</li>
                <li>Point Policy</li>
                <li>Return Policy</li>
                <li>Refund Policy</li>
                <li>Cancellation Policy</li>
                <li>Privacy Policy</li>
                <li>Warranty Policy</li>
              </ul>
            </div>

            {/* Help Us */}
            <div>
              <h3 className="text-md font-semibold mb-3">Help Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Contact Us</li>
                <li>Exchange</li>
                <li>Enouncement</li>
                <li>EMI Charge</li>
                <li>Bank Transfer</li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-md font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm mb-4">
                <li>+88019854812348</li>
                <li>+88019854812348</li>
                <li>liketele@gmail.com</li>
              </ul>

              {/* Store Locator with Google Map */}
              <div className="rounded-md overflow-hidden w-40 h-[100px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902087158993!2d90.42027327536774!3d23.750857288811812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b89832a89a67%3A0x9b4a955a8ed6f9b4!2sJamuna%20Future%20Park!5e0!3m2!1sen!2sbd!4v1699786046284!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-sm mt-6">
        Copyright © 2025 Alif Hossain. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;