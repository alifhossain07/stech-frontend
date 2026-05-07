import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await axios.get(`${API_BASE}/flash-deals`, {
      headers: { Accept: "application/json", "System-Key": SYSTEM_KEY },
    });

    // Filter out the home page flash deal
    const filteredDeals = res.data.data.filter((deal: { home_page: string }) => deal.home_page !== "1");

    // Return the filtered data array
    return NextResponse.json({ success: true, data: filteredDeals });
  } catch (error) {
    console.error("Error fetching all Flash Deals data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch flash deals data" }, { status: 500 });
  }
}
