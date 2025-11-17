"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  color: string;
  price: number;
  oldPrice: number;
  qty: number;
  img: string;
  selected: boolean;
};
type CartSidebarProps = {
  externalOpen: boolean;
  setExternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CartSidebar({ externalOpen, setExternalOpen }:CartSidebarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop ON LOAD + RESIZE
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Which state to use?
  const isOpen = isMobile ? externalOpen : internalOpen;
  const setIsOpen = isMobile ? setExternalOpen : setInternalOpen;

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
      selected: false,
    },
    {
      id: 2,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
      selected: false,
    },
    {
      id: 3,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
      selected: false,
    },
  ]);

  // Quantity
  const increaseQty = (id: number) =>
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const decreaseQty = (id: number) =>
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );

  const removeItem = (id: number) =>
    setCartItems((prev) => prev.filter((it) => it.id !== id));

  const toggleSelect = (id: number) =>
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, selected: !it.selected } : it
      )
    );

  const allSelected = useMemo(
    () => cartItems.length > 0 && cartItems.every((i) => i.selected),
    [cartItems]
  );

  const toggleSelectAll = () =>
    setCartItems((prev) =>
      prev.map((it) => ({ ...it, selected: !allSelected }))
    );

  const { subtotal, discount, total, selectedCount } = useMemo(() => {
    let s = 0,
      d = 0,
      count = 0;

    for (const it of cartItems) {
      if (!it.selected) continue;
      s += it.price * it.qty;
      d += (it.oldPrice - it.price) * it.qty;
      count++;
    }

    return {
      subtotal: s,
      discount: d,
      total: s - d,
      selectedCount: count,
    };
  }, [cartItems]);

  return (
    <>
      {/* Desktop Floating Button */}
      {!isOpen && (
  <button
    onClick={() => setIsOpen(true)}
    className="fixed hidden lg:block right-0 top-1/2 -translate-y-1/2 z-[10001] 
               shadow-lg rounded-l-xl overflow-hidden"
  >
    <div className="w-[90px]">
      <div className="bg-black text-white flex flex-col items-center py-3">
        <div className="w-[28px] h-[28px] flex items-center justify-center">
          <Image
            src="/images/buy.png"
            alt="Cart Icon"
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>

        <span className="text-xs mt-2">
          *{cartItems.length.toString().padStart(2, "0")} Items
        </span>
      </div>

      <div className="bg-orange-500 text-white text-center py-2 font-semibold">
        ৳{subtotal.toLocaleString()}
      </div>
    </div>
  </button>
)}
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-[9998]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full 
        w-[345px] sm:w-[380px] md:w-[420px]
        bg-white shadow-xl z-[999999]
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 w-full bg-orange-500 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Sub Header */}
        <div className="mt-16 px-4 py-3 bg-[#f4f4f4] border-b flex justify-between items-center">
          <span className="font-medium text-sm">Shipping Cart</span>
          <span className="text-gray-500">(0{cartItems.length}) Items</span>
        </div>

        {/* Cart list scroll */}
        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 260px)" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 mb-3 bg-white rounded-lg w-full"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.id)}
                className="w-3 h-3 rounded-full appearance-none border-2 border-gray-300 
                           checked:bg-orange-500 checked:border-orange-500 cursor-pointer"
              />

              {/* Image */}
              <div className="min-w-[80px] w-20 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-sm leading-tight">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.color}</p>

                <div className="text-sm font-semibold text-orange-600 mt-1">
                  ৳{item.price}
                  <span className="line-through text-gray-400 text-xs ml-2">
                    ৳{item.oldPrice}
                  </span>
                </div>

                {/* Qty */}
                <div className="flex justify-between items-center mt-1">
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
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 text-lg"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
          <div className="p-4 bg-gray-100 rounded-xl border text-sm">
            <div className="flex justify-between items-start">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded-full appearance-none border-2 border-gray-300 
                                 checked:bg-orange-500 checked:border-orange-500 cursor-pointer"
                />
                <span>All</span>
              </label>

              <div className="text-right leading-tight">
                <div className="flex justify-between w-[140px] text-[14px]">
                  <span>Sub-total</span>
                  <span className="text-orange-600 font-semibold">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between w-[140px] mt-1 text-[14px]">
                  <span>Discount</span>
                  <span className="text-orange-600 font-medium">
                    ৳{discount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <hr className="my-3" />

            <div className="flex justify-end">
              <div className="flex justify-between w-[140px] font-bold text-[16px]">
                <span>Total</span>
                <span className="text-orange-600">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Link href="/checkout">
            <button
              onClick={() => setIsOpen(false)}
              disabled={selectedCount === 0}
              className={`mt-4 w-full md:py-3 py-2 rounded-full md:text-lg text-base shadow-md ${
                selectedCount === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Checkout
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
