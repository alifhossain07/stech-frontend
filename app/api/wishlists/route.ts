// /api/wishlists - Get all wishlist items
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const bearerToken = getBearerToken(req);

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
    };

    const response = await axios.get(`${API_BASE}/wishlists`, {
      headers,
    });

    console.log("Wishlists API response:", response.data);

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/wishlists error:", err.message);
      console.error("Full error:", err.response?.data);

      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message,
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
