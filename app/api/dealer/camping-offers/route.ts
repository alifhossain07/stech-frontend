import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET(_req: Request) {
  try {
    const { searchParams } = new URL(_req.url);
    const slug = searchParams.get("slug");

    const res = await axios.get(`${API_BASE}/dealer/home/camping-offers`, {
      headers: { 
        Accept: "application/json", 
        "System-Key": SYSTEM_KEY 
      },
    });

    if (slug && res.data.success && Array.isArray(res.data.data)) {
      const offer = res.data.data.find((o: { slug: string }) => o.slug === slug);
      if (offer) {
        return NextResponse.json({ success: true, data: offer });
      } else {
        return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 });
      }
    }

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
    console.error("Error fetching Dealer Camping Offers:", axiosError?.response?.data || axiosError.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch camping offers" },
      { status: axiosError?.response?.status || 500 }
    );
  }
}
