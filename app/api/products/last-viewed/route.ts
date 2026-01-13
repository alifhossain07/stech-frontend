import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const bearerToken = getBearerToken(req);

    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      Authorization: `Bearer ${bearerToken}`,
    };

    const res = await fetch(`${API_BASE}/products/last-viewed`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Last viewed products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch last viewed products" },
      { status: 500 }
    );
  }
}
