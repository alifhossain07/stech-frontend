import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

// Proxies external areas API, supports optional name query for suggestions
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Extract Bearer token from Authorization header (returns null for guest users)
  const bearerToken = getBearerToken(req);
  
  // Build headers
  const headers: Record<string, string> = {
    "System-Key": SYSTEM_KEY,
    "Cache-Control": "no-store",
    Accept: "application/json",
    ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
  };

  const url = name
    ? `${API_BASE}/states?name=${encodeURIComponent(name)}`
    : `${API_BASE}/states`;

  try {
    const response = await axios.get(url, {
      headers,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch areas",
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected error fetching areas" },
      { status: 500 }
    );
  }
}
