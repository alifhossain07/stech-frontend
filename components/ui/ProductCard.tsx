import Image from "next/image";
import { LuShoppingBag } from "react-icons/lu";

import { FaCartPlus } from "react-icons/fa";
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

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200   hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      {/* Image Wrapper */}
      <div className="relative flex items-center justify-center bg-gray-50 md:p-14 p-8 rounded-md">
        {/* NEW Label */}
        <span className="absolute top-2 left-2 bg-[#FF6B01] text-white px-1 text-[10px] md:text-xs font-semibold md:px-2 md:py-1 rounded-full">
          New Featured
        </span>

        {/* Product Image */}
        <Image
          className="md:w-[100px] w-[40px]  hover:scale-110 transition-transform duration-300"
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
        />

        {/* Rating */}
        <div className="absolute bottom-2 left-2 bg-white px-1 md:px-2 py-1 rounded-md flex items-center text-[10px] md:text-xs shadow-sm">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-500 ml-1">{product.reviews}</span>
        </div>
      </div>

      <div className="p-3 ">
 {/* Product Name */}
      <h1 className="md:text-base text-sm mb-3 font-semibold  line-clamp-2 min-h-[38px]">
        {product.name}
      </h1>

      {/* Feature Rows */}
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

      {/* Pricing */}
      <div className="flex items-center gap-2 mt-4 md:gap-3 mb-2">
        <h1 className="font-semibold text-sm md:text-lg">${product.price}</h1>
        <p className="line-through text-sm md:text-lg text-[#939393]">
          ${product.oldPrice}
        </p>
        <p className="text-green-600 bg-green-200 md:px-2 py-1 px-1 md:rounded-full rounded-2xl  text-[8px] md:text-xs">
          {product.discount}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2  mt-4  ">
             {/* Buy Now Button */}
             <button className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-xs bg-[#FF6B01] md:py-2 hover:opacity-90 transition hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500">
               {/* Mobile: Icon only */}
               <span className="block xl:hidden text-xs">
                 <LuShoppingBag />
               </span>
     
               {/* Tablet/Desktop: Icon + Text */}
               <span className="hidden xl:text-sm text-base md:text-base 2xl:text-sm md:hidden xl:flex md:gap-2 items-center">
                 <LuShoppingBag />
                 Buy Now
               </span>
             </button>
     
             {/* Add to Cart Button */}
             <button className="flex items-center justify-center w-1/2 xl:text-[13px] md:text-sm text-xs rounded-md py-2 text-black border hover:bg-black hover:text-white border-black duration-300">
               {/* Mobile: Icon only */}
               <span className="block xl:hidden  text-xs">
                 <FaCartPlus />
               </span>
     
               {/* Tablet/Desktop: Text only */}
               <span className="md:hidden xl:inline hidden  ">+ Add to Cart</span>
             </button>
           </div>


      </div>

     
    </div>
  );
}
