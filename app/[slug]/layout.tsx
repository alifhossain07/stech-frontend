// app/[slug]/layout.tsx  (SERVER COMPONENT – no "use client")

import type { Metadata } from "next";
import React from "react";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

type ProductSEO = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_image?: string | null;
  slug?: string | null;
};

type Product = {
  id: number;
  name: string;
  description: string;
  thumbnail_image?: string | null;
  photos?: { path: string }[];
  seo?: ProductSEO | null;
};

// Fetch a single product by slug directly from your main API
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store", // always fresh for SEO
    });

    if (!res.ok) return null;

    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return null;
    }

    return json.data[0] as Product;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product not found | Sannai Technology",
      description: "The requested product could not be found.",
    };
  }

  const seo = product.seo ?? {};

  const title = seo.meta_title || product.name;

  // Strip HTML from description and clamp length
  const rawDescription =
    seo.meta_description ||
    (typeof product.description === "string" ? product.description : "");
  const description = rawDescription
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const image =
    seo.meta_image ||
    product.thumbnail_image ||
    product.photos?.[0]?.path ||
    undefined;

  const keywords =
    typeof seo.meta_keywords === "string"
      ? seo.meta_keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined;

  const urlSlug = seo.slug || params.slug;
  const siteUrl = "https://sannai.com.bd"; // <-- change to your real domain
  const url = `${siteUrl}/${urlSlug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Standard layout wrapper – keeps your existing client page working
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}