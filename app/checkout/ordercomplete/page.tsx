"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Product {
  id: string | number;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    address: string;
  };
  items: Product[];
  totalAmount: number;
}

export default function OrderComplete() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl border rounded-2xl p-8 md:p-12 bg-white shadow-sm text-center">

        {/* Tick Icon */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/tick.png"
            alt="Success"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-semibold text-orange-500 mb-3">
          Your order is complete!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm md:text-base mb-8">
          Thank you. Your order has been received.
        </p>

        {/* Order Details Box */}
       
       

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition"
          >
            ← Return Shopping
          </Link>

          <button
            className="px-6 py-3 rounded-xl bg-white shadow-md border hover:bg-gray-50 transition text-orange-500"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
