"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";

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
  featured_specs: Spec[];
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

  // ----- Product Card -----
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const fallbackSpecs: Spec[] = [
      { icon: "/images/watt.png", text: "25 Watts of Power" },
      { icon: "/images/fastcharge.png", text: "Super Fast Charging" },
    ];

    const specsToShow = product.featured_specs.length ? product.featured_specs : fallbackSpecs;

    return (
      <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
        <div className="relative flex items-center justify-center bg-gray-50 md:p-14 p-8 rounded-md">
          <span className="absolute top-2 left-2 bg-[#FF6B01] text-white px-2 py-1 text-[10px] md:text-xs font-semibold rounded-full">
            New Featured
          </span>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="md:w-[100px] w-[40px] hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md flex items-center text-[10px] md:text-xs shadow-sm">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.rating}</span>
            <span className="text-gray-500 ml-1">{product.reviews}</span>
          </div>
        </div>

        <div className="p-3">
          <h1 className="md:text-base text-sm mb-3 font-semibold line-clamp-2 min-h-[38px]">
            {product.name}
          </h1>

          {/* Featured Specs */}
          {specsToShow.slice(0, 2).map((spec, i) => (
            <div key={i} className="flex rounded-md p-2 bg-[#F4F4F4] gap-2 mb-1 items-center">
              <Image src={spec.icon} alt={spec.text} width={20} height={20} />
              <p className="md:text-xs text-[9px]">{spec.text}</p>
            </div>
          ))}

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-4 md:gap-3 mb-2">
            <h1 className="font-semibold text-sm md:text-lg">৳{product.price}</h1>
            <p className="line-through text-sm md:text-lg text-[#939393]">৳{product.oldPrice}</p>
            <p className="text-green-600 bg-green-200 md:px-2 py-1 px-1 md:rounded-full rounded-2xl text-[8px] md:text-[9px]">
              {product.discount}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-xs bg-[#FF6B01] md:py-2 hover:opacity-90 transition hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500">
              <span className="block xl:hidden text-xs">
                <LuShoppingBag />
              </span>
              <span className="hidden xl:flex md:gap-2 items-center">
                <LuShoppingBag /> Buy Now
              </span>
            </button>

            <button className="flex items-center justify-center w-1/2 xl:text-[13px] md:text-sm text-xs rounded-md py-2 text-black border hover:bg-black hover:text-white border-black duration-300">
              <span className="block xl:hidden text-xs">
                <FaCartPlus />
              </span>
              <span className="hidden xl:inline">+ Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

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
