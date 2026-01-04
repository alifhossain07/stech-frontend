import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(req: NextRequest) {
  try {
    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    // Build headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const res = await fetch(`${API_BASE}/pages`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch pages" },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json(json);
  } catch (error) {
    console.error("Pages API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load pages" },
      { status: 500 }
    );
  }
}

