import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          data: [],
          meta: null,
          success: false,
        },
        { status: 500 }
      );
    }

    // Use the same base convention as other routes (API_BASE already includes any version prefix)
    const res = await fetch(`${API_BASE}/reviews/product/${slug}`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Backend API returned ${res.status}`,
          data: [],
          meta: null,
          success: false,
        },
        { status: res.status }
      );
    }

    const json = await res.json();

    if (!json.success) {
      return NextResponse.json(
        { error: "Failed to fetch reviews", data: [], meta: null },
        { status: json.status || 500 }
      );
    }

    // Return the full response with data, links, and meta
    return NextResponse.json({
      data: json.data || [],
      links: json.links || null,
      meta: json.meta || null,
      success: json.success,
    });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json(
      {
        error: "Failed to load reviews",
        data: [],
        meta: null,
        success: false,
      },
      { status: 500 }
    );
  }
}

