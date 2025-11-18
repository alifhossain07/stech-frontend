import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;



export async function GET() {
  try {
 
    // DEBUG 1 — Check ENV loaded
    // console.log("API_BASE =", API_BASE);
    // console.log("SYSTEM_KEY =", SYSTEM_KEY);

    // // DEBUG 2 — Check simple fetch first
    // console.log("Trying to call:", `${API_BASE}/categories`);

    // try {
    //   const test = await fetch(`${API_BASE}/categories`, {
    //     headers: {
    //       Accept: "application/json",
    //       "System-Key": SYSTEM_KEY,
    //     }
    //   });

    //   console.log("STATUS:", test.status);

    //   const tjson = await test.text();
    //   console.log("RAW RESPONSE:", tjson); // Very useful
    // } catch (e) {
    //   console.log("FETCH ERROR:", e);
    // }
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
