import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-4">
      {/* Image Wrapper */}
      <div className="relative flex items-center justify-center bg-gray-50 p-14 rounded-md">
        {/* NEW Label */}
        <span className="absolute top-2 left-2 bg-[#FF6B01] text-white text-xs font-semibold px-2 py-1 rounded-full">
          New Featured
        </span>

        {/* Product Image */}
        <Image
          className="w-[100px]  mb-3 hover:scale-110 transition-transform duration-300"
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
        />

        {/* Rating */}
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md flex items-center text-xs shadow-sm">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{product.rating}</span>
          <span className="text-gray-500 ml-1">{product.reviews}</span>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-base mb-3 font-semibold mt-2">{product.name}</h1>

      {/* Feature Rows */}
      <div className="flex rounded-md p-2 bg-[#F4F4F4] gap-2 mb-1 items-center">
        <Image src="/images/watt.png" alt="Watt" width={20} height={20} />
        <p className="text-xs">25 Watts of Power</p>
      </div>

      <div className="flex p-2 rounded-md bg-[#F4F4F4] gap-2 mb-3 items-center">
        <Image
          src="/images/fastcharge.png"
          alt="Fast Charge"
          width={20}
          height={20}
        />
        <p className="text-xs">Super Fast Charging</p>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-semibold text-lg">${product.price}</h1>
        <p className="line-through text-[#939393]">${product.oldPrice}</p>
        <p className="text-green-600 bg-green-200 px-2 py-1 rounded-full text-xs">{product.discount}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button className="flex gap-2 items-center justify-center w-1/2 rounded-md text-white bg-[#FF6B01] py-2">
          <Image src="/images/buy.png" alt="Buy" width={12} height={12} />
          Buy Now
        </button>
        <button className="w-1/2 rounded-md py-2 text-black border border-black">
          + Add to Cart
        </button>
      </div>
    </div>
  );
}
