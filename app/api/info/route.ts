import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// Type for a single business setting
interface BusinessSetting {
  type: string;
  value: string;
}

// Response type from external API
interface BusinessSettingsResponse {
  data: BusinessSetting[];
}

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

    // Fetch business settings dynamically using environment variables
    const res = await fetch(`${API_BASE}/business-settings`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch business settings",
          status: res.status,
        },
        { status: res.status }
      );
    }

    const json: BusinessSettingsResponse = await res.json();

    if (!json.data || json.data.length === 0) {
      return NextResponse.json({ success: true, settings: [] });
    }

    // Map settings to frontend-friendly structure
    const settings = json.data.map((setting) => ({
      key: setting.type,
      value: setting.value,
    }));

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Business settings API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
