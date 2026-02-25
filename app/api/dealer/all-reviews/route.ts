import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      Accept: "application/json",
    };

    const response = await fetch(`${API_BASE}/dealer/all-reviews`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const json = await response.json();
    return NextResponse.json(
      { success: true, data: json.data },
      { status: response.status }
    );
  } catch (err) {
    console.error("Dealer All Reviews Proxy Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
