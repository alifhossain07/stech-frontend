import Image from "next/image";
import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 mt-20">
      {/* Outer Wrapper */}
      <div className="w-11/12 sm:w-10/12 mx-auto border-b border-gray-700 pb-10">
        {/* Main Grid: Left (4) + Right (8) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* LEFT SECTION */}
          <div className="md:col-span-4">
            <div className="flex flex-col items-start md:items-start text-center md:text-left">
              <Image
                src="/images/sannailogo.png"
                alt="Sannai Logo"
                width={140}
                height={140}
                className="object-contain mb-5 mx-auto md:mx-0 w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
              />

              <p className="text-gray-400 text-sm leading-relaxed mb-6 sm:w-11/12  md:text-justify text-justify">
                Sannai is dedicated to delivering innovative solutions with a
                focus on quality, creativity, and customer satisfaction. We
                believe in building experiences that inspire growth and trust.
              </p>

              {/* Email Newsletter */}
              <div className="relative w-full mb-5 md:w-96">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-24 text-black text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
                <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition text-sm">
                  Subscribe
                </button>
              </div>

              {/* Store Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <Image
                  src="/images/appstore.png"
                  alt="App Store"
                  width={110}
                  height={40}
                  className="h-10"
                />
                <Image
                  src="/images/googleplay.png"
                  alt="Play Store"
                  width={110}
                  height={40}
                  className="h-10"
                />
                <Image
                  src="/images/galaxystore.png"
                  alt="Huawei App Gallery"
                  width={110}
                  height={40}
                  className="h-10"
                />
              </div>

              {/* Social Icons */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-4 mb-2">
                <span className="font-medium text-sm">Follow Us:</span>
                {[
                  { Icon: FaFacebookF },
                  { Icon: FaInstagram },
                  { Icon: FaYoutube },
                  { Icon: BsTwitterX },
                ].map(({ Icon }, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="bg-white hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <Icon className="text-black text-sm" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Column 1 - Company */}
            <div >
              <h3 className="text-md font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>New Arrival</li>
                <li>Flash Deal</li>
                <li>Featured Products</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Support Center</li>
                <li>Privacy Policy</li>
                <li>Terms and Condition</li>
                <li>Return & Refund Policy</li>
              </ul>
              <button className="mt-3 px-4 py-2 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg hover:opacity-90 transition text-sm">
                Buy Dealer Products
              </button>
            </div>

            {/* Column 2 - Terms */}
            <div  >
              <h3 className="text-md font-semibold mb-3">Terms</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Warranty</li>
                <li>Shipping & Delivery</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Return & Refund Policy</li>
                <li>Track Order</li>
              </ul>
            </div>

            {/* Column 3 - Address */}
            <div  >
              <h3 className="text-md font-semibold mb-3">Address</h3>
              <p className="flex gap-3 text-gray-400 text-sm mb-3 leading-relaxed">
                <FaMapMarkerAlt className="text-lg flex-shrink-0 mt-1" />
                6th Floor, 45, Prabal Tower, The Cafe Rio Building, Ring Rd,
                Dhaka 1207
              </p>

              <button className="flex justify-center  items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-xl font-medium mb-3 hover:opacity-90 transition text-sm w-40  md:full">
                <IoCallOutline /> 09254879523
              </button>

              <p className="flex text-center md:text-left items-center gap-2 text-gray-400 text-sm mb-4 break-all">
                <IoMailOutline /> sannaiinfo@gmail.com
              </p>

              {/* Google Map */}
              <div className="rounded-md overflow-hidden w-full h-[150px] sm:h-[120px]">
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
      <div className="text-center text-gray-500 text-xs sm:text-sm mt-6">
        Copyright © 2025 Techdyno BD LTD. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
