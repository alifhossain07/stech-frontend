import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/shipping-config`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        { result: false, message: "Failed to load shipping config" },
        { status: res.status }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Shipping-config API error:", error);
    return NextResponse.json(
      { result: false, message: "Error loading shipping config" },
      { status: 500 }
    );
  }
}
