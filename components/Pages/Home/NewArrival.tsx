import ProductCard from "@/components/ui/ProductCard";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

const NewArrival = () => {
  const products = [
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
  ];

  return (
    <div className="w-11/12 mx-auto py-14">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left py-6 md:py-8 w-full gap-3">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            New Arrival Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p> 
        </div>

        <button className="bg-black text-xs sm:text-sm md:text-lg flex items-center justify-center gap-2 text-white px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl hover:text-black font-semibold hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Product Grid */}
      <div className=" flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center w-[98%] sm:w-full">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
