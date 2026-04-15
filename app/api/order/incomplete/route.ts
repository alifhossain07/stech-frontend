import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY in environment");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Payload mapping for the incomplete order endpoint
    const payload = {
      customer: {
        name: data.customer?.name ?? "null",
        mobile: data.customer?.mobile ?? "",
        email: data.customer?.email ?? "null@gmail.com",
        address: data.customer?.address ?? "null",
        country_id: data.customer?.country_id ?? null,
        state_id: data.customer?.state_id ?? null,
        city_id: data.customer?.city_id ?? null,
        area_id: data.customer?.area_id ?? null,
        pathao_city_id: data.customer?.pathao_city_id ?? null,
        pathao_zone_id: data.customer?.pathao_zone_id ?? null,
        pathao_area_id: data.customer?.pathao_area_id ?? null,
      },
      items: data.items ?? [],
      shipping_method: data.shipping_method ?? "home_delivery",
      shipping_zone: data.shipping_zone ?? "insideDhaka",
      payment_method: data.payment_method ?? "Cash on Delivery",
      payment_number: data.payment_number ?? null,
      promo_code: data.promo_code ?? null,
      note: data.note ?? "",
      pickup_point_id: data.pickup_point_id ?? null,
      carrier_id: data.carrier_id ?? null,
      is_incomplete: 1
    };

    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    // Forward to the backend incomplete order endpoint
    const response = await axios.post(`${API_BASE}/order/incomplete`, payload, {
      headers,
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/order/incomplete error:", err.response?.data || err.message);
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message,
        },
        { status: err.response?.status || 500 }
      );
    }
    console.error("Unexpected error in proxy:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
