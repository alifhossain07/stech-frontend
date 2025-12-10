import { NextResponse } from "next/server";

interface LaravelProduct {
  id: number;
  slug: string;
  name: string;
  main_price: string;
  stroked_price: string;
  discount: string;
  rating: number;
  sales: number;
  thumbnail_image: string | null;
  featured_specs?: { text: string }[];
}

export async function GET() {
  try {
    const url = `${process.env.API_BASE}/products/new-arrivals`;

    const res = await fetch(url, {
      headers: {
        "System-Key": process.env.SYSTEM_KEY!,
        Accept: "application/json",
      },
      cache: "no-cache",
      redirect: "follow",
    });

    const json = await res.json();

    const products = (json.data as LaravelProduct[]).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.main_price.replace(/[^\d.]/g, "")),
      oldPrice: Number(p.stroked_price.replace(/[^\d.]/g, "")),
      discount: p.discount,
      rating: p.rating,
      reviews: p.sales,
      image: p.thumbnail_image ?? "/images/placeholder.png",
      featured_specs: p.featured_specs ?? [],
    }));

    return NextResponse.json(products);
  } catch (err) {
    console.error("New arrivals API error:", err);
    return NextResponse.json(
      { error: "Unable to load products" },
      { status: 500 }
    );
  }
}
