import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const all = searchParams.get("all");

    const res = await axios.get(`${API_BASE}/flash-deals`, {
      headers: { Accept: "application/json", "System-Key": SYSTEM_KEY },
    });

    const flashDeals = res.data.data;

    // Return all deals (used by camping offer section)
    if (all === "true") {
      return NextResponse.json({ success: true, data: flashDeals });
    }

    let flashSaleData;

    if (slug) {
      flashSaleData = flashDeals.find((deal: { slug: string, [key: string]: unknown }) => deal.slug === slug);
    }

    // Default to the first one if no slug provided or slug not found
    if (!flashSaleData) {
      flashSaleData = flashDeals[0];
    }

    const banner = flashSaleData.banner;
    const products = flashSaleData.products.data;
    const title = flashSaleData.title;
    const date = flashSaleData.date;
    const subtitle = flashSaleData.subtitle;

    return NextResponse.json({ success: true, banner, products, title, date, subtitle });
  } catch (error) {
    console.error("Error fetching Flash Sale data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch flash sale data" }, { status: 500 });
  }
}

