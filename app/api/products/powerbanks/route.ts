import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// API product type
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

// Response type for the category
interface ApiCategory {
  banner: string;
  products: {
    data: ApiProduct[];
  };
}

export async function GET() {
  try {
    // Call Laravel API
    const res = await fetch(`${API_BASE}/categories/home2`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-cache",
    });

    const json = await res.json();

    if (!json.data || json.data.length === 0) {
      return NextResponse.json([]);
    }

    const earbudsCategory: ApiCategory = json.data[0];

    const banner = earbudsCategory.banner;

    const apiProducts: ApiProduct[] = earbudsCategory.products?.data || [];

    // Map into your frontend ProductType
    const products = apiProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.main_price.replace(/[৳,]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[৳,]/g, "")),
      discount: p.discount,
      rating: p.rating?.toString() ?? "0",
      reviews: p.sales?.toString() ?? "0",
      image: p.thumbnail_image,
      banner,
    }));

    return NextResponse.json({
      banner,
      products,
    });
  } catch (error) {
    console.error("Earbuds API error:", error);
    return NextResponse.json(
      { error: "Failed to load earbuds" },
      { status: 500 }
    );
  }
}
