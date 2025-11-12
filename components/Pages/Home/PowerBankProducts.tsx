"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import ProductCard2 from "@/components/ui/ProductCard2";
import Loader from "@/components/ui/Loader";

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

const PowerBankProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products/powerbanks");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        ];

  return (
    <div className="md:w-11/12 w-11/12 mx-auto pb-[56px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Powerbank Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col xl:flex-row 2xl:flex-row gap-4">
        {/* LEFT Banner */}
        <div className="xl:w-3/12 2xl:w-3/12 flex justify-center items-center">
          <div className="w-full h-auto md:h-full">
            <Image
              src="/images/pbbanner.png"
              alt="Powerbank Banner"
              width={400}
              height={600}
              className="rounded-xl object-contain md:object-fill w-full h-auto md:h-[500px] xl:h-full"
            />
          </div>
        </div>

        {/* RIGHT Products */}
        <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center">
          {loading ? (
            // Centered loader with maintained height
            <Loader/>
          ) : (
            <>
              {/* Default / md */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                {productList.slice(0, 10).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>

              {/* xl */}
              <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
                {productList.slice(0, 8).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>

              {/* 2xl */}
              <div className="hidden 2xl:grid grid-cols-5 gap-4 w-full justify-items-center">
                {productList.slice(0, 10).map((p) => (
                  <ProductCard2 key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile See More */}
      <div className="flex items-center justify-center md:hidden pt-[44px]">
        <button className="bg-black text-xs sm:text-sm md:text-sm flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>
    </div>
  );
};

export default PowerBankProducts;
