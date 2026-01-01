"use client"
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuCopy } from "react-icons/lu";
import { useSearchParams } from 'next/navigation';

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string | null;
  postal_code: string | null;
  phone: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variation: string;
  price: string;
  tax: string;
  shipping_cost: string;
  coupon_discount: string;
  quantity: number;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  refund_section: boolean;
  refund_button: boolean;
  refund_label: string;
  refund_request_status: number;
}

interface OrderDetails {
  id: number;
  code: string;
  user_id: number;
  shipping_address: ShippingAddress;
  payment_type: string;
  pickup_point: string | null;
  shipping_type: string;
  shipping_type_string: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: string;
  plane_grand_total: number;
  coupon_discount: string;
  shipping_cost: string;
  subtotal: string;
  tax: string;
  date: string;
  cancel_request: boolean;
  manually_payable: boolean;
  items: OrderItem[];
  links: {
    details: string;
  };
}

interface OrderDetailsResponse {
  success: boolean;
  status: number;
  data: OrderDetails[];
}

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const isInvoiceMode = searchParams.get("invoice") === "true";

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("like_auth_token") : null;
      
      if (!token) {
        setError("Please login to view order details");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/orders/purchase-history-details/${orderId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const json: OrderDetailsResponse = await res.json();

        if (json.success && json.data && json.data.length > 0) {
          setOrderDetails(json.data[0]);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Order ID copied to clipboard!");
  };

  const handleGenerateInvoice = () => {
    if (orderId) {
      window.open(`/orderdetails?id=${orderId}&invoice=true`, '_blank');
    }
  };

  // Auto-print when in invoice mode
  useEffect(() => {
    if (isInvoiceMode && orderDetails && !loading) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [isInvoiceMode, orderDetails, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Link 
            href="/orders" 
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderContent = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">{isInvoiceMode ? "Invoice" : "Order Details"}</h1>
        {!isInvoiceMode && (
          <Link 
            href="/orders" 
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            Go Back
          </Link>
        )}
      </div>

      {/* Top Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Order ID with Dashed Border */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Order ID #{orderDetails.code}
              <button onClick={() => handleCopy(orderDetails.code)} className="text-gray-400 hover:text-gray-600">
                <LuCopy size={18} />
              </button>
            </h3>
            <p className="text-sm text-gray-500 font-medium">Placed on {orderDetails.date}</p>
          </div>
        </div>

        {!isInvoiceMode && (
          <button 
            onClick={handleGenerateInvoice}
            className="bg-[#E9672B] hover:bg-[#d55b24] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
          >
            Generate Invoice
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="space-y-4 mb-8">
        {orderDetails.items.map((item) => (
          <div key={item.id} className="bg-[#F9FAFB] rounded-xl p-4 flex gap-4 border border-gray-50">
            <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 border border-gray-100 p-2 relative">
              <Image 
                src="https://via.placeholder.com/100"
                alt={item.product_name}
                width={100}
                height={100}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">{item.product_name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-2">
                {item.variation}
              </p>
              <p className="text-sm font-semibold text-gray-700">Qty : {item.quantity}</p>
              <p className="text-lg font-bold text-[#E9672B] mt-1">{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Address and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Shipping address
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Name :</span> {orderDetails.shipping_address.name}</p>
            <p><span className="font-medium text-gray-800">Mobile number :</span> {orderDetails.shipping_address.phone}</p>
            <p><span className="font-medium text-gray-800">Email :</span> {orderDetails.shipping_address.email}</p>
            <p className="leading-relaxed">
              <span className="font-medium text-gray-800">Address :</span> {orderDetails.shipping_address.address}
              {orderDetails.shipping_address.city && `, ${orderDetails.shipping_address.city}`}
              {orderDetails.shipping_address.state && `, ${orderDetails.shipping_address.state}`}
              {orderDetails.shipping_address.country && `, ${orderDetails.shipping_address.country}`}
              {orderDetails.shipping_address.postal_code && ` - ${orderDetails.shipping_address.postal_code}`}
            </p>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Total Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Price</span>
              <span className="font-semibold text-gray-900">{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">{orderDetails.shipping_cost}</span>
            </div>
            <div className="flex justify-between text-[#008D41]">
              <span>Coupon Discount</span>
              <span className="font-semibold">{orderDetails.coupon_discount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold text-gray-900">{orderDetails.tax}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="font-bold text-gray-900">{orderDetails.grand_total}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600 font-medium">Payment Status</span>
              <span className={`font-semibold ${
                orderDetails.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'
              }`}>
                {orderDetails.payment_status_string}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Delivery Status</span>
              <span className="font-semibold text-gray-900">{orderDetails.delivery_status_string}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Payment Type</span>
              <span className="font-semibold text-gray-900">{orderDetails.payment_type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return orderContent;
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}