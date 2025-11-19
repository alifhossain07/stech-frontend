import { NextResponse } from "next/server";

// Get API base URL and System Key from environment variables
const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    // Fetch home bottom SEO data from the API
    const seoRes = await fetch(`${API_BASE}/home-bottom-seo`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const seoJson = await seoRes.json(); // Parse the JSON response

    return NextResponse.json({
      success: true,
      title: seoJson?.data?.title ?? "",  // Extract title
      description: seoJson?.data?.description ?? "", // Extract description
    });
  } catch (error) {
    console.error("Home Bottom SEO API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load home bottom SEO data" },
      { status: 500 }
    );
  }
}
