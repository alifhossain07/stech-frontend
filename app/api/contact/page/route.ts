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

    const res = await fetch(`${API_BASE}/contact/page`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch contact page data" },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json(json);
  } catch (error) {
    console.error("Contact page API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load contact page data" },
      { status: 500 }
    );
  }
}

