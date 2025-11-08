import React from "react";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import ProductCard2 from "@/components/ui/ProductCard2";

type ProductType = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
};

type PowerBankProducts2Props = {
  products?: ProductType[];
};

const PowerBankProducts2 = ({ products }: PowerBankProducts2Props) => {
  // Local static data (temporary until API integration)
  const productList: ProductType[] =
    products && products.length > 0
      ? products
      : [
          {
            id: 1,
            name: "25 Watt Samsung Fast Charger",
            price: 2500,
            oldPrice: 2600,
            discount: "10% Off",
            rating: "3.0",
            reviews: "(1)",
            image: "/images/pb2.png",
          },
          {
      id: 2,
      name: "Super Fast Wall Charger",
      price: 2300,
      oldPrice: 2500,
      discount: "8% Off",
      rating: "4.0",
      reviews: "(12)",
      image: "/images/pb2.png",
    },
    {
      id: 3,
      name: "Compact USB-C Adapter",
      price: 2200,
      oldPrice: 2400,
      discount: "9% Off",
      rating: "4.5",
      reviews: "(7)",
      image: "/images/pb2.png",
    },
    {
      id: 4,
      name: "Dual Port Fast Charger",
      price: 2700,
      oldPrice: 3000,
      discount: "10% Off",
      rating: "3.8",
      reviews: "(4)",
      image: "/images/pb2.png",
    },
    {
      id: 5,
      name: "Super Compact Quick Charger",
      price: 2400,
      oldPrice: 2600,
      discount: "7% Off",
      rating: "4.2",
      reviews: "(10)",
      image: "/images/pb2.png",
    },
    {
      id: 6,
      name: "Super Fast Wall Charger",
      price: 2500,
      oldPrice: 2600,
      discount: "10% Off",
      rating: "3.0",
      reviews: "(1)",
      image: "/images/pb2.png",
    },
    {
      id: 7,
      name: "25 Watt Samsung Fast Charger",
      price: 2500,
      oldPrice: 2600,
      discount: "10% Off",
      rating: "3.0",
      reviews: "(1)",
      image: "/images/pb2.png",
    },
    {
      id: 8,
      name: "Super Fast Wall Charger",
      price: 2500,
      oldPrice: 2600,
      discount: "10% Off",
      rating: "3.0",
      reviews: "(1)",
      image: "/images/pb2.png",
    },

    {
      id: 9,
      name: "25 Watt Samsung Fast Charger",
      price: 2500,
      oldPrice: 2600,
      discount: "10% Off",
      rating: "3.0",
      reviews: "(1)",
      image: "/images/pb2.png",
    },
    {
      id:10,
      name: "25 Watt Samsung Fast Charger",
      price: 2500,
      oldPrice: 2600,
      discount: "10% Off",
      rating: "3.0",
      reviews: "(1)",
      image: "/images/pb2.png",
    },
        ];

  return (
    <div className="md:w-11/12 w-10/12 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left py-6 md:py-8 w-full gap-3">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            Powerbank Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black text-xs sm:text-sm md:text-lg flex items-center justify-center gap-2 text-white px-4 sm:px-5 md:px-6 py-2 md:py-3 rounded-xl hover:text-black font-semibold hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT: Banner Image */}
        <div className="md:w-3/12 flex justify-center items-center">
          <div className="w-full h-auto md:h-full">
            <Image
              src="/images/pbproducts2.png"
              alt="Earbuds Banner"
              width={400}
              height={600}
              className="rounded-xl object-contain md:object-cover w-full h-auto sm:h-[250px] md:h-full"
            />
          </div>
        </div>

        {/* RIGHT: Product Grid */}
        <div className="md:w-9/12 w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-3 gap-8 w-full sm:w-full justify-items-center">
            {productList.map((p) => (
              <ProductCard2 key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
       <div className="flex justify-end mt-10 space-x-3">
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md  hover:bg-gray-100 transition hover:text-black">
          &lt;
        </button>
        <button className="flex items-center bg-black text-white justify-center w-16 h-10 border border-gray-300 rounded-md  hover:bg-gray-100 hover:text-black transition">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PowerBankProducts2;


