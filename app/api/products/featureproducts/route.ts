import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// Backend product type
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
  featured_specs: { text: string; icon: string }[];
}

// Backend response type
interface ApiResponse {
  data: ApiProduct[];
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/products/featured`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    const json: ApiResponse = await res.json();
    const apiProducts = json.data || [];

    const products = apiProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.main_price.replace(/[^\d.]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[^\d.]/g, "")),
      discount: p.discount || "-0%",
      rating: p.rating,
      reviews: p.sales,
      image: p.thumbnail_image,
      featured_specs: p.featured_specs || [],
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
