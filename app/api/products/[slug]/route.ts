import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const res = await fetch(`${API_BASE}/products/${slug}`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the full data object
    return NextResponse.json(json.data[0]);
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
