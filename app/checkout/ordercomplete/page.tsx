"use client";
import Image from "next/image";
import Link from "next/link";

export default function OrderComplete() {
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
          Your order is complete !
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm md:text-base mb-8">
          Thank you. your order has been received.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Return Shopping Button */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition"
          >
            ← Return Shopping
          </Link>

          {/* Download Invoice Button */}
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
