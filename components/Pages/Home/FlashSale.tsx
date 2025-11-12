"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import Loader from "@/components/ui/Loader"; // 👈 make sure you have a loader component

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  slug?: string;
}

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await axios.get("/api/products/flashsale");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching Flash Sale products:", error);
      } finally {
        setLoading(false);
      }
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

        <button className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Flash Sale Layout */}
      <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row items-stretch justify-between gap-6">
        {/* Left: Deal of the Day */}
        <div
          className="relative flex flex-col justify-center items-center rounded-2xl p-8 text-center md:w-full xl:w-72 2xl:w-96 min-h-full overflow-hidden"
          style={{
            backgroundImage: `url('/images/flashsale.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative text-white space-y-5 z-10">
            <p className="text-sm font-medium opacity-90">
              Only One Week Offer’s
            </p>
            <h1 className="md:text-2xl text-xl font-bold">Deal Of The Day</h1>
            <p className="md:text-lg">
              Explore brand-new products crafted for style, quality, and innovation.
            </p>

            {/* Countdown */}
            <div className="grid grid-cols-4 md:ml-16 ml-5 xl:ml-0 xl:mr-4 2xl:mr-0 2xl:ml-0 mt-10 xl:gap-7 2xl:gap-4">
              {[
                { value: "03", label: "Days" },
                { value: "24", label: "Hours" },
                { value: "12", label: "Mins" },
                { value: "36", label: "Sec" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14"
                >
                  <span className="2xl:text-2xl font-bold leading-none">
                    {item.value}
                  </span>
                  <span className="2xl:text-[16px] font-medium mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Product Grid */}
        <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-center min-h-[300px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Default + md: show 6 */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                {products.slice(0, 6).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* xl + 2xl: show 4 */}
              <div className="hidden xl:grid grid-cols-4 gap-4 w-full justify-items-center">
                {products.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile “See More” Button */}
      <div className="flex items-center justify-center md:hidden pt-[44px]">
        <button className="bg-black text-xs sm:text-sm md:text-sm flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default FlashSale;
