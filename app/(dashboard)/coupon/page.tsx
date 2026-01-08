"use client";

import React, { useEffect, useState } from "react";
import { LuGift, LuCopy, LuCheck } from "react-icons/lu";

/* -------------------- Types -------------------- */
interface CouponDiscountDetails {
  min_buy: string;
  max_discount: string;
}

interface Coupon {
  id: number;
  user_type: string;
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  coupon_type: string;
  code: string;
  discount: string;
  coupon_product_details: unknown[];
  coupon_discount_details: CouponDiscountDetails;
  discount_type: string;
  start_date: number;
  end_date: number;
}

interface CouponResponse {
  data: Coupon[];
  success: boolean;
  status: number;
}

/* -------------------- Component -------------------- */
export default function Coupon() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/coupons");
        const result: CouponResponse = await res.json();

        if (result.success) {
          setCoupons(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Coupon</h1>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-center py-20">Loading coupons...</p>
      )}

      {/* Empty State */}
      {!loading && coupons.length === 0 && (
        <div className="bg-[#F3F4F6] rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          <LuGift size={64} className="text-gray-900 stroke-[1.5] mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">
            No Record found!
          </h2>
        </div>
      )}

      {/* Coupon List */}
      {!loading && coupons.length > 0 && (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
            >
              <div>
                <p className="text-sm text-gray-500">Coupon Code</p>
                <p className="text-lg font-semibold text-gray-900">
                  {coupon.code}
                </p>
                <p className="text-sm text-gray-600">
                  Discount: {coupon.discount} • Min Buy:{" "}
                  {coupon.coupon_discount_details.min_buy}
                </p>
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <LuCheck className="text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <LuCopy />
                    Copy
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
