import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// Type for a single business setting
interface BusinessSetting {
  type: string;
  value: string | number | null | Array<{
    type: string;
    label: string;
  }> | string[];
}

// Response type from external API
interface BusinessSettingsResponse {
  data: BusinessSetting[];
  success: boolean;
  status: number;
}

export async function GET() {
  try {
    // Fetch business settings from the API
    const res = await fetch(`${API_BASE}/business-settings`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
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

    // Return the full data structure as provided by the API
    return NextResponse.json({
      success: json.success ?? true,
      status: json.status ?? 200,
      data: json.data ?? [],
    });
  } catch (error) {
    console.error("Business settings API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

