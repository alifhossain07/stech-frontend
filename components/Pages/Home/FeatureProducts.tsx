"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";

// ----- Product Interface -----
interface Spec {
  text: string;
  icon: string;
}

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
  featured_specs?: Spec[];
}

const FeatureProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);

  // ----- Fetch Products -----
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("/api/products/featureproducts");
        setProducts(res.data); // API already returns the correct structure
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ----- Responsive Item Count -----
  useEffect(() => {
    const handleResize = () => setItemsToShow(window.innerWidth >= 1280 ? 5 : 6);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----- Skeleton Card -----
  const SkeletonCard: React.FC = () => (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-0 animate-pulse flex flex-col justify-between">
      <div className="relative flex items-center justify-center bg-gray-100 md:p-14 p-8 rounded-md">
        <div className="md:w-[100px] w-[40px] h-[100px] md:h-[100px] bg-gray-300 rounded"></div>
      </div>
      <div className="p-3 space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-2/4 bg-gray-300 rounded"></div>
        <div className="flex gap-2 mt-3">
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Our Feature Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>
        <button className="bg-black hidden md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 transition duration-300">
          See More <FiChevronRight className="text-sm md:text-xl" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6 xl:gap-4 justify-items-center w-[98%] sm:w-full">
          {loading
            ? Array.from({ length: itemsToShow }).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, itemsToShow).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default FeatureProducts;
