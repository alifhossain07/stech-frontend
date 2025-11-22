import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";

export default function ProductCard2({ product }) {

  const fallbackSpecs = [
  {
    icon: "/images/watt.png", // your fallback image
    text: "25 Watts of Power ",
  },
  {
    icon: "/images/fastcharge.png",
    text: "Super Fast Charging",
  },
];

  return (
    <div className="relative w-full max-w-[300px] h-full flex flex-col justify-between rounded-lg shadow-md border border-gray-200 ">
      {/* Image Wrapper */}
      <div className="relative flex items-center justify-center bg-gray-50 md:p-10 p-6 rounded-md">
        <span className="absolute top-1.5 left-1.5 bg-[#FF6B01] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          New Arrival
        </span>

        <Image
          className="md:w-[100px] w-[50px] mt-4 mb-2 hover:scale-110 transition-transform duration-300"
          src={product.image}
          alt={product.name}
          width={160}
          height={160}
        />

        <div className="absolute bottom-1.5 left-1.5 bg-white px-1.5 py-0.5 rounded-md flex items-center text-[10px] shadow-sm">
          <span className="text-yellow-500 mr-0.5">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-500 ml-0.5">{product.reviews}</span>
        </div>
      </div>

      <div className="p-3">

      {/* Product Name */}
      <h1 className="md:text-base text-sm mb-3 font-semibold  line-clamp-2 min-h-[38px]">
        {product.name}
      </h1>

      {/* Feature Rows */}
     {/* Feature Specs with fallback */}
<div>
  {(product.featured_specs?.length ? product.featured_specs : fallbackSpecs)
    .slice(0, 2)
    .map((spec, i) => (
      <div
        key={i}
        className="flex rounded-md p-1.5 bg-[#F4F4F4] gap-1.5 mb-1 items-center"
      >
        <Image src={spec.icon} alt={spec.text} width={16} height={16} />
        <p className="text-[10px]">{spec.text}</p>
      </div>
    ))}
</div>

      {/* Pricing */}
      <div className="flex items-center gap-2 mt-4 md:gap-3 mb-2">
        <h1 className="font-semibold text-sm md:text-lg">৳{product.price}</h1>
        <p className="line-through text-sm md:text-lg text-[#939393]">
          ৳{product.oldPrice}
        </p>
        <p className="text-green-600 bg-green-200 md:px-2 py-1 px-1 md:rounded-full rounded-2xl  text-[8px] md:[10px]">
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
