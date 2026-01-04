"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
  base_price: string;
  rating: number;
}

interface WishlistItem {
  id: number;
  product: WishlistProduct;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch wishlist on mount
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sannai_auth_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch("/api/wishlists", { headers });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove item handler
  const handleRemove = async (slug: string) => {
    try {
      const token = localStorage.getItem("sannai_auth_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`/api/wishlists/remove-product/${slug}`, { headers });
      const data = await res.json();
      // data.is_in_wishlist should be false
      if (data) {
        // Refresh list
        alert("Product removed from wishlist");
        setWishlist((prev) => prev.filter((item) => item.product.slug !== slug));
      }
    } catch (error) {
      console.error("Failed to remove item", error);
      alert("Failed to remove item");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center mb-8 border border-gray-50">
          <div className="relative mb-4">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <div className="relative">
                <AiOutlineShoppingCart size={60} className="text-gray-700" />
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full border-2 border-white w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                  ✕
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            No Purchase Product!
          </h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            your wishlist is as empty as a library during a zombie apocalypse!
            Time to fill it up with your dreams, desires, and a few items that
            might save you from the undead...or at least bring a smile to your
            face!
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
            >
              <button
                onClick={() => handleRemove(item.product.slug)}
                className="absolute top-2 right-2 bg-red-50 p-2 rounded-full text-red-500 hover:bg-red-100 transition z-10"
                title="Remove from wishlist"
              >
                <FaTrash size={14} />
              </button>

              {/* Image Container */}
              <div className="relative p-4 bg-[#F3F4F6] m-3 rounded-lg flex justify-center">
                <Link href={`/${item.product.slug}`}>
                  <Image
                    src={
                      item.product.thumbnail_image ||
                      "https://via.placeholder.com/200x250"
                    }
                    alt={item.product.name}
                    width={200}
                    height={250}
                    className="h-48 object-contain"
                    unoptimized
                  />
                </Link>
              </div>

              {/* Product Info */}
              <div className="p-4 pt-0">
                <Link href={`/${item.product.slug}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-orange-500 transition line-clamp-2 min-h-[56px]">
                    {item.product.name}
                  </h3>
                </Link>
                {/* <p className="text-xs text-gray-500 mb-2">Stock : <span className="text-gray-800 font-medium">Available</span></p> */}

                <div className="flex items-center gap-1 mb-3">
                  <FaStar className="text-yellow-400" size={12} />
                  <span className="text-xs text-gray-500">
                    ({item.product.rating || 0})
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-[#E9672B]">
                    {item.product.base_price}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/${item.product.slug}`)}
                  className="w-full bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
                >
                  Buy Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}