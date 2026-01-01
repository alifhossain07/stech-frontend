import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { error: "API_BASE or SYSTEM_KEY is missing" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "System-Key": systemKey,
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const response = await fetch(`${apiBase}/header/logo`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch logo", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 🔥 Return EXACT response, unchanged
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
