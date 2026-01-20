import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_code } = body;

    if (!order_code) {
      return NextResponse.json(
        { success: false, message: "Order code is required" },
        { status: 400 }
      );
    }

    // Forwarding to the backend. User mentioned GET with body.
    // In many cases, APIs that take "GET with body" also accept "POST".
    // We'll try fetching with the provided information.
    const res = await fetch(`${API_BASE}/order/track?order_code=${order_code}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Order tracking proxy error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
