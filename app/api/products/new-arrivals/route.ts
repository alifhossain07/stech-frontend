// app/api/products/new-arrivals/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// ⭐ Updated LaravelProduct type to include featured_specs
type LaravelProduct = {
  id: number;
  slug: string;
  name: string;
  main_price: string;
  stroked_price: string;
  discount: string;
  rating: number;
  sales: number;
  thumbnail_image: string;
  featured_specs: {
    text: string;
    icon: string;
  }[];
};

export async function GET() {
  try {
    const url = `${process.env.API_BASE}/products/new-arrivals`;

    const res = await axios.get(url, {
      headers: {
        "System-Key": process.env.SYSTEM_KEY!,
      },
    });

    const products: LaravelProduct[] = res.data?.data ?? [];

    const formatted = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,

      price: Number(p.main_price.replace(/[^\d.]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[^\d.]/g, "")),
      discount: p.discount,

      rating: p.rating,
      reviews: p.sales,

      image: p.thumbnail_image || "/images/placeholder.png",

      // ⭐ Include featured_specs
      featured_specs: p.featured_specs || [],
    }));

    return NextResponse.json(formatted);
  } catch (e) {
    console.error("New arrivals API error:", e);
    return NextResponse.json(
      { error: "Unable to load new arrival products" },
      { status: 500 }
    );
  }
}
