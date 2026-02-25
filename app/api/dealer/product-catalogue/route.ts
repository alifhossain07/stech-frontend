import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await axios.get(`${API_BASE}/dealer/product-catalogue`, {
      headers: { Accept: "application/json", "System-Key": SYSTEM_KEY },
    });

    return NextResponse.json({ success: true, data: res.data.data });
  } catch (error) {
    console.error("Error fetching product catalogue:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product catalogue" }, { status: 500 });
  }
}
