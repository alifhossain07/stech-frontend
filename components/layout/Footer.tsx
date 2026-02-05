
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { headers } from "next/headers";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

interface FooterApiData {
  footer_logo?: string;
  about_us_description?: string;
  contact_address?: string;
  contact_email?: string;
  widget_one_labels?: string;
  widget_one_links?: string;
  frontend_copyright_text?: string;
  show_social_links?: string | null;
  facebook_link?: string | null;
  twitter_link?: string | null;
  instagram_link?: string | null;
  youtube_link?: string | null;
  helpline_number?: string | null;
  play_store_link?: string | null;
  app_store_link?: string | null;
}

interface FooterApiResponse {
  success: boolean;
  data?: FooterApiData;
}

async function getFooterData(): Promise<FooterApiData | null> {
  try {
    const headersList = headers();
    const host = headersList.get("host");
    if (!host) return null;

    const protocol =
      headersList.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/footer`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json: FooterApiResponse = await res.json();
    if (!json.success || !json.data) return null;

    return json.data;
  } catch {
    return null;
  }
}

const Footer = async () => {
  const footerData = await getFooterData();

  const footerLogo = footerData?.footer_logo ?? "/images/sannailogo.png";
  const aboutDescription = footerData?.about_us_description ??
    "Sannai is dedicated to delivering innovative solutions with a focus on quality, creativity, and customer satisfaction. We believe in building experiences that inspire growth and trust.";

  const contactAddress = footerData?.contact_address ??
    "6th Floor, 45, Prabal Tower, The Cafe Rio Building, Ring Rd, Dhaka 1207";
  const contactEmail = footerData?.contact_email ?? "sannaiinfo@gmail.com";
  const helplineNumber = footerData?.helpline_number ?? "01971211333";

  const widgetLabelsRaw = footerData?.widget_one_labels ??
    "[\"New Arrival\",\"Flash Deal\",\"Featured Products\",\"About Us\",\"Contact Us\",\"Support Center\"]";
  const widgetLinksRaw = footerData?.widget_one_links ??
    "[\"/\",\"/\",\"/\",\"/\",\"/\",\"/\"]";

  let widgetLabels: string[] = [];
  let widgetLinks: string[] = [];

  try {
    widgetLabels = JSON.parse(widgetLabelsRaw);
  } catch {
    widgetLabels = [];
  }

  try {
    widgetLinks = JSON.parse(widgetLinksRaw);
  } catch {
    widgetLinks = [];
  }

  const showSocialLinks = footerData?.show_social_links === "on";
  const facebookLink = footerData?.facebook_link ?? "https://www.facebook.com/SannaiTechnology/";
  const twitterLink = footerData?.twitter_link ?? "https://x.com/";
  const instagramLink = footerData?.instagram_link ?? "https://www.instagram.com/sannai_technology/";
  const youtubeLink = footerData?.youtube_link ?? "https://www.youtube.com/@Sannai-Technology";

  const playStoreLink = footerData?.play_store_link ?? "https://play.google.com/store/apps";
  const appStoreLink = footerData?.app_store_link ?? "https://www.apple.com/app-store/";

  const copyrightHtml =
    footerData?.frontend_copyright_text ??
    "<p><span style=\"color: rgb(156, 156, 148); font-family: Roboto, Helvetica, sans-serif; font-size: 13px;\">Copyright © 2025 - </span><span style=\"color: rgb(156, 156, 148); font-family: Roboto, Helvetica, sans-serif; font-size: 13px;\">All Rights Reserved.</span></p>";

  return (
    <footer className="bg-black text-white py-12 xl:py-16 mt-10 xl:mt-14">
      {/* Outer Wrapper */}
      <div className="w-11/12 mx-auto border-b border-gray-700 pb-8 xl:pb-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-12 gap-10">
          {/* LEFT SECTION */}
          <div className="xl:col-span-4">
            <div className="flex flex-col items-start xl:items-start text-center xl:text-left">
              <Image
                src={footerLogo}
                alt="Sannai Logo"
                width={140}
                height={140}
                className="object-contain mb-5 w-28 sm:w-32 md:w-36 xl:w-40 h-auto"
              />

              <div
                className="text-gray-400 text-sm xl:text-[15px] leading-relaxed mb-6 sm:w-11/12 text-justify xl:text-justify"
                dangerouslySetInnerHTML={{ __html: aboutDescription }}
              />

              {/* Newsletter */}
              <div className="relative w-full mb-5 md:w-80 xl:w-96">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 xl:py-3 pl-4 pr-24 text-black text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
                <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white font-medium px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg hover:opacity-90 transition text-sm">
                  Subscribe
                </button>
              </div>

              {/* Store Buttons */}
              <div className="flex flex-wrap justify-center xl:justify-start gap-3 mb-6">
                <Link href={appStoreLink} target="_blank" rel="noreferrer">
                  <Image
                    src="/images/appstore.png"
                    alt="App Store"
                    width={110}
                    height={40}
                    className="h-9 xl:h-10"
                  />
                </Link>
                <Link href={playStoreLink} target="_blank" rel="noreferrer">
                  <Image
                    src="/images/googleplay.png"
                    alt="Play Store"
                    width={110}
                    height={40}
                    className="h-9 xl:h-10"
                  />
                </Link>
                <Image
                  src="/images/galaxystore.png"
                  alt="Huawei App Gallery"
                  width={110}
                  height={40}
                  className="h-9 xl:h-10"
                />
              </div>

              {/* Social Icons */}
              {showSocialLinks && (
                <div className="flex flex-wrap justify-center xl:justify-start items-center gap-3 mt-4 mb-2">
                  <span className="font-medium text-sm">Follow Us:</span>
                  <a
                    href={facebookLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray-700 p-1.5 xl:p-2 rounded-full transition"
                  >
                    <FaFacebookF className="text-black text-xs xl:text-sm" />
                  </a>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray-700 p-1.5 xl:p-2 rounded-full transition"
                  >
                    <FaInstagram className="text-black text-xs xl:text-sm" />
                  </a>
                  <a
                    href={youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray-700 p-1.5 xl:p-2 rounded-full transition"
                  >
                    <FaYoutube className="text-black text-xs xl:text-sm" />
                  </a>
                  <a
                    href={twitterLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray-700 p-1.5 xl:p-2 rounded-full transition"
                  >
                    <BsTwitterX className="text-black text-xs xl:text-sm" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Column 1 - Company */}
            <div>
              <h3 className="text-md font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                {widgetLabels.map((label, index) => {
                  const href = widgetLinks[index] ?? "#";
                  return (
                    <li
                      key={`${label}-${index}`}
                      className="hover:text-orange-500 cursor-pointer duration-300"
                    >
                      <Link href={href}>{label}</Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/dealer/registration" className="inline-block mt-5 px-4 py-3 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg hover:opacity-90 transition text-sm">
                Become a Dealer
              </Link>
            </div>

            {/* Column 2 - Terms */}
            <div>
              <h3 className="text-md font-semibold mb-3">Terms</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/footer/footerwarranty">Warranty</Link>
                </li>
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/footer/shipping">Shipping & Delivery</Link>
                </li>
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/footer/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/footer/terms">Terms & Conditions</Link>
                </li>
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/footer/return-policy">Return & Refund Policy</Link>
                </li>
                <li className="hover:text-orange-500 cursor-pointer duration-300">
                  <Link href="/trackorder">Track Order</Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Address */}
            <div>
              <h3 className="text-md font-semibold mb-3">Address</h3>
              <p className="flex gap-3 text-gray-400 text-sm mb-3 leading-relaxed">
                <FaMapMarkerAlt className="text-lg flex-shrink-0 mt-1" />
                {contactAddress}
              </p>

              <button className="flex justify-center items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-xl font-medium mb-3 hover:opacity-90 transition text-sm w-40">
                <IoCallOutline /> {helplineNumber}
              </button>

              <p className="flex text-center xl:text-left items-center gap-2 text-gray-400 text-sm mb-4 break-all">
                <IoMailOutline /> {contactEmail}
              </p>

              {/* Google Map */}
              <div className="rounded-md overflow-hidden w-full h-[160px] xl:h-[140px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.419972449816!2d90.35562917615226!3d23.768054778658282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7bc71a75901%3A0xbc0de6971840e8ab!2sSannai%20Technology%20Limited!5e0!3m2!1sen!2sbd!4v1763270186535!5m2!1sen!2sbd"
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

      {/* Bottom */}
      <div
        className="text-center text-gray-500 text-xs sm:text-sm mt-6"
        dangerouslySetInnerHTML={{ __html: copyrightHtml }}
      />
    </footer>
  );
};

export default Footer;
