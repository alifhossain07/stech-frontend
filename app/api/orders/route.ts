// /api/orders.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface OrderItem {
  id: number | string;
  qty: number | string;
  variant?: string | null;
  variation?: string | null;
  referral_code?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Frontend payload received:", data);

    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY in environment");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const payload = {
      customer: {
        name: data.customer?.name ?? "",
        mobile: data.customer?.mobile ?? "",
        email: data.customer?.email || null,
        address: data.customer?.address ?? "",
        country_id: data.customer?.country_id ?? null,
        state_id: data.customer?.state_id ?? null,
        city_id: data.customer?.city_id ?? null,
        area_id: data.customer?.area_id ?? null,
        postal_code: data.customer?.postal_code ?? "1230",
      },

      items:
        Array.isArray(data.items) && data.items.length > 0
          ? data.items.map((item: OrderItem) => ({
              id: Number(item.id),
              qty: Number(item.qty),
              variant: item.variant ?? null,
              variation: item.variation ?? null,
              referral_code: item.referral_code ?? null,
            }))
          : null,

      shipping_method: data.shipping_method,
      shipping_charge: Number(data.shipping_charge) || 0,
      payment_method: data.payment_method || null,
      payment_number: data.payment_number || null,
      promo_code: data.promo_code || null,
      note: data.note ?? "",
      pickup_point_id: data.pickup_point_id ?? null,
      carrier_id: data.carrier_id ?? null,
    };

    console.log("Mapped payload to backend API:", payload);

    const response = await axios.post(`${API_BASE}/order/checkout`, payload, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend URL", `${API_BASE}/order/checkout`);
    console.log("Backend API response:", response.data);

    if (response.data.result) {
      return NextResponse.json({ success: true, data: response.data });
    } else {
      return NextResponse.json(
        { success: false, message: response.data.message || "Order failed" },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/orders error:", err.message);
      console.error("Full error:", err.response?.data);

      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message,
        },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", err);

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
