"use client";
import React, { useRef, useState, useEffect } from "react";
import { RefObject } from "react";
import { useCart } from "@/app/context/CartContext";
import { useParams } from "next/navigation";
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
// import Reviews from "./Reviews";
import ProductSkeleton from "./ProductSkeleton";
interface Brand {
  id: number;
  name: string;
}

interface FeaturedSpec {
  icon: string;
  text: string;
}

interface ProductVariant {
  variant: string;
  price: number;
  sku: string;
  qty: number;
  image: string | null;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductType {
  id: number;
  name: string;
  main_price: number;
  stroked_price: number;
  discount: string;
  brand: Brand;
   product_compatible: string[];
  description: string;
  photos: { path: string }[];
  colors: string[];
  featured_specs: FeaturedSpec[];
  current_stock: number;
  est_shipping_time: number;

   model_number?: string;
  connection_type?: string;
  weight: number; 
  other_features?: string;
  faqs?: FAQItem[];
  variants: ProductVariant[];
  thumbnail_image?: string; 
}

// Optional: Recently Viewed Products
// interface RecentProduct {
//   id: number;
//   name: string;
//   price: number;
//   oldPrice: number;
//   discount: ssdsdstring;
//   image: string;
// }
const Page = () => {


const { slug } = useParams(); // <-- grabs slug from URL
const { addToCart, setCartOpen } = useCart();
const [product, setProduct] = useState<ProductType | null>(null);
 const [cartLoading, setCartLoading] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("spec");
  const specRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
 
 

  useEffect(() => {
    if (!slug) return;

   const fetchProduct = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch product");

    const data: ProductType = await res.json(); // <-- explicitly typed
    setProduct(data);
    if (data.variants && data.variants.length > 0) {
  setSelectedVariant(data.variants[0].variant);
}
  } catch (err: unknown) {   // <-- avoid 'any' here too
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

    fetchProduct();
  }, [slug]);
  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
const shareText = encodeURIComponent(`${product?.name || 'Check out this product'}`);

const shareOnPlatform = (platform: string) => {
  let shareLink = '';
  
  switch (platform) {
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      break;
    case 'twitter': // Now X
      shareLink = `https://x.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
      break;
    case 'instagram':
      // Instagram web doesn't support direct sharing - redirect to mobile app or profile
      shareLink = `https://www.instagram.com/?url=${shareUrl}`;
      break;
    case 'youtube':
      // YouTube primarily shares videos; use generic share or redirect
      shareLink = `https://www.youtube.com/?url=${shareUrl}`;
      break;
    default:
      return;
  }
  
  window.open(shareLink, '_blank', 'width=600,height=400,menubar=no,toolbar=no');
};

  const parsePrice = (priceStr: string | number | null | undefined): number => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  
  // Convert to string and clean
  const cleaned = String(priceStr)
    .replace(/[^\d.]/g, '')  // Remove all non-digits except decimal
    .trim();
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const handleAdd = () => {
  if (!product) return;
  if (!slug || Array.isArray(slug)) return;
  if (cartLoading) return; // prevent double click while loading

  setCartLoading(true);

  const effectivePrice = parsePrice(
    selectedVariant
      ? product.variants.find((v) => v.variant === selectedVariant)?.price ??
          product.main_price
      : product.main_price
  );

  const image =
    product.thumbnail_image ||
    product.photos[0]?.path ||
    "/images/placeholder.png";

  setTimeout(() => {
    addToCart({
      id: product.id.toString(),
      slug: String(slug),
      name: product.name,
      price: effectivePrice,
      oldPrice: parsePrice(product.stroked_price),
      img: image,
      qty: quantity,
      variant: selectedVariant || undefined,
      variantImage: image,
    });

    setCartOpen(true);
    setCartLoading(false);
  }, 1500); // 2 seconds
};
  

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



  if (loading) return <ProductSkeleton />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">No product found</p>;
const images = product.photos.map((photo) => photo.path);
const colors = product.colors;
  return (
    <div className="md:mt-10 mt-5 w-11/12 mx-auto">
      {/* Product Details Container */}
      <div className="xl:h-[1038px] flex flex-col xl:flex-row gap-6">
        {/* ---------- Left: Images ---------- */}
        <div className="2xl:w-[55%] xl:w-[50%] flex flex-col justify-between">
          {/* Main Image Container */}
          <div className="h-[84%] w-full flex items-center justify-center bg-[#f6f6f6] rounded-xl relative overflow-hidden">
            {/* 🔥 Logo Overlay */}
            <div className="absolute top-7 left-10 z-20">
              <Image
                src="/images/sannailogo.png" // your logo file
                alt="Logo"
                width={50}
                height={50}
                className="object-contain xl:w-32 w-14 md:w-20 opacity-95"
              />
            </div>

            {/* Main Product Image (Slightly Smaller) */}
            <Image
              src={images[selectedImage]}
              alt={`Product Image ${selectedImage + 1}`}
              width={800} // 🔥 smaller image width
              height={800} // 🔥 smaller image height
              className="
  object-contain 
  w-64 h-80
  md:w-80 md:h-96
  xl:w-[600px] xl:h-[600px]
  2xl:w-[600px] 2xl:h-[600px]
" // 🔥 ensures the container stays same, image smaller
            />

            {/* Left Arrow */}
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-20"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <FiChevronLeft className="text-gray-700" size={20} />
            </button>

            {/* Right Arrow */}
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-20"
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
  {images.slice(0,6).map((img: string, index: number) => (
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
        <div className=" 2xl:w-[44%] xl:w-[48%]">
          <h1 className="2xl:text-4xl xl:text-3xl text-xl font-semibold mb-2">
            {product.name}
          </h1>
          <div className="flex mb-4 items-center justify-start gap-3 bg-[#f4f4f4] xl:px-4 py-3 rounded-md 2xl:text-sm  md:text-xs text-[10px] px-1  text-gray-700">
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

            <div className="text-gray-700 font-medium">
  Status:{" "}
  {product.current_stock === 0 ? (
    <span className="text-red-600 font-semibold">Stock Out</span>
  ) : product.current_stock < 5 ? (
    <span className="text-orange-500 font-semibold">Low Stock</span>
  ) : (
    <span className="text-green-600 font-semibold">In Stock</span>
  )}
</div>


            <div className="h-4 w-px bg-gray-300"></div>

            <div className="text-gray-700 font-medium">
              Product ID: {product.id}
            </div>
          </div>

          <p className="text-orange-500 text-[8px] 2xl:text-[10px] mb-2">
            ★ Most Viewed Products ★
          </p>

          <div className="flex items-center justify-between w-full mb-3">
            {/* -------- Left: Price Section -------- */}
            <div className="flex items-center justify-center gap-3 ">
              {/* New Price */}
              <span className="2xl:text-[32px] xl:text-[26px] text-[20px] font-semibold text-orange-500">
                {product.main_price}
              </span>

              {/* Discount Badge */}
              <span className="bg-green-100  text-green-600 2xl:text-[16px] xl:text-[13px] font-semibold text-xs px-2 py-[2px] rounded-full">
                {product.discount} OFF
              </span>

              {/* Old Price */}
              <span className="text-gray-400 line-through  2xl:text-[16px] xl:text-[13px]">
               {product.stroked_price}
              </span>
            </div>

            {/* -------- Right: Compare & Wishlist -------- */}
            {/* -------- Right: Compare & Wishlist -------- */}
            <div className="flex items-center gap-4 text-gray-500">
              {/* --- Mobile Icons Only --- */}
              <div className="flex md:hidden items-center gap-3">
                {/* Compare Icon Button */}
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16h8M8 12h8m-8-4h8m-6 8v4m4-4v4"
                    />
                  </svg>
                </button>

                {/* Wishlist Icon Button */}
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5a4.5 4.5 0 00-3.75 2.028A4.5 4.5 0 009 3.75C6.515 3.75 4.5 5.765 4.5 8.25c0 7.125 7.5 11.25 7.5 11.25s7.5-4.125 7.5-11.25z"
                    />
                  </svg>
                </button>
              </div>

              {/* --- Desktop Buttons (md and up) --- */}
              <div className="hidden md:flex items-center gap-4 text-[16px]">
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
          </div>

          {/* Quick Overview */}
          <div>
            <p className="tracking-wide 2xl:text-[14px] xl:text-[12px] font-medium mb-2">
              Quick Overview :
            </p>
            <div className="space-y-2">
              {/* Item 1 */}
             {product.featured_specs.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-[#f4f4f4] rounded-md 2xl:px-4 2xl:py-3 xl:px-4 xl:py-2 py-1"
          >
            <Image
              src={item.icon}
              alt={item.text}
              width={20}
              height={20}
              className="object-contain"
            />
            <span
              className={`md:text-[16px] text-[12px] text-black ${
                index === 4 ? "underline" : ""
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}

            </div>
          </div>

          {/* Product Compatible */}

          <div className="bg-[#f4f4f4] rounded-xl p-4 mt-2">
  <h1 className="tracking-wide text-[14px] font-medium mb-2">
    Product Compatible
  </h1>

  <div className="flex flex-wrap gap-2 md:gap-4">
    {product?.product_compatible?.map((brand) => (
      <button
        key={brand}
        className="
          bg-black text-white rounded-full 
          px-3 py-[4px] text-[12px]       /* mobile */
          md:px-4 md:py-1 md:text-[16px]  /* md and up */
        "
      >
        {brand}
      </button>
    ))}
  </div>
</div>

          <div className="bg-gray-50 px-4 py-3 rounded-lg flex flex-wrap items-start justify-between gap-4 mt-3">
  {/* Variants */}
  <div className="flex items-start gap-3">
    <span className="text-[14px] font-medium text-gray-700 mt-1 shrink-0">
      Variants :
    </span>
    <div
      className="
        flex gap-2 py-1
        overflow-x-auto whitespace-nowrap
        md:overflow-visible md:whitespace-normal md:flex-wrap
      "
    >
      {product.variants?.map((v) => (
  <div key={v.sku || v.variant} className="relative group">
    <button
      onClick={() => setSelectedVariant(v.variant)}
      className={`
        px-3 py-[4px] rounded-full text-[13px] font-medium border transition-all duration-200
        md:max-w-[140px] md:truncate
        ${
          selectedVariant === v.variant
            ? "bg-gray-200 text-orange-500 border-orange-400"
            : "bg-gray-100 text-gray-700 border-transparent hover:border-gray-300"
        }
      `}
    >
      {v.variant}
    </button>

    {/* Tooltip */}
    <div
      className="
        pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2
        hidden whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-md
        group-hover:block
      "
    >
      {v.variant}
    </div>
  </div>
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
                <span className="font-semibold">{product.est_shipping_time} Days</span>
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
            <div className="flex items-center gap-3 md:gap-4">
              {/* Buy Now */}
              <button
                className="
      flex items-center justify-center w-1/2
      bg-orange-500 hover:bg-orange-600 text-white font-medium
      gap-2 rounded-full transition-all

      px-4 py-2 text-[13px]        /* mobile */
      md:px-10 md:py-4 md:text-[15px] /* md+ */
    "
              >
                <FiShoppingBag className="text-sm md:text-lg" />
                Buy Now
              </button>

              {/* Add to Cart */}
             <button
  onClick={handleAdd}
  disabled={cartLoading}
  className={`
    flex items-center justify-center w-1/2
    border border-gray-400 hover:border-gray-600 text-gray-800 font-medium
    gap-2 rounded-full transition-all
    px-4 py-2 text-[13px]
    md:px-10 md:py-4 md:text-[15px]
    ${cartLoading ? "opacity-70 cursor-not-allowed" : ""}
  `}
>
  {cartLoading ? (
    <>
      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <span>Adding...</span>
    </>
  ) : (
    <>
      <FiPlus className="text-sm md:text-lg" />
      <span>Add to Cart</span>
    </>
  )}
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
  <FaFacebookF 
    className="cursor-pointer hover:text-orange-500 transition-all" 
    onClick={() => shareOnPlatform('facebook')}
  />
  <FaInstagram 
    className="cursor-pointer hover:text-orange-500 transition-all" 
    onClick={() => shareOnPlatform('instagram')}
  />
  <FaTwitter 
    className="cursor-pointer hover:text-orange-500 transition-all" 
    onClick={() => shareOnPlatform('twitter')}
  />
  <FaYoutube 
    className="cursor-pointer hover:text-orange-500 transition-all" 
    onClick={() => shareOnPlatform('youtube')}
  />
</div>
                </div>

                {/* WhatsApp Button */}
                <button className="flex mt-2 md:mt-0 items-center gap-2 bg-green-100 text-green-700 font-medium text-[15px] px-5 py-2 rounded-full hover:bg-green-200 transition-all">
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
                  <span className="md:text-[15px] text-sm font-medium text-gray-700">
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
                  <span className="md:text-[15px] text-sm font-medium text-gray-700">
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
                  <span className="md:text-[15px] text-sm font-medium text-gray-700">
                    Return Policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specs Container */}
      <div className=" mt-24 flex flex-col xl:flex-row gap-6 w-full ">
        <div className="xl:w-[80%] w-full ">
          <div className="w-full bg-white rounded-xl">
            {/* --- Tabs --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-100 p-2 rounded-t-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "spec") {
                      setActiveTab("spec");
                    } else if (tab.id === "details") {
                      scrollToSection(detailsRef);
                    } else if (tab.id === "review") {
                      scrollToSection(reviewRef);
                    } else if (tab.id === "faq") {
                      scrollToSection(faqRef);
                    }
                  }}
                  className={`md:py-4 py-3 text-[12px] md:text-base font-semibold rounded-md transition-all duration-200 ${
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
                <div ref={specRef}>
                  <table className="w-full text-left text-[12px] md:text-[15px] border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="w-1/3 py-5 px-4 font-medium text-gray-800">
                          Brand
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.brand.name}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-5 px-4 font-medium text-gray-800">
                          Model
                        </td>
                        <td className="py-3 px-4 text-gray-700">{product.model_number}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-5 px-4 font-medium text-gray-800">
                          Connection Type
                        </td>
                        <td className="py-3 px-4 text-gray-700">{product.connection_type}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-5 px-4 font-medium text-gray-800">
                          Weight
                        </td>
                        <td className="py-3 px-4 text-gray-700">{product.weight * 1000} g</td>
                      </tr>
                      <tr>
                        <td className="py-5 px-4 font-medium text-gray-800">
                          Other Features
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {product.other_features}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
            <div
              ref={detailsRef}
              className="w-full scroll-mt-36 font-medium  border-t border-gray-200 pt-4"
            >
              <h1 className="text-4xl font-bold mb-10">- Product Details</h1>
             <div
        className="prose max-w-none "
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
              
            </div>

            
            
            
           <div className="scroll-mt-36" ref={faqRef}>
  {product.faqs && product.faqs.length > 0 ? (
    <FAQ faqs={product.faqs} />
  ) : (
    <p className="text-gray-500 text-center py-5">
      No FAQs available for this product.
    </p>
  )}
</div>
            {/* <div className="scroll-mt-36" ref={reviewRef}>
              <Reviews />
            </div> */}
          </div>
        </div>

        <div className="xl:w-[20.5%] w-full bg-white rounded-2xl shadow-sm ">
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
