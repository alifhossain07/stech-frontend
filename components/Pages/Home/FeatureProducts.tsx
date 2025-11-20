"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  slug: string;
}

const FeatureProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products/featureproducts");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // handle responsive product count
  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth >= 1280 ? 5 : 6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----- Skeleton Card -----
  const SkeletonCard = () => (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-0 animate-pulse flex flex-col justify-between">
      <div className="relative flex items-center justify-center bg-gray-100 md:p-14 p-8 rounded-md">
        <span className="absolute top-2 left-2 bg-gray-300 text-gray-300 px-2 py-1 text-xs rounded-full">&nbsp;</span>
        <div className="md:w-[100px] w-[40px] h-[100px] md:h-[100px] bg-gray-300 rounded"></div>
        <div className="absolute bottom-2 left-2 bg-gray-200 px-2 py-1 rounded flex items-center gap-1 w-16 h-5"></div>
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

  // ----- Product Card -----
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div className="relative flex items-center justify-center bg-gray-50 md:p-14 p-8 rounded-md">
        <span className="absolute top-2 left-2 bg-[#FF6B01] text-white px-1 text-[10px] md:text-xs font-semibold md:px-2 md:py-1 rounded-full">
          New Featured
        </span>
        <Image
          className="md:w-[100px] w-[40px] hover:scale-110 transition-transform duration-300"
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
        />
        <div className="absolute bottom-2 left-2 bg-white px-1 md:px-2 py-1 rounded-md flex items-center text-[10px] md:text-xs shadow-sm">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-500 ml-1">{product.reviews}</span>
        </div>
      </div>

      <div className="p-3">
        <h1 className="md:text-base text-sm mb-3 font-semibold line-clamp-2 min-h-[38px]">
          {product.name}
        </h1>

        <div className="flex rounded-md p-2 bg-[#F4F4F4] gap-2 mb-1 items-center">
          <Image
            src="/images/watt.png"
            alt="Watt"
            width={20}
            height={20}
            className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
          />
          <p className="md:text-xs text-[9px]">25 Watts of Power</p>
        </div>

        <div className="flex p-2 rounded-md bg-[#F4F4F4] gap-2 mb-3 items-center">
          <Image
            src="/images/fastcharge.png"
            alt="Fast Charge"
            width={20}
            height={20}
          />
          <p className="md:text-xs text-[9px]">Super Fast Charging</p>
        </div>

        <div className="flex items-center gap-2 mt-4 md:gap-3 mb-2">
          <h1 className="font-semibold text-sm md:text-lg">৳{product.price}</h1>
          <p className="line-through text-sm md:text-lg text-[#939393]">
            ৳{product.oldPrice}
          </p>
          <p className="text-green-600 bg-green-200 md:px-2 py-1 px-1 md:rounded-full rounded-2xl text-[8px] md:text-[9px]">
            {product.discount}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-xs bg-[#FF6B01] md:py-2 hover:opacity-90 transition hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500">
            <span className="block xl:hidden text-xs">
              <LuShoppingBag />
            </span>
            <span className="hidden xl:text-sm text-base md:text-base 2xl:text-sm md:hidden xl:flex md:gap-2 items-center">
              <LuShoppingBag />
              Buy Now
            </span>
          </button>

          <button className="flex items-center justify-center w-1/2 xl:text-[13px] md:text-sm text-xs rounded-md py-2 text-black border hover:bg-black hover:text-white border-black duration-300">
            <span className="block xl:hidden text-xs">
              <FaCartPlus />
            </span>
            <span className="md:hidden xl:inline hidden">+ Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Our Feature Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
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
