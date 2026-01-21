"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import FlashSaleShimmerSkeleton from "@/components/Skeletons/FlashSaleShimmerSkeleton";
// Import the ShimmerSkeleton component

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;

}

type BackendProduct = {
  id: number;
  name: string;
  slug: string;
  main_price: string;
  stroked_price: string;
  discount: string;
  rating: string;
  thumbnail_image: string;
};

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // const [endTime, setEndTime] = useState<number>(0); // Store the end time in Unix timestamp format

  useEffect(() => {
    const fetchFlashSale = async () => {
      let interval: NodeJS.Timeout | null = null;
      try {
        const res = await axios.get("/api/products/flashsale");
        setBanner(res.data.banner);

        const mappedProducts: Product[] = res.data.products.map((product: BackendProduct) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: parseFloat(product.main_price.replace("৳", "").replace(",", "")),
          oldPrice: parseFloat(product.stroked_price.replace("৳", "").replace(",", "")),
          discount: product.discount,
          rating: parseFloat(product.rating),
          reviews: 0,
          image: product.thumbnail_image,
        }));

        setProducts(mappedProducts);

        const apiEndTime = res.data.date * 1000; // ms

        interval = setInterval(() => {
          const currentTime = Date.now();
          const timeRemaining = apiEndTime - currentTime;

          if (timeRemaining <= 0) {
            clearInterval(interval!);
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          } else {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching Flash Sale products:", error);
      } finally {
        setLoading(false);
      }

      // cleanup on unmount
      return () => {
        if (interval) clearInterval(interval);
      };
    };

    fetchFlashSale();
  }, []);

  return (
    <div className="md:w-11/12 w-11/12 mx-auto pb-[56px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Flash Sale Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <Link href="/products/flashsale" className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </Link>
      </div>

      {/* Flash Sale Layout */}
      {loading ? (
        <FlashSaleShimmerSkeleton /> // Show shimmer skeleton while loading
      ) : (
        <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row  justify-between gap-4 xl:gap-0">
          {/* Left: Deal of the Day */}
          <div
            className="relative flex flex-col justify-center items-center rounded-2xl p-8 text-center md:w-full xl:w-72 2xl:w-[410px] min-h-full overflow-hidden"
            style={{
              backgroundImage: `url(${banner})`, // Set the dynamic banner image
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <div className="relative text-white space-y-5 z-10">
              <p className="text-sm font-medium opacity-90">Only One Week Offer’s</p>
              <h1 className="md:text-2xl text-xl font-bold">Deal Of The Day</h1>
              <p className="md:text-lg">
                Explore brand-new products crafted for style, quality, and innovation.
              </p>

              {/* Countdown */}
              <div className="grid grid-cols-4 md:ml-16 ml-5 xl:ml-0 xl:mr-4 2xl:mr-0 2xl:ml-0 mt-10 xl:gap-7 2xl:gap-4">
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.days}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Days</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.hours}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Hours</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.minutes}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Mins</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.seconds}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Grid */}
          <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-center min-h-[300px]">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="hidden xl:grid grid-cols-4 gap-4 w-full justify-items-center">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSale;
