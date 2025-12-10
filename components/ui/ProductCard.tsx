"use client";


import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import Link from "next/link";
import ProductOptionsModal from "./ProductOptionsModal";
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
  // const { addToCart, setCartOpen } = useCart();
  // const [loading, setLoading] = useState(false);
    const { addToCart, setSelectedItems } = useCart();
    const router = useRouter();
  const [optionsOpen, setOptionsOpen] = useState(false);

  // const handleAdd = () => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     addToCart({
  //       id: product.id.toString(),
  //       slug: product.slug,
  //       name: product.name,
  //       price: product.price,
  //       oldPrice: product.oldPrice,
  //       img: product.image,
  //       qty: 1,
  //     });

  //     setCartOpen(true);
  //     setLoading(false);
  //   }, 700);
  // };

  const handleBuyNow = () => {
    const id = product.id; // or product.id.toString() if you use strings elsewhere

    addToCart({
      id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      img: product.image,
      qty: 1,
    });

    // Make only this item selected for checkout
    setSelectedItems([id]);
    if (typeof window !== "undefined") {
    const item = {
      item_id: id.toString(),
      item_name: product.name,
      item_brand: "",
      item_category: "",
      price: product.price,
      quantity: 1,
      item_variant: "",
      item_sku: "",
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [item],
      },
    });
  }


    // Go straight to checkout
    router.push("/checkout");
  };

  const fallbackSpecs = [
    { icon: "/images/watt.png", text: "25 Watts of Power " },
    { icon: "/images/fastcharge.png", text: "Super Fast Charging" },
  ];

  return (
    <>
      <div className="relative w-full max-w-[350px] rounded-lg shadow-md border border-gray-200 flex flex-col">
        {/* FIXED IMAGE AREA */}
        <Link
  href={`/${product.slug}`}
  className="relative bg-gray-50 h-[180px] md:h-[220px] rounded-md flex items-center justify-center overflow-hidden"
>
  <span className="absolute top-1.5 left-1.5 bg-[#FF6B01] text-white text-[10px] z-50 font-semibold px-1.5 py-0.5 rounded-full">
    New Arrival
  </span>

  <div className="relative w-full h-full">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-contain transition-transform duration-300 hover:scale-110"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>

  <div className="absolute bottom-1.5 left-1.5 bg-white px-1.5 py-0.5 rounded-md flex items-center text-[10px] shadow-sm">
    <span className="text-yellow-500 mr-0.5">★</span>
    <span>{product.rating}</span>
    <span className="text-gray-500 ml-0.5">{product.reviews}</span>
  </div>
</Link>

        <div className="p-3 flex flex-col flex-grow">
          {/* FIXED HEIGHT TITLE (2 LINES ALWAYS) */}
          <Link href={`/${product.slug}`}>
            <h1 className="md:text-base text-sm mb-3 hover:text-orange-600 cursor-pointer hover:underline duration-300 font-semibold line-clamp-2 h-[45px]">
              {product.name}
            </h1>
          </Link>

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
          <div className="flex gap-2 h-[30px]  md:h-[42px]">
            {/* Buy Now */}
            <button  onClick={handleBuyNow} className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-xs bg-[#FF6B01] md:py-1 hover:opacity-90 transition hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500">
              <span className="block xl:hidden text-xs">
                <LuShoppingBag />
              </span>
              <span className="hidden xl:flex md:hidden xl:text-sm gap-2 items-center">
                <LuShoppingBag /> Buy Now
              </span>
            </button>

            {/* Add to Cart opens modal */}
            <button
              onClick={() => setOptionsOpen(true)}
              className="flex items-center justify-center w-1/2 rounded-md py-1 border text-black border-black duration-300 xl:text-[13px] md:text-sm text-xs hover:bg-black hover:text-white"
            >
              <span className="block xl:hidden text-xs">
                <FaCartPlus />
              </span>
              <span className="hidden md:hidden xl:inline">+ Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Options Modal */}
      <ProductOptionsModal
        slug={product.slug}
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
}
