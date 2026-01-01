import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * POST /api/auth/logout
 * Logs out the user by invalidating the Bearer token on the server
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Backend: POST /api/v2/auth/logout
 */
export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header
    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { result: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    // Call backend API: POST /api/v2/auth/logout
    const res = await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        "Authorization": `Bearer ${bearerToken}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Logout proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

