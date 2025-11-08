import ProductCard from "@/components/ui/ProductCard";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

const NewArrival = () => {
const products = [
  {
    id: 1,
    name: "25 Watt Samsung  Fast Charger",
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
];

  return (
    <div className="w-10/12 mx-auto py-14">
      <div className="flex justify-between items-center py-6 md:py-8 w-full">
        <div className=" w-7/12 ">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            New Arrival Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600 ">
            Discover Our Latest Arrivals Designed to Inspire and Imporess
          </p>
        </div>

        <button className="bg-black text-xs sm:text-sm md:text-lg flex items-center gap-2 text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-orange-300 duration-300 transition whitespace-nowrap">
          See More{" "}
          <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>
 <div className="grid grid-cols-1 mt-7 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>





    </div>
  );
};

export default NewArrival;
