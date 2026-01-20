"use client";

import React, { useState } from "react";
import Image from "next/image";

interface OrderDetails {
    id: number;
    code: string;
    date: number;
    grand_total: number;
    payment_type: string;
    delivery_status: string;
    shipping_address: {
        name: string;
        email: string;
        address: string;
        city: string;
        phone: string;
    };
    additional_info: {
        shipping_method_label: string;
    };
    order_details: Array<{
        id: number;
        product: {
            name: string;
        };
        quantity: number;
    }>;
}

export default function TrackOrder() {
    const [orderCode, setOrderCode] = useState("");
    const [orderData, setOrderData] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderCode.trim()) return;

        setLoading(true);
        setError(null);
        setOrderData(null);

        try {
            const response = await fetch("/api/order/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ order_code: orderCode.trim() }),
            });

            const result = await response.json();

            if (result.success && result.order) {
                setOrderData(result.order);
            } else {
                setError(result.message || "Order not found. Please check your code.");
            }
        } catch (err) {
            setError("An error occurred while tracking your order.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(",", "");
    };

    return (
        <main className="min-h-screen pt-24 pb-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header section with provided UI styling */}
                <div className="bg-[#222222] text-white py-4 px-6 mb-8 text-center rounded-sm shadow-md">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                        Track Your Order
                    </h1>
                </div>

                {/* Search Box */}
                <div className="max-w-3xl mx-auto mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 items-center justify-center">
                        <input
                            type="text"
                            placeholder="Enter your code"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            className="flex-1 w-full bg-[#f8f8f8] border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-[#f16335] hover:bg-[#d9562d] text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Tracking..." : "Track Order"}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center md:text-left">
                        To track your order please enter your Order ID in the box below and press the 'Track Order' button. This was given to you on your receipt and in the confirmation email you should have received.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Order Details Display */}
                {orderData && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Order Summary */}
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    Order Summary
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Order Code:</span>
                                            <span className="text-sm text-gray-600 w-2/3">{orderData.code}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Customer:</span>
                                            <span className="text-sm text-gray-600 w-2/3">{orderData.shipping_address.name}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Email:</span>
                                            <span className="text-sm text-gray-600 w-2/3">{orderData.shipping_address.email || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Shipping address:</span>
                                            <span className="text-sm text-gray-600 w-2/3">{orderData.shipping_address.address}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Order date:</span>
                                            <span className="text-sm text-gray-600 w-2/3">{formatDate(orderData.date)}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Total order amount:</span>
                                            <span className="text-sm font-bold text-gray-900 w-2/3">৳{orderData.grand_total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Shipping method:</span>
                                            <span className="text-sm text-gray-600 w-2/3 capitalize">{orderData.additional_info.shipping_method_label.replace(/_/g, " ")}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Payment method:</span>
                                            <span className="text-sm text-gray-600 w-2/3 capitalize">{orderData.payment_type.replace(/_/g, " ")}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-semibold text-gray-700 w-1/3">Delivery Status:</span>
                                            <span className="text-sm text-gray-600 w-2/3 capitalize">{orderData.delivery_status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#fafafa]">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-bold text-gray-800 border-b">Product Name</th>
                                            <th className="px-6 py-4 text-sm font-bold text-gray-800 border-b">Quantity</th>
                                            <th className="px-6 py-4 text-sm font-bold text-gray-800 border-b">Shipped By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orderData.order_details.map((detail) => (
                                            <tr key={detail.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-600">{detail.product.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{detail.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">Sannai Technology</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
