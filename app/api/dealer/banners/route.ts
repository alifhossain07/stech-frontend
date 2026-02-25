import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      Accept: "application/json",
    };

    const response = await fetch(`${API_BASE}/dealer/home/other-page-banners`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const json = await response.json();
    return NextResponse.json(
      { success: true, data: json },
      { status: response.status }
    );
  } catch (err) {
    console.error("Dealer Banners Proxy Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
