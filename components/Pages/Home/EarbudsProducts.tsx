"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard2 from "@/components/ui/ProductCard2";
import Loader from "@/components/ui/Loader"; // orange circle spinner

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

const EarbudsProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarbuds = async () => {
      try {
        const res = await axios.get<ProductType[]>("/api/products/earbuds");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching earbuds products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarbuds();
  }, []);

  return (
    <div className="md:w-11/12 w-11/12 pb-[56px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Earbud Products
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
              src="/images/earbudsimage.png"
              alt="Earbuds Banner"
              width={400}
              height={600}
              className="rounded-xl object-center md:object-fill w-full h-[300px] md:h-[500px] xl:h-full"
            />
          </div>
        </div>

        {/* RIGHT: Product Grid */}
        <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-center min-h-[300px]">
          {loading ? (
            <Loader /> // 👈 only one centered loader
          ) : (
            <>
              {/* Default + md (show 10) */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                {products.slice(0, 10).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>

              {/* xl (show 8) */}
              <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
                {products.slice(0, 8).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>

              {/* 2xl (show 10) */}
              <div className="hidden 2xl:grid grid-cols-5 gap-4 w-full justify-items-center">
                {products.slice(0, 10).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center md:hidden pt-[44px]">
        <button className="bg-black text-xs sm:text-sm md:text-sm flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default EarbudsProducts;
