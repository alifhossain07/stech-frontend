import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;



export async function GET() {
  try {
 
    // Do both API calls at the same time
    const [categoriesRes, featuredRes] = await Promise.all([
      fetch(`${API_BASE}/categories`, {
        headers: {
          Accept: "application/json",
          "System-Key": SYSTEM_KEY,
        },
        cache: "no-store",
      }),
      fetch(`${API_BASE}/categories/featured`, {
        headers: {
          Accept: "application/json",
          "System-Key": SYSTEM_KEY,
        },
        cache: "no-store",
      }),
    ]);

    const categoriesJson = await categoriesRes.json();
    const featuredJson = await featuredRes.json();

    return NextResponse.json({
      success: true,
      categories: categoriesJson?.data ?? [],
      featuredCategories: featuredJson?.data ?? [],
    });

  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
