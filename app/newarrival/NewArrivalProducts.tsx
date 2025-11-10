"use client";

import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import React, { useState, useMemo, useRef } from "react";
import { FiChevronRight } from "react-icons/fi";

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

const NewArrivalProducts = () => {
  // ✅ Product list
  const products = useMemo<Product[]>(() => [
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
      {
        id: 11,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 12,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 13,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 14,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 15,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 16,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 17,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 18,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 19,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 20,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
       {
        id: 21,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 22,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 17,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 23,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 24,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 25,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
  ], []);

  // ✅ Pagination setup
  const productsPerPage = 15;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const visibleProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="w-full mx-auto pb-[56px]">
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

      {/* ✅ Fixed-height grid */}
      <div className="flex justify-center min-h-[1050px] md:min-h-[1100px] lg:min-h-[900px]">
        <div
          key={currentPage}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 xl:gap-4 justify-items-center w-[98%] sm:w-full transition-all duration-300 ease-in-out"
        >
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center mt-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            &lt; Back
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalProducts;
