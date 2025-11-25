"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";

type Spec = {
  icon: string;
  text: string;
};

type Product = {
  id: number;
  slug: string;
  image: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string | number;
  rating: number | string;
  reviews: number | string;
  featured_specs?: Spec[];
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);

    setTimeout(() => {
      addToCart({
        id: product.id.toString(),
        slug: product.slug,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        img: product.image,
        qty: 1,
      });

      setCartOpen(true);
      setLoading(false);
    }, 700);
  };

  const fallbackSpecs = [
    { icon: "/images/watt.png", text: "25 Watts of Power " },
    { icon: "/images/fastcharge.png", text: "Super Fast Charging" },
  ];

  return (
    <div className="relative w-full max-w-[300px] rounded-lg shadow-md border border-gray-200 flex flex-col">

      {/* FIXED IMAGE AREA */}
      <div className="relative bg-gray-50 h-[180px] md:h-[220px] rounded-md flex items-center justify-center overflow-hidden">
        <span className="absolute top-1.5 left-1.5 bg-[#FF6B01] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          New Arrival
        </span>

        <Image
          src={product.image}
          alt={product.name}
          width={160}
          height={160}
          className="object-contain w-[100px] md:w-[110px] h-[100px] md:h-[110px] hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute bottom-1.5 left-1.5 bg-white px-1.5 py-0.5 rounded-md flex items-center text-[10px] shadow-sm">
          <span className="text-yellow-500 mr-0.5">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-500 ml-0.5">{product.reviews}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">

        {/* FIXED HEIGHT TITLE (2 LINES ALWAYS) */}
        <h1 className="md:text-base text-sm mb-3 font-semibold line-clamp-2 h-[45px]">
          {product.name}
        </h1>

        {/* FIXED HEIGHT SPECS */}
        <div className="space-y-1 h-[55px]">
          {(product.featured_specs?.length ? product.featured_specs : fallbackSpecs)
            .slice(0, 2)
            .map((spec, i) => (
              <div
                key={i}
                className="flex rounded-md p-1.5 bg-[#F4F4F4] gap-1.5 items-center"
              >
                <Image src={spec.icon} alt={spec.text} width={16} height={16} />
                <p className="text-[10px] leading-tight">{spec.text}</p>
              </div>
            ))}
        </div>

        {/* FIXED HEIGHT PRICING */}
        <div className="flex items-center gap-2 mt-4 mb-2 h-[32px]">
          <h1 className="font-semibold text-sm md:text-lg">৳{product.price}</h1>
          <p className="line-through text-sm md:text-lg text-[#939393]">
            ৳{product.oldPrice}
          </p>
          <p className="text-green-600 bg-green-200 md:px-2 py-1 px-1 md:rounded-full rounded-2xl text-[8px]">
            {product.discount}
          </p>
        </div>

        {/* FIXED HEIGHT BUTTON ROW */}
        <div className="flex gap-2  h-[42px]">

          {/* Buy Now */}
          <button className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-xs bg-[#FF6B01] md:py-1 hover:opacity-90 transition hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500">
            <span className="block xl:hidden text-xs">
              <LuShoppingBag />
            </span>
            <span className="hidden xl:flex md:hidden xl:text-sm gap-2 items-center">
              <LuShoppingBag /> Buy Now
            </span>
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`flex items-center justify-center w-1/2 rounded-md py-1 border text-black border-black duration-300 xl:text-[13px] md:text-sm text-xs ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-black hover:text-white"
            }`}
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
            ) : (
              <>
                <span className="block xl:hidden text-xs">
                  <FaCartPlus />
                </span>
                <span className="hidden md:hidden xl:inline">+ Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
