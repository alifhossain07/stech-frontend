"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

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

const VISIBLE_CONFIG = {
  
  xl: 5,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1,
};

const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products/new-arrivals");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Calculate visible count based on window size
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;

      if (w >= 1280) setVisibleCount(VISIBLE_CONFIG.xl);
      else if (w >= 1024) setVisibleCount(VISIBLE_CONFIG.lg);
      else if (w >= 768) setVisibleCount(VISIBLE_CONFIG.md);
      else if (w >= 480) setVisibleCount(VISIBLE_CONFIG.sm);
      else setVisibleCount(VISIBLE_CONFIG.xs);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCount);

  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  const handlePrev = () =>
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-7">
        <div>
          <h1 className="xl:text-4xl text-2xl font-semibold">
            New Arrival Products
          </h1>
          <p className="text-gray-600 text-sm xl:text-lg">
            Discover our latest arrivals
          </p>
        </div>

        <Link href="/products/new-arrivals" className="hidden md:flex bg-black text-white px-4 py-2 rounded-xl items-center">
          See More <FiChevronRight />
        </Link>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-60 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* SLIDER VIEWPORT */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  (currentIndex * 100) / visibleCount
                }%)`,
              }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="px-2 flex-shrink-0"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          {/* ARROWS */}
          {products.length > visibleCount && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute xl:-left-6 -left-3 top-1/2 -translate-y-1/2 bg-white shadow-md px-3 py-2 rounded-full disabled:opacity-40"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="absolute xl:-right-6 -right-3 top-1/2 -translate-y-1/2 bg-white shadow-md px-3 py-2 rounded-full disabled:opacity-40"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
