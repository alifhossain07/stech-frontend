import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE;
const SYSTEM_KEY = process.env.SYSTEM_KEY;

export async function GET(req: NextRequest) {
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

  try {
    const response = await axios.get(`${API_BASE}/shipping-config`, {
      headers,
    });
    
    // Return the response data as-is (should have {result: true, data: {...}})
    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch shipping config",
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected error fetching shipping config" },
      { status: 500 }
    );
  }
}
