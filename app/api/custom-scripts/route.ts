import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const bearerToken = getBearerToken(req);

    interface Setting {
      type: string;
      value: string;
      key?: string;
    }

    const headers: Record<string, string> = {
      "Accept": "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { "Authorization": `Bearer ${bearerToken}` }),
    };

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

    const result = await res.json();

    // 1. Log the keys to your terminal to verify what is actually coming back
    // console.log("API Response Keys:", Object.keys(result));
    
    // 2. Handle both direct array responses or { data: [] } responses
    const settingsArray = Array.isArray(result) ? result : result.data || [];

    if (!Array.isArray(settingsArray) || settingsArray.length === 0) {
      return NextResponse.json({
        success: true,
        header_script: "",
        footer_script: "",
        debug: "No data array found in response" 
      });
    }

    // 3. Extract values using find (case-sensitive check)
    const headerScript = settingsArray.find((s: Setting) => s.type === "header_script")?.value || "";
    const footerScript = settingsArray.find((s: Setting) => s.type === "footer_script")?.value || "";

    return NextResponse.json({
      success: true,
      header_script: headerScript,
      footer_script: footerScript,
    });
    
  } catch (error) {
    console.error("Custom scripts API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}