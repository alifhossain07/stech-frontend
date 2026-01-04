"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variation: string;
  price: string;
  quantity: number;
  product_thumbnail_image?: string;
  thumbnail_image?: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string | null;
  phone: string;
}

interface OrderDetails {
  id: number;
  code: string;
  user_id: number;
  shipping_address: ShippingAddress;
  payment_type: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: string;
  date: string;
  items?: OrderItem[];
}

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

interface OrderDetailsResponse {
  success: boolean;
  status: number;
  data: OrderDetails[];
}

type FilterTab = 'all' | 'pending' | 'delivered' | 'cancelled';

export default function OrdersPage() {
  const router = useRouter();
  const { accessToken, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<number, OrderDetails>>({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState('old');

  useEffect(() => {
    if (authLoading) return;

    const fetchOrders = async () => {
      if (!accessToken) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/orders/purchase-history", {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Orders API error:", res.status, errorData);
          setError(errorData.message || `Failed to load orders (${res.status})`);
          setLoading(false);
          return;
        }

        const json: PurchaseHistoryResponse = await res.json();

        if (json.success && json.data && Array.isArray(json.data)) {
          setOrders(json.data);
          
          // Fetch details for each order
          json.data.forEach((order) => {
            fetchOrderDetails(order.id, accessToken);
          });
        } else {
          if (
            typeof json === 'object' &&
            json !== null &&
            'message' in json &&
            typeof (json as { message?: unknown }).message === 'string'
          ) {
            setError((json as { message: string }).message);
          } else {
            setError("Failed to load orders");
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken, authLoading]);

  const fetchOrderDetails = async (orderId: number, token: string) => {
    try {
      setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
      const res = await fetch(`/api/orders/purchase-history-details/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Order details API error for ${orderId}:`, res.status);
        return;
      }

      const json: OrderDetailsResponse = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        setOrderDetailsMap(prev => ({
          ...prev,
          [orderId]: json.data[0]
        }));
      } else {
        console.warn(`No order details found for order ${orderId}`);
      }
    } catch (err) {
      console.error(`Error fetching order details for ${orderId}:`, err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    if (activeTab === 'pending') {
      filtered = orders.filter(order => 
        order.delivery_status.toLowerCase() === 'pending' || 
        order.delivery_status.toLowerCase() === 'in progress' ||
        order.delivery_status.toLowerCase() === 'processing'
      );
    } else if (activeTab === 'delivered') {
      filtered = orders.filter(order => 
        order.delivery_status.toLowerCase() === 'delivered' ||
        order.delivery_status.toLowerCase() === 'completed'
      );
    } else if (activeTab === 'cancelled') {
      filtered = orders.filter(order => 
        order.delivery_status.toLowerCase() === 'cancelled' ||
        order.delivery_status.toLowerCase() === 'canceled'
      );
    }

    // Sort orders
    if (sortBy === 'old') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
    } else {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const getStatusMessage = (deliveryStatus: string) => {
    const status = deliveryStatus.toLowerCase();
    if (status === 'pending' || status === 'in progress' || status === 'processing') {
      return 'Your order has been accepted';
    } else if (status === 'delivered' || status === 'completed') {
      return 'Your order has been delivered';
    } else if (status === 'cancelled' || status === 'canceled') {
      return 'Your order has been cancelled';
    }
    return 'Your order is being processed';
  };



  const handleTrackOrder = (orderId: number) => {
    router.push(`/orderdetails?id=${orderId}`);
  };

  const handleInvoice = (orderId: number) => {
    window.open(`/orderdetails?id=${orderId}&invoice=true`, '_blank');
  };

  const handleCancel = (orderId: number) => {
    // TODO: Implement cancel order functionality
    alert(`Cancel order ${orderId} functionality will be implemented`);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="old">Old order</option>
              <option value="new">New order</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'all' as FilterTab, label: 'All orders' },
            { key: 'pending' as FilterTab, label: 'In progress' },
            { key: 'delivered' as FilterTab, label: 'Delivered' },
            { key: 'cancelled' as FilterTab, label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {(loading || authLoading) && (
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
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Orders List - Scrollable */}
      <div className="p-6 space-y-6">
        {!loading && !error && filteredOrders.map((order) => {
          const details = orderDetailsMap[order.id];
          const isLoadingDetails = loadingDetails[order.id];

          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Order Summary Banner */}
              <div className="bg-gray-800 text-white p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Order ID</p>
                    <p className="font-semibold">#{order.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total Payment</p>
                    <p className="font-semibold">{order.grand_total}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                    <p className="font-semibold">{order.payment_type}</p>
                  </div>
                 
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-orange-50 px-4 py-2.5 flex items-center justify-between border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-orange-600 font-medium text-sm capitalize">
                    {order.delivery_status_string}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{getStatusMessage(order.delivery_status)}</p>
              </div>

              {/* Order Items */}
              <div className="p-4 bg-gray-50">
                {isLoadingDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : details ? (
                  details.items && details.items.length > 0 ? (
                    <div className="space-y-3">
                      {details.items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center bg-white rounded-lg p-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <Image
                              src={item.product_thumbnail_image || item.thumbnail_image || "/images/placeholder.png"}
                              alt={item.product_name}
                              width={64}
                              height={64}
                              className="object-contain w-full h-full"
                              unoptimized
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.product_name}</h3>
                            <p className="text-xs text-gray-600">
                              {item.variation || 'Standard'} | {String(item.quantity).padStart(2, '0')} {item.quantity === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <p className="text-base font-bold text-gray-900">{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center">No items available for this order</p>
                  )
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">Loading order details...</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-4 flex flex-wrap gap-3 border-t border-gray-100">
                <button
                  onClick={() => handleTrackOrder(order.id)}
                  className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Track Order
                </button>
                <button
                  onClick={() => handleInvoice(order.id)}
                  className="flex-1 md:flex-none border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-2.5 rounded-lg transition-colors bg-white"
                >
                  Invoice
                </button>
                {order.delivery_status.toLowerCase() !== 'cancelled' && 
                 order.delivery_status.toLowerCase() !== 'delivered' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="flex-1 md:flex-none border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-2.5 rounded-lg transition-colors bg-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
