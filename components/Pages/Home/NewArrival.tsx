"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Glide from "@glidejs/glide";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  slug: string;
}

// ⭐ Product Skeleton
const ProductSkeleton = () => (
  <div className="w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-0 animate-pulse">
    <div className="flex items-center justify-center bg-gray-100 md:p-14 p-8 rounded-md">
      <div className="md:w-[100px] w-[40px] h-[40px] md:h-[100px] bg-gray-300 rounded-md"></div>
    </div>

    <div className="p-3 space-y-3">
      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-4 w-2/4 bg-gray-300 rounded"></div>

      <div className="flex gap-2 p-2 bg-gray-200 rounded-md items-center">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-3 w-24 bg-gray-300 rounded"></div>
      </div>

      <div className="flex gap-2 p-2 bg-gray-200 rounded-md items-center">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-3 w-28 bg-gray-300 rounded"></div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
        <div className="h-4 w-10 bg-gray-300 rounded"></div>
      </div>

      <div className="flex gap-2 mt-3">
        <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
        <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  </div>
);


const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/products/new-arrivals");
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ⭐ GLIDE INIT — FIXED FOR TRUE INFINITE LOOP
  useEffect(() => {
    if (!loading && products.length > 0) {
      new Glide(".glide-new-arrival", {
        type: "carousel",
        perView: 5,
        gap: 10,
        rewind: false,
        bound: false,
        animationDuration: 500,
        breakpoints: {
          1280: { perView: 4 },
          1024: { perView: 3 },
          768: { perView: 2 },
          480: { perView: 1 },
        },
      }).mount();
    }
  }, [loading, products]);

  return (
    <div className="w-11/12 mx-auto pb-[56px]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-7">
        <div>
          <h1 className="xl:text-4xl text-2xl text-center xl:text-left font-semibold">
            New Arrival Products
          </h1>
          <p className="text-gray-600 text-center xl:text-left text-sm xl:text-lg">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="hidden md:flex bg-black text-white px-4 py-2 rounded-xl">
          See More <FiChevronRight />
        </button>
      </div>

      {/* ⭐ LOADING SKELETON */}
      {loading ? (
        <div
          className="
            grid gap-5
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-5
          "
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="glide-new-arrival relative">

          {/* ⭐ GLIDE TRACK — FIXED */}
          <div data-glide-el="track" className="overflow-hidden">
            <ul className="glide__slides">
              {products.map((p) => (
                <li key={p.id} className="glide__slide px-2">
                  <Link href={`/productdetails/${p.slug}`}>
                    <ProductCard product={p} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ⭐ ARROWS */}
          <div data-glide-el="controls">
            <button
              data-glide-dir="<"
              className="absolute xl:-left-7 -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full"
            >
              <FiChevronLeft className="text-2xl" />
            </button>

            <button
              data-glide-dir=">"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrival;
