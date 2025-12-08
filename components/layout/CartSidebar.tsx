"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface CartSidebarProps {
  externalOpen: boolean;
  setExternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CartItem {
  id: string | number; 
  name: string;
  img: string;
  price: number;
  oldPrice: number;
  qty: number;
  variant?: string;
  variantImage?: string;
}

export default function CartSidebar({ externalOpen, setExternalOpen }: CartSidebarProps) {
  const { cart, increaseQty, decreaseQty, removeFromCart, selectedItems, setSelectedItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const typedCart: CartItem[] = cart;

  const toggleSelect = (id: string | number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === typedCart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(typedCart.map(item => item.id));
    }
  };

  // Only calculate totals for selected items
  const selectedCart = typedCart.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = selectedCart.reduce((acc, item) => acc + (item.oldPrice - item.price) * item.qty, 0);
  const total = subtotal - discount;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setExternalOpen(true)}
        className="fixed hidden lg:block right-0 top-1/2 -translate-y-1/2 z-[10001] shadow-lg rounded-l-xl overflow-hidden"
      >
        <div className="w-[90px]">
          <div className="bg-black text-white flex flex-col items-center py-3">
            <div className="w-[28px] h-[28px] flex items-center justify-center">
              <Image src="/images/buy.png" alt="Cart Icon" width={28} height={28} />
            </div>
            <span className="text-xs mt-2">
              *{mounted ? typedCart.length.toString().padStart(2, "0") : "00"} Items
            </span>
          </div>
          <div className="bg-orange-500 text-white text-center py-2 font-semibold">
            {mounted
              ? `৳${typedCart.reduce((acc, item) => acc + item.price * item.qty, 0).toLocaleString()}`
              : "৳0"}
          </div>
        </div>
      </button>

      {/* Overlay */}
      {externalOpen && (
        <div onClick={() => setExternalOpen(false)} className="fixed inset-0 bg-black/30 z-[9998]" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[450px] bg-white shadow-xl z-[20000] transform transition-transform duration-300 ${
          externalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 w-full bg-orange-500 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={() => setExternalOpen(false)} className="text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="bg-[#f4f4f4] mt-16 flex items-center justify-between px-4 py-2">
          <h1> Shipping Cart </h1>
          <p>
            <span className="text-xs mt-2">
              *{mounted ? typedCart.length.toString().padStart(2, "0") : "00"} Items
            </span>
          </p>
        </div>

        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 260px)" }}>
          {typedCart.map((item) => (
            <div
  key={item.id}
  className="flex gap-3 p-3 mb-3 items-center"
>
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(item.id)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  selectedItems.includes(item.id) ? "bg-orange-500 border-orange-500" : "border-gray-400"
                }`}
              >
                {selectedItems.includes(item.id) && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </button>

              <div className="min-w-[70px] w-20 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
    src={item.variantImage || item.img}
    alt={item.name}
    width={70}
    height={70}
    className="object-contain"
  />
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="text-sm font-medium truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {item.variant ? item.variant : ""}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-orange-600 font-semibold">
                    {mounted ? `৳${item.price * item.qty}` : "৳0"}
                  </span>
                  <span className="line-through text-gray-400 text-xs">
                    {mounted ? `৳${item.oldPrice * item.qty}` : "৳0"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">QTY :</span>
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 text-lg"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom area: select all + totals + checkout */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t flex flex-col gap-2">
          <div className="flex justify-between items-center">
            {/* Select All */}
            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedItems.length === typedCart.length && typedCart.length > 0
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-400"
                }`}
              >
                {selectedItems.length === typedCart.length && typedCart.length > 0 && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </span>
              All
            </button>

            {/* Totals */}
            <div className="text-right">
              <div className="flex gap-6 mb-3 justify-between text-sm">
                <span>Sub-total</span>
                <span>৳{mounted ? subtotal.toLocaleString() : "0"}</span>
              </div>
              <div className="flex gap-6 mb-3 justify-between text-sm">
                <span>Discount</span>
                <span>৳{mounted ? discount.toLocaleString() : "0"}</span>
              </div>
              <div className="flex gap-6 mb-3 justify-between font-bold text-[16px]">
                <span>Total</span>
                <span className="text-orange-600">৳{mounted ? total.toLocaleString() : "0"}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Link href="/checkout" onClick={() => setExternalOpen(false)}>
            <button
              className={`w-full py-3 rounded-full text-white ${
                selectedItems.length > 0
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              Checkout
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
