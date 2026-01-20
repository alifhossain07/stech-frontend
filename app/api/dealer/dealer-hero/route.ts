import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(req: NextRequest) {
  try {
    // Extract Bearer token if user is authenticated
    const bearerToken = getBearerToken(req);

    // Build headers consistent with your API requirements
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const response = await fetch(`${API_BASE}/dealer-hero`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Remote API responded with status: ${response.status}`);
    }

    const json = await response.json();

    // Return the data object directly as it contains the structure you provided
    return NextResponse.json({
      success: true,
      data: json.data,
    });

  } catch (error) {
    console.error("Dealer Hero API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dealer hero data" },
      { status: 500 }
    );
  }
}