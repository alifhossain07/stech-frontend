import React from 'react';
import Image from 'next/image';
import { AiOutlineShoppingCart } from 'react-icons/ai'; // Using a similar cart icon
import { FaStar } from 'react-icons/fa';

export default function WishlistPage() {
  // Sample data for the product cards
  const products = [1, 2, 3];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
      </div>

      {/* Empty State / No Purchase Product Section */}
      <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center mb-8 border border-gray-50">
        <div className="relative mb-4">
          <div className="bg-white p-4 rounded-full shadow-sm">
             {/* Custom Shopping Cart Illustration matching the image */}
            <div className="relative">
              <AiOutlineShoppingCart size={60} className="text-gray-700" />
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full border-2 border-white w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">No Purchase Product!</h2>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
          your wishlist is as empty as a library during a zombie apocalypse! Time to fill it up with your dreams, desires, and a few items that might save you from the undead...or at least bring a smile to your face!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image Container */}
            <div className="relative p-4 bg-[#F3F4F6] m-3 rounded-lg flex justify-center">
              <Image 
                src="https://via.placeholder.com/200x250" // Replace with your iPhone image source
                alt="iPhone Series 16 Pro Max"
                width={200}
                height={250}
                className="h-48 object-contain"
                unoptimized
              />
              {/* Save Badge */}
              <div className="absolute top-0 left-0 bg-[#008D41] text-white text-xs font-bold px-3 py-1.5 rounded-br-lg rounded-tl-lg">
                Save ৳ 14000
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 pt-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1">iPhone Series 16 Pro Max</h3>
              <p className="text-xs text-gray-500 mb-2">Stock : <span className="text-gray-800 font-medium">Available</span></p>
              
              <div className="flex items-center gap-1 mb-3">
                <FaStar className="text-yellow-400" size={12} />
                <span className="text-xs text-gray-500">(3.4)</span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xl font-bold text-[#E9672B]">৳1,00,500</span>
                <span className="text-sm text-gray-400 line-through">৳1,00,900</span>
              </div>

              <button className="w-full bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold py-3 rounded-lg transition-colors shadow-sm">
                Buy Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}