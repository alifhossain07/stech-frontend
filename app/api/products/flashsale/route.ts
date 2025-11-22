import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const res = await axios.get(`${API_BASE}/flash-deals`, {
      headers: { Accept: "application/json", "System-Key": SYSTEM_KEY },
    });

    const flashSaleData = res.data.data[0]; // Take the first flash sale
    const banner = flashSaleData.banner;
    const products = flashSaleData.products.data;
    const title = flashSaleData.title;
    const date = flashSaleData.date;

    return NextResponse.json({ success: true, banner, products, title, date });
  } catch (error) {
    console.error("Error fetching Flash Sale data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch flash sale data" }, { status: 500 });
  }
}
