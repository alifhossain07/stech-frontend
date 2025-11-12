"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard2 from "@/components/ui/ProductCard2";
import Loader from "@/components/ui/Loader"; // 👈 make sure you have this

type ProductType = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
};

const FastChargerProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFastChargers = async () => {
      try {
        const res = await axios.get("/api/products/fast-chargers");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching Fast Charger products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFastChargers();
  }, []);

  return (
    <div className="md:w-11/12 w-11/12 pb-[56px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Fast Charger Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row gap-4">
        {/* LEFT: Banner Image */}
        <div className="xl:w-3/12 2xl:w-3/12 flex justify-center items-center">
          <div className="w-full h-auto md:h-full">
            <Image
              src="/images/fastchargerbanner.png"
              alt="Fast Charger Banner"
              width={400}
              height={600}
              className="rounded-xl object-contain md:object-fill w-full h-auto md:h-[500px] xl:h-full"
            />
          </div>
        </div>

        {/* RIGHT: Product Grid */}
<div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-center min-h-[700px]">
  {loading ? (
    <div className="flex justify-center items-center w-full h-[500px]">
      <Loader />
    </div>
  ) : (
    <>
      {/* Default + md (show 6) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
        {products.slice(0, 6).map((p) => (
          <ProductCard2 key={p.id} product={p} />
        ))}
      </div>

      {/* xl (show 8 → 4 per row) */}
      <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
        {products.slice(0, 8).map((p) => (
          <ProductCard2 key={p.id} product={p} />
        ))}
      </div>

      {/* 2xl (show 10 → 5 per row) */}
      <div className="hidden 2xl:grid grid-cols-5 gap-4 w-full justify-items-center">
        {products.slice(0, 10).map((p) => (
          <ProductCard2 key={p.id} product={p} />
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

export default FastChargerProducts;
