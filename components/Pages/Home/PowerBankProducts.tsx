"use client";

import React from "react";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import ProductCard2 from "@/components/ui/ProductCard2";

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

type PowerBankProductsProps = {
  products?: ProductType[];
};

const PowerBankProducts = ({ products }: PowerBankProductsProps) => {
  // Local static data (temporary until API integration)
  const productList: ProductType[] =
    products && products.length > 0
      ? products
      : [
          {
            id: 1,
            name: "25 Watt Samsung Fast Charger",
            price: 2500,
            oldPrice: 2600,
            discount: "10% Off",
            rating: "3.0",
            reviews: "(1)",
            image: "/images/pb.png",
          },
          {
            id: 2,
            name: "Super Fast Wall Charger",
            price: 2300,
            oldPrice: 2500,
            discount: "8% Off",
            rating: "4.0",
            reviews: "(12)",
            image: "/images/pb.png",
          },
          {
            id: 3,
            name: "Compact USB-C Adapter",
            price: 2200,
            oldPrice: 2400,
            discount: "9% Off",
            rating: "4.5",
            reviews: "(7)",
            image: "/images/pb.png",
          },
          {
            id: 4,
            name: "Dual Port Fast Charger",
            price: 2700,
            oldPrice: 3000,
            discount: "10% Off",
            rating: "3.8",
            reviews: "(4)",
            image: "/images/pb.png",
          },
          {
            id: 5,
            name: "Super Compact Quick Charger",
            price: 2400,
            oldPrice: 2600,
            discount: "7% Off",
            rating: "4.2",
            reviews: "(10)",
            image: "/images/pb.png",
          },
          {
            id: 6,
            name: "Ultra Mini Wall Charger",
            price: 2200,
            oldPrice: 2400,
            discount: "9% Off",
            rating: "4.1",
            reviews: "(9)",
            image: "/images/pb.png",
          },
          {
            id: 7,
            name: "Smart Charge Adapter",
            price: 2600,
            oldPrice: 2800,
            discount: "7% Off",
            rating: "4.0",
            reviews: "(3)",
            image: "/images/pb.png",
          },
          {
            id: 8,
            name: "Dual USB Quick Charger",
            price: 2500,
            oldPrice: 2700,
            discount: "9% Off",
            rating: "3.9",
            reviews: "(5)",
            image: "/images/pb.png",
          },
          {
            id: 9,
            name: "Super Charge Turbo Adapter",
            price: 2800,
            oldPrice: 3000,
            discount: "7% Off",
            rating: "4.3",
            reviews: "(11)",
            image: "/images/pb.png",
          },
          {
            id: 10,
            name: "25 Watt Samsung Fast Charger",
            price: 2500,
            oldPrice: 2600,
            discount: "10% Off",
            rating: "3.0",
            reviews: "(1)",
            image: "/images/pb.png",
          },
          {
            id: 11,
            name: "PD 30W Quick Charger",
            price: 2900,
            oldPrice: 3100,
            discount: "6% Off",
            rating: "4.4",
            reviews: "(8)",
            image: "/images/pb.png",
          },
          {
            id: 12,
            name: "Compact Super Charger",
            price: 2600,
            oldPrice: 2800,
            discount: "8% Off",
            rating: "4.1",
            reviews: "(5)",
            image: "/images/pb.png",
          },
        ];

  return (
    <div className="md:w-11/12 w-11/12 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left py-6 md:py-8 w-full gap-3">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Powerbank Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black text-xs sm:text-sm md:text-lg flex items-center justify-center gap-2 text-white px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl hover:text-black font-semibold hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row gap-4">
        {/* LEFT: Banner Image */}
        <div className="xl:w-3/12 2xl:w-3/12 flex justify-center items-center">
          <div className="w-full h-auto md:h-full">
            <Image
              src="/images/pbbanner.png"
              alt="Earbuds Banner"
              width={400}
              height={600}
              className="rounded-xl object-contain md:object-fill w-full h-auto md:h-[500px] xl:h-full"
            />
          </div>
        </div>

        {/* RIGHT: Product Grid */}
        <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center">
          {/* Default + md (show 10) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
            {productList.slice(0, 10).map((p) => (
              <ProductCard2 key={p.id} product={p} />
            ))}
          </div>

          {/* xl (show 8) */}
          <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
            {productList.slice(0, 8).map((p) => (
              <ProductCard2 key={p.id} product={p} />
            ))}
          </div>

          {/* 2xl (show 10) */}
          <div className="hidden 2xl:grid grid-cols-5 gap-4 w-full justify-items-center">
            {productList.slice(0, 10).map((p) => (
              <ProductCard2 key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center xl:justify-end mt-10 space-x-3">
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md hover:bg-gray-100 transition hover:text-black">
          &lt;
        </button>
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PowerBankProducts;
