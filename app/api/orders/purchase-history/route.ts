import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE;
const SYSTEM_KEY = process.env.SYSTEM_KEY;

export async function GET(req: NextRequest) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    // Extract Bearer token from Authorization header
    const bearerToken = getBearerToken(req);
    
    // Build headers
    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      "Cache-Control": "no-store",
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const url = `${API_BASE}/purchase-history?page=${page}`;

    const response = await axios.get(url, {
      headers,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch purchase history",
        },
        { status: err.response?.status || 500 }
      );
    }

    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

