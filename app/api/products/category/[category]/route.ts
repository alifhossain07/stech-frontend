// app/api/products/[category]/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;      // "http://sannai.test/api/v2"
const SYSTEM_KEY = process.env.SYSTEM_KEY!;  // if your backend needs it
type ProductApi = {
  id: number | string;
  name: string;
  slug: string;
  main_price: string | number | null;
  stroked_price: string | number | null;
  discount?: string | number | null;
  rating?: string | number | null;
  sales?: string | number | null;
  thumbnail_image: string;
  featured_specs?: unknown[];
};
export async function GET(
  _req: Request,
  { params }: { params: { category: string } }
) {
  const { category } = params; // e.g. "fast-charger-bvtzw"

  try {
    const backendRes = await fetch(
      `${API_BASE}/products/category/${category}`,
      {
        headers: {
          Accept: "application/json",
          "System-Key": SYSTEM_KEY,
        },
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.error("Backend category products error:", backendRes.status);
      return NextResponse.json(
        { success: false, error: "Failed to load category products" },
        { status: 500 }
      );
    }

    const backendJson = await backendRes.json();

    const productsRaw: ProductApi[] = backendJson.data ?? [];
    const meta = backendJson.meta ?? {};

    const products = productsRaw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(String(p.main_price).replace(/[^\d.]/g, "") || 0),
      oldPrice: Number(String(p.stroked_price).replace(/[^\d.]/g, "") || 0),
      discount: String(p.discount ?? ""),
      rating: String(p.rating ?? 0),
      reviews: String(p.sales ?? 0),
      image: p.thumbnail_image,
      featured_specs: p.featured_specs ?? [],
    }));

    return NextResponse.json({
      success: true,
      title: "",       // backend doesn’t send category name in your sample
      subtitle: "",
      total: meta.total ?? products.length,
      products,
    });
  } catch (error) {
    console.error("Category products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load category products" },
      { status: 500 }
    );
  }
}