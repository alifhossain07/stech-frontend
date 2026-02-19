import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(req: NextRequest) {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };

    const response = await fetch(`${API_BASE}/dealer/home/hero`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const json = await response.json();
    return NextResponse.json(
      { success: true, data: json.data },
      { status: response.status }
    );

  } catch (error) {
    console.error("Dealer Hero API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dealer hero data" },
      { status: 500 }
    );
  }
}