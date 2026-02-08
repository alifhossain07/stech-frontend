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
  featured_specs: {
    text: string;
    icon: string;
  }[];
}

// Response type for the category
interface ApiCategory {
  banner: string;
  cover_image: string;
  title: string;
  subtitle: string;
  link: string;
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

    // Get the category (here first item)
    const category: ApiCategory = json.data[1];

    const { banner, cover_image, title, subtitle, link } = category;
    const apiProducts: ApiProduct[] = category.products?.data || [];

    // Map products to frontend format
    const products = apiProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.main_price.replace(/[৳,]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[৳,]/g, "")),
      discount: p.discount,
      rating: p.rating?.toString() ?? "0",
      reviews: p.sales?.toString() ?? "0",
      image: p.thumbnail_image,
      banner,
      featured_specs: p.featured_specs || [],
    }));

    // Return category info + products
    return NextResponse.json({
      title,      // Category title
      subtitle,   // Category subtitle
      link,       // Category link
      banner,
      cover_image,
      products,
    });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { error: "Failed to load category" },
      { status: 500 }
    );
  }
}
