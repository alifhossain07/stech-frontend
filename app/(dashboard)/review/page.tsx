"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import ReviewModal from "@/components/ui/ReviewModal";

/* -------------------- Types -------------------- */
interface Product {
  id: number;
  product_id: number;
  product_name: string;
  product_thumbnail_image: string;
  quantity: number;
}

interface OrderDetails {
  id: number;
  items: Product[];
}

interface OrderDetailsResponse {
  success: boolean;
  data: OrderDetails[];
}

interface Order {
  id: number;
  code: string;
  delivery_status: string;
  delivery_status_string: string;
  date: string;
}

interface PurchaseHistoryResponse {
  success: boolean;
  data: Order[];
}

/* -------------------- Component -------------------- */
export default function ReviewPage() {
  const { accessToken, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("to-be-reviewed");
  const [loading, setLoading] = useState(false);
  const [orderProducts, setOrderProducts] = useState<Record<number, Product[]>>({});
  const [orders, setOrders] = useState<Order[]>([]);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products for a specific order
  const fetchOrderDetails = useCallback(async (orderId: number, token: string) => {
    try {
      const res = await fetch(`/api/orders/purchase-history-details/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(`Failed to fetch order details for ${orderId}`);
        return null;
      }

      const json: OrderDetailsResponse = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Extract items from the first order in the data array
        return { orderId, products: json.data[0].items || [] };
      }
      return null;
    } catch (err) {
      console.error(`Error fetching order details for ${orderId}:`, err);
      return null;
    }
  }, []);

  // Fetch delivered orders and their products
  const fetchData = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const res = await fetch("/api/orders/purchase-history", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch orders:", res.status);
        return;
      }

      const json: PurchaseHistoryResponse = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const deliveredOrders = json.data.filter(
          (order) =>
            order.delivery_status.toLowerCase() === "delivered" ||
            order.delivery_status_string?.toLowerCase() === "delivered"
        );

        setOrders(deliveredOrders);

        // Fetch details for all delivered orders in parallel
        const detailsPromises = deliveredOrders.map((order) =>
          fetchOrderDetails(order.id, accessToken)
        );
        const results = await Promise.all(detailsPromises);

        const productsMap: Record<number, Product[]> = {};
        results.forEach((res) => {
          if (res) {
            productsMap[res.orderId] = res.products;
          }
        });

        setOrderProducts(productsMap);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, fetchOrderDetails]);

  const handleReviewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchData();
    }
  }, [accessToken, authLoading, fetchData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("to-be-reviewed")}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${activeTab === "to-be-reviewed"
            ? "bg-[#E9672B] text-white"
            : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
            }`}
        >
          To Be Reviewed
        </button>
        <button
          onClick={() => setActiveTab("review-history")}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${activeTab === "review-history"
            ? "bg-[#E9672B] text-white"
            : "bg-[#F3F4F6] text-gray-500 hover:bg-gray-200"
            }`}
        >
          Review History
        </button>
      </div>

      {/* --- Tab Content --- */}
      {activeTab === "to-be-reviewed" && (
        <div className="space-y-6">
          {loading || authLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="bg-[#F3F4F6] rounded-xl py-12 flex flex-col items-center justify-center text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No Record found!
              </h2>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const products = orderProducts[order.id] || [];
                if (products.length === 0) return null;

                return (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order.code}</h3>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                        {order.delivery_status_string || order.delivery_status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {products.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between group last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                              <Image
                                src={item.product_thumbnail_image}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 line-clamp-1">{item.product_name}</p>
                              <p className="text-xs text-gray-400 mb-1">Product ID: {item.product_id}</p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReviewClick(item)}
                            className="px-5 py-2 text-sm font-bold rounded-lg bg-[#E9672B] text-white hover:bg-[#d8561a] transition-colors shadow-sm"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "review-history" && (
        <div className="bg-[#F3F4F6] rounded-xl py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Image src="/images/cdelivery.png" alt="Empty" width={32} height={32} className="opacity-20 translate-y-[-2px]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            No review history found!
          </h2>
          <p className="text-sm text-gray-500 mt-1">You haven&apos;t submitted any reviews yet.</p>
        </div>
      )}

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={selectedProduct.product_id}
          productName={selectedProduct.product_name}
          productImage={selectedProduct.product_thumbnail_image}
          onSuccess={() => {
            // Optionally refresh data if needed, though review history might not update immediately depending on backend
            // fetchData(); 
          }}
        />
      )}
    </div>
  );
}
