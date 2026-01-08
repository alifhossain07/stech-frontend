import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;


interface BusinessSetting {
  type: string;
  value: string;
}

interface BusinessSettingsResponse {
  success?: boolean;
  data: BusinessSetting[];
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
