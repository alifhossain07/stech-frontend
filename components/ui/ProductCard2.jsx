import Image from "next/image";
import { LuShoppingBag } from "react-icons/lu";

export default function ProductCard2({ product }) {
  return (
    <div className="relative w-full max-w-[300px] h-full flex flex-col justify-between rounded-lg shadow-md border border-gray-200 p-3">
      {/* Image Wrapper */}
      <div className="relative flex items-center justify-center bg-gray-50 md:p-10 p-6 rounded-md">
        <span className="absolute top-1.5 left-1.5 bg-[#FF6B01] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          New
        </span>

        <Image
          className="w-[80px] mb-2 hover:scale-110 transition-transform duration-300"
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

      {/* Product Name */}
      <h1 className="text-sm mb-2 font-semibold mt-2 line-clamp-2 min-h-[38px]">
        {product.name}
      </h1>

      {/* Feature Rows */}
      <div>
        <div className="flex rounded-md p-1.5 bg-[#F4F4F4] gap-1.5 mb-1 items-center">
          <Image src="/images/watt.png" alt="Watt" width={16} height={16} />
          <p className="text-[10px]">25 Watts of Power</p>
        </div>

        <div className="flex p-1.5 rounded-md bg-[#F4F4F4] gap-1.5 mb-2 items-center">
          <Image src="/images/fastcharge.png" alt="Fast Charge" width={16} height={16} />
          <p className="text-[10px]">Super Fast Charging</p>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-2 mb-1.5">
        <h1 className="font-semibold text-base">${product.price}</h1>
        <p className="line-through text-[#939393] text-xs">${product.oldPrice}</p>
        <p className="text-green-600 bg-green-200 px-1.5 py-0.5 rounded-full text-[10px]">
          {product.discount}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button className="flex gap-1 items-center justify-center w-1/2 rounded-md text-white text-[11px] bg-[#FF6B01] py-1.5 hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500 duration-300">
        <LuShoppingBag/>
          Buy Now
        </button>
        <button className="w-1/2 text-[11px] rounded-md py-1.5 text-black border hover:bg-black hover:text-white border-black duration-300 ">
          + Add To Cart
        </button>
      </div>
    </div>
  );
}
