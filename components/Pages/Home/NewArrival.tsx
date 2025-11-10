"use client";

import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { FiChevronRight } from "react-icons/fi";

// ✅ Define Product type
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
};

const NewArrival = () => {
  // ✅ Tell TypeScript that `products` is an array of Product
  const products = useMemo<Product[]>(
    () => [
      {
        id: 1,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 2,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 3,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 4,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 5,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 6,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 7,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 8,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 9,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 10,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      // ... keep your remaining items (11–20)
    ],
    []
  );

  // ✅ Define state type properly
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

  useEffect(() => {
    const updateVisibleProducts = () => {
      if (window.innerWidth >= 1280) {
        setVisibleProducts(products.slice(0, 5));
      } else {
        setVisibleProducts(products.slice(0, 6));
      }
    };

    updateVisibleProducts();
    window.addEventListener("resize", updateVisibleProducts);

    return () => window.removeEventListener("resize", updateVisibleProducts);
  }, [products]);

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            New Arrival Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <Link href="/newarrival">
          <button className="bg-black text-xs sm:text-sm md:text-sm flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
            See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
          </button>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 xl:gap-4 justify-items-center w-[98%] sm:w-full">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
