import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// API product type from backend
interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  thumbnail_image: string;
  has_discount: boolean;
  discount: string;
  stroked_price: string;
  main_price: string;
  rating: number;
  sales: number;
}

// Response type from backend
interface ApiResponse {
  data: ApiProduct[];
}

export async function GET() {
  try {
    // Call backend featured products API
    const res = await fetch(`${API_BASE}/products/featured`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    const json: ApiResponse = await res.json();

    const apiProducts: ApiProduct[] = json.data || [];

    // Map into your frontend Product interface
    const products = apiProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.main_price.replace(/[৳,]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[৳,]/g, "")),
      discount: p.discount || "-0%",
      rating: p.rating?.toString() ?? "0",
      reviews: p.sales?.toString() ?? "0",
      image: p.thumbnail_image,
      slug: p.slug,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Featured Products API error:", error);
    return NextResponse.json(
      { error: "Failed to load featured products" },
      { status: 500 }
    );
  }
}
