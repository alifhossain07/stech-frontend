"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaWhatsapp, FaFacebookMessenger, FaTimes } from "react-icons/fa";

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
  const { user } = useAuth();
  const isDealer = user?.type?.toLowerCase() === "dealer";
  const [mounted, setMounted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [messengerNumber, setMessengerNumber] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showChatBubble, setShowChatBubble] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch WhatsApp number from business-settings
  useEffect(() => {
    const fetchWhatsappNumber = async () => {
      try {
        const res = await fetch("/api/business-settings", { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.data) {
          const whatsappSetting = json.data.find(
            (setting: { type: string; value: string }) => setting.type === "whatsapp_number"
          );
          if (whatsappSetting?.value) {
            setWhatsappNumber(whatsappSetting.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch WhatsApp number:", error);
      }
    };

    fetchWhatsappNumber();
  }, []);
  // Fetch Messenger ID from business-settings
  useEffect(() => {
    const fetchMessengerNumber = async () => {
      try {
        const res = await fetch("/api/business-settings", { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.data) {
          const messengerSetting = json.data.find(
            (setting: { type: string; value: string }) => setting.type === "facebook_messenger_chat"
          );
          if (messengerSetting?.value) {
            setMessengerNumber(messengerSetting.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Messenger ID:", error);
      }
    };

    fetchMessengerNumber();
  }, []);
  // When the sidebar opens, select all items by default
  useEffect(() => {
    if (externalOpen) {
      setSelectedItems(cart.map((item) => item.variant ? `${item.id}-${item.variant}` : item.id.toString()));

      if (typeof window !== "undefined" && cart.length > 0) {
        const items = cart.map((item) => ({
          item_id: item.id.toString(),
          item_name: item.name,
          price: item.price,
          quantity: item.qty,
          item_variant: item.variant || "",
        }));

        const totalValue = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "view_cart",
          ecommerce: {
            currency: "BDT",
            value: totalValue,
            items: items,
          },
        });
      }
    }
  }, [externalOpen, cart, setSelectedItems]);

  const typedCart: CartItem[] = cart;

  const toggleSelect = (id: string | number, variant?: string) => {
    const key = variant ? `${id}-${variant}` : id.toString();
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === typedCart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(typedCart.map(item => item.variant ? `${item.id}-${item.variant}` : item.id.toString()));
    }
  };

  // Only calculate totals for selected items
  const selectedCart = typedCart.filter(item => {
    const key = item.variant ? `${item.id}-${item.variant}` : item.id.toString();
    return selectedItems.includes(key);
  });
  // Subtotal should reflect pre-discount sum; discount reflects savings
  const subtotal = selectedCart.reduce((acc, item) => acc + (Number(item.oldPrice ?? item.price) * item.qty), 0);
  const discount = selectedCart.reduce((acc, item) => acc + Math.max(0, Number(item.oldPrice) - Number(item.price)) * item.qty, 0);
  const total = subtotal - discount;

  return (
    <>
      {/* Floating Cart Button */}
      {!isDealer && (
        <div className="fixed hidden lg:flex flex-col right-0 top-1/2 -translate-y-1/2 z-[10001] gap-3">
          <button
            onClick={() => setExternalOpen(true)}
            className="shadow-lg rounded-l-xl overflow-hidden"
          >
            <div className="w-[90px]">
              <div className="bg-gray-900 text-white flex flex-col items-center py-3">
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
        </div>
      )}

      {/* Floating Chat Widget */}
      <div className="fixed bottom-20 md:bottom-6 right-3 z-[10001] flex flex-col items-end gap-3">
        {/* OLD STATIC BUTTONS (Commented Out) */}
        {/* 
        <div className="fixed z-[10001] gap-3 flex flex-col
          right-0 bottom-20
          lg:right-0 lg:top-[62%] lg:-translate-y-1/2
          lg:bottom-auto">
          <div className="flex bg-orange-500 p-1 rounded-l-xl flex-row gap-1">
            <a
              href={messengerNumber ? `https://m.me/${messengerNumber}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[40px] h-[40px] bg-white border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg hover:border-orange-400 transition-colors"
              aria-label="Facebook Messenger"
            >
              <SiMessenger className="text-black text-[24px]" />
            </a>

            <a
              href={whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[40px] h-[40px] bg-white border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg hover:border-orange-600 transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-black text-[24px]" />
            </a>
          </div>
        </div>
        */}

        {/* Expanded Buttons (Messenger, WhatsApp) */}
        <div className={`flex flex-col gap-3 transition-all duration-300 transform ${chatOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-0 pointer-events-none h-0"
          }`}>
          {/* Messenger */}
          <a
            href={messengerNumber ? `https://m.me/${messengerNumber}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <FaFacebookMessenger className="text-2xl" />
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <FaWhatsapp className="text-2xl" />
          </a>
        </div>

        {/* Main Avatar / Close Button */}
        <div className="relative group flex items-center gap-3">
          {/* Text Bubble */}
          <div className={`bg-white shadow-xl text-gray-700 px-4 py-2 rounded-xl rounded-tr-none border border-gray-100 transition-all duration-300 origin-right ${!chatOpen && showChatBubble ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-4 pointer-events-none"
            }`}>
            <div className="flex items-center gap-2 relative">
              <span className="text-sm font-medium">Sir, How can I help?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatBubble(false);
                }}
                className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 text-[10px]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 relative ${chatOpen ? "bg-blue-600 rotate-90" : "bg-white hover:scale-105 border-2 border-orange-500"
              }`}
          >
            {/* Collapsed State: Avatar Image */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${chatOpen ? "opacity-0" : "opacity-100"}`}>
              <div className="w-full h-full relative">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                    alt="Support"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
                </span>
              </div>
            </div>

            {/* Expanded State: Close Icon */}
            <div className={`absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 rounded-full overflow-hidden ${chatOpen ? "opacity-100" : "opacity-0 invisible"}`}>
              <FaTimes className="text-2xl" />
            </div>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {externalOpen && (
        <div onClick={() => setExternalOpen(false)} className="fixed inset-0 bg-black/30 z-[9998]" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[450px] bg-white shadow-xl z-[20000] transform transition-transform duration-300 ${externalOpen ? "translate-x-0" : "translate-x-full"
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
                onClick={() => toggleSelect(item.id, item.variant)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedItems.includes(item.variant ? `${item.id}-${item.variant}` : item.id.toString())
                  ? "bg-orange-500 border-orange-500"
                  : "border-gray-400"
                  }`}
              >
                {selectedItems.includes(item.variant ? `${item.id}-${item.variant}` : item.id.toString()) && (
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
                      onClick={() => decreaseQty(item.id, item.variant)}
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id, item.variant)}
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
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
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedItems.length === typedCart.length && typedCart.length > 0
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
              className={`w-full py-3 rounded-full text-white ${selectedItems.length > 0
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
