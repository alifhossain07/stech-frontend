import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!; // e.g. "http://sannai.test/api/v2"
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

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
  featured_specs?: { text: string; icon: string }[] | null;
  current_stock?: number;
  product_compatible?: string[] | null;
};

type SuggestionApi = unknown;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const isSuggest = searchParams.get("suggest") === "1";

  if (isSuggest) {
    // ---------- SUGGESTION MODE ----------
    const queryKey = searchParams.get("query_key") || "";
    const type = searchParams.get("type") || ""; // product | brands | etc.

    if (!queryKey.trim()) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      });
    }

    try {
      const backendRes = await fetch(
        `${API_BASE}/get-search-suggestions?query_key=${encodeURIComponent(
          queryKey
        )}${type ? `&type=${encodeURIComponent(type)}` : ""}`,
        {
          headers: {
            Accept: "application/json",
            "System-Key": SYSTEM_KEY,
          },
          cache: "no-store",
        }
      );

      if (!backendRes.ok) {
        console.error(
          "Backend search suggestions error:",
          backendRes.status
        );
        return NextResponse.json(
          { success: false, error: "Failed to load search suggestions" },
          { status: 500 }
        );
      }

      const backendJson: SuggestionApi = await backendRes.json();

      return NextResponse.json({
        success: true,
        data: backendJson,
      });
    } catch (error) {
      console.error("Search suggestions API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to load search suggestions" },
        { status: 500 }
      );
    }
  }

  // ---------- NORMAL PRODUCT SEARCH MODE ----------
  const name = searchParams.get("name") || "";

  if (!name.trim()) {
    return NextResponse.json({
      success: true,
      title: "All Products",
      subtitle: "",
      total: 0,
      products: [],
    });
  }

  // Mirror Laravel search parameters
  const categories = searchParams.get("categories") || ""; // "1,2,3"
  const brands = searchParams.get("brands") || "";         // "10,11"
  const min = searchParams.get("min") || "";               // min price
  const max = searchParams.get("max") || "";               // max price
  const sort_key = searchParams.get("sort_key") || "";     // price_low_to_high, etc.
  const digital = searchParams.get("digital") || "";       // "1" or "0"

  // Build query string for backend
  const backendUrl = new URL(`${API_BASE}/products/search`);
  backendUrl.searchParams.set("name", name);
  if (categories) backendUrl.searchParams.set("categories", categories);
  if (brands) backendUrl.searchParams.set("brands", brands);
  if (min) backendUrl.searchParams.set("min", min);
  if (max) backendUrl.searchParams.set("max", max);
  if (sort_key) backendUrl.searchParams.set("sort_key", sort_key);
  if (digital) backendUrl.searchParams.set("digital", digital);

  try {
    const backendRes = await fetch(backendUrl.toString(), {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      console.error("Backend search products error:", backendRes.status);
      return NextResponse.json(
        { success: false, error: "Failed to load search products" },
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
      current_stock: Number(p.current_stock ?? 0),
      product_compatible: p.product_compatible ?? [],
    }));

    return NextResponse.json({
      success: true,
      title: `Search results for "${name}"`,
      subtitle:
        products.length === 0
          ? "No products found. Please try another keyword."
          : "",
      total: meta.total ?? products.length,
      products,
    });
  } catch (error) {
    console.error("Search products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load search products" },
      { status: 500 }
    );
  }
}