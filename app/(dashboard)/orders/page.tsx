"use client"
import React, { useEffect, useState } from 'react';
import { LuCopy } from "react-icons/lu";
import Link from 'next/link';

interface Order {
  id: number;
  code: string;
  user_id: number;
  payment_type: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: string;
  date: string;
  links: {
    details: string;
  };
}

interface PurchaseHistoryResponse {
  success: boolean;
  status: number;
  data: Order[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const OrderCard = ({ order, onGenerateInvoice }: { order: Order; onGenerateInvoice: (orderId: number) => void }) => {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Order ID copied to clipboard!");
  };

  return (
    <div className="bg-[#F3F4F6] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      {/* Order ID Section with Dashed Border */}
      <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px] bg-transparent">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Order ID #{order.code}
          </h3>
          <p className="text-sm text-gray-500 font-medium">Placed on {order.date}</p>
        </div>
        <button 
          onClick={() => handleCopy(order.code)}
          className="text-gray-500 hover:text-gray-800 transition-colors p-2"
          title="Copy Order ID"
        >
          <LuCopy size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link  
          href={`/orderdetails?id=${order.id}`}
          className="flex-1 md:flex-none bg-[#D1D5DB] hover:bg-gray-400 text-gray-800 font-bold px-8 py-2.5 rounded-lg transition-colors"
        >
          Details
        </Link>
        <button 
          onClick={() => onGenerateInvoice(order.id)}
          className="flex-1 md:flex-none bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("like_auth_token") : null;
      
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/orders/purchase-history", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const json: PurchaseHistoryResponse = await res.json();

        if (json.success && json.data && Array.isArray(json.data)) {
          setOrders(json.data);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleGenerateInvoice = (orderId: number) => {
    // Open invoice in new window/tab
    window.open(`/orderdetails?id=${orderId}&invoice=true`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* List of Orders */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onGenerateInvoice={handleGenerateInvoice} />
          ))}
        </div>
      )}
    </div>
  );
}