"use client";

import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string; // Laravel gives full URL
  banner: string;
  cover_image: string;
};

const PopularCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.success) {
          setCategories(res.data.featuredCategories);
        }
      } catch (error) {
        console.log("Category load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCategories();
  }, []);

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="space-y-3 text-center">
        <h1 className="md:text-4xl text-2xl font-semibold">
          Explore Popular Categories
        </h1>
        <p className="md:text-sm text-xs">
          Find your preferred item in the highlighted product selection.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 p-6 mt-4">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div
              key={i}
              className="h-44 xl:h-52 2xl:h-64 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}
      {!loading && (
        <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 xl:p-6 mt-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}          // ✅ go to category products
              className="flex flex-col h-36 xl:h-52 2xl:h-64 hover:bg-orange-300 duration-300 items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer p-6 hover:shadow-lg transition"
            >
              <Image
                src={cat.icon || "/images/placeholder.png"}
                alt={cat.name}
                width={100}
                height={100}
                className="mb-3 w-16 xl:w-24 2xl:w-32 object-contain"
              />
              <h3 className="xl:text-lg text-[12px] text-center text-gray-800">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularCategories;
