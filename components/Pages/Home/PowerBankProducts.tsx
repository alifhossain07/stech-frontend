"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

// ⭐ Skeleton Components Added
const BannerSkeleton = () => (
  <div className="w-full h-[300px] md:h-[500px] xl:h-full rounded-xl bg-gray-200 animate-pulse" />
);

const ProductCardSkeleton = () => (
  <div className="relative w-full max-w-[300px] h-full flex flex-col justify-between rounded-lg shadow-md border border-gray-200 animate-pulse">
    <div className="relative flex items-center justify-center bg-gray-100 md:p-10 p-6 rounded-md aspect-square" />

    <div className="p-3 w-full">
      <div className="w-full h-4 bg-gray-200 rounded mb-3" />
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-3" />

      <div className="w-full h-10 bg-gray-200 rounded mb-3" />
      <div className="w-1/2 h-4 bg-gray-200 rounded mb-3" />

      <div className="w-full h-8 bg-gray-200 rounded mt-4" />
    </div>
  </div>
);

type ProductType = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  featured_specs: {
    text: string;
    icon: string;
  }[]; // ⭐ NEW
};
type CategoryType = {
  id: number;
  name: string;
  slug: string;
};
type PowerBankResponse = {
  title: string;
  subtitle: string;
  link: string;
  banner: string;
  cover_image: string;
  products: ProductType[];
};

const PowerBankProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [title, setTitle] = useState<string>("Powerbank Products");
  const [subtitle, setSubtitle] = useState<string>(
    "Discover Our Latest Arrivals Designed to Inspire and Impress"
  );
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPowerBanks = async () => {
      try {
        const [powerBankRes, categoriesRes] = await Promise.all([
          axios.get<PowerBankResponse>("/api/products/powerbanks"),
          axios.get("/api/categories"),
        ]);

        const pbData = powerBankRes.data;
        setProducts(pbData.products);
        setBanner(pbData.banner);
        setCoverImage(pbData.cover_image);
        setTitle(pbData.title || "Powerbank Products");
        setSubtitle(
          pbData.subtitle ||
          "Discover Our Latest Arrivals Designed to Inspire and Impress"
        );
        setLink(pbData.link || null);

        const allCategories: CategoryType[] = categoriesRes.data.categories ?? [];

        // Robust category matching with aliases and normalization
        const normalize = (s?: string) => (s || "").toLowerCase().replace(/\s|-/g, "");
        const aliases = [
          "power bank",
          "powerbank",
          "power banks",
          "power-banks",
          "powerbanks",
        ].map(normalize);

        const match = allCategories.find((c) => {
          const n = normalize(c.name);
          return aliases.some((a) => n === a || n.includes(a));
        });

        if (match?.slug) {
          setCategorySlug(match.slug);
        }
      } catch (err) {
        console.error("Error fetching power bank products or categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerBanks();
  }, []);

  return (
    <div className="md:w-11/12 w-11/12 pb-[56px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            {title}
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <Link
          href={link || (categorySlug ? `/products/${categorySlug}` : "#")}
          className="bg-black hidden md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap"
        >
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </Link>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row gap-4">
        {/* LEFT: Dynamic Banner Image */}
        <div className="xl:w-3/12 2xl:w-3/12 flex justify-center items-center">
          <div className="w-full h-auto md:h-full">

            {/* ⭐ Banner Skeleton */}
            {loading ? (
              <BannerSkeleton />
            ) : link ? (
              <Link href={link} className="block cursor-pointer">
                <Image
                  src={banner || "/images/earbudsimage.png"}
                  alt="Earbuds Banner"
                  width={433}
                  height={928}
                  className="rounded-xl object-contain w-full h-full hidden xl:block"
                />
                <Image
                  src={coverImage || banner || "/images/earbudsimage.png"}
                  alt="Earbuds Banner"
                  width={400}
                  height={600}
                  className="rounded-xl object-contain w-full h-auto block xl:hidden"
                />
              </Link>
            ) : (
              <>
                <Image
                  src={banner || "/images/earbudsimage.png"}
                  alt="Earbuds Banner"
                  width={433}
                  height={928}
                  className="rounded-xl object-contain w-full h-full hidden xl:block"
                />
                <Image
                  src={coverImage || banner || "/images/earbudsimage.png"}
                  alt="Earbuds Banner"
                  width={400}
                  height={600}
                  className="rounded-xl object-cover w-full h-auto block xl:hidden"
                />
              </>
            )}

          </div>
        </div>

        {/* RIGHT: Product Grid */}
        <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-start min-h-[300px]">

          {loading ? (
            <>
              {/* Default / md */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>

              {/* xl */}
              <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>

              {/* 2xl */}
              <div className="hidden 2xl:grid grid-cols-4 gap-4 w-full justify-items-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Default + md */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                {products.slice(0, 10).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* xl */}
              <div className="hidden xl:grid 2xl:hidden grid-cols-4 gap-4 w-full justify-items-center">
                {products.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* 2xl */}
              <div className="hidden 2xl:grid grid-cols-4 gap-4 w-full justify-items-center">
                {products.slice(0, 10).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Mobile See More */}
      <div className="flex items-center justify-center md:hidden pt-[44px]">
        <Link
          href={link || (categorySlug ? `/products/${categorySlug}` : "#")}
          className="bg-black text-xs sm:text-sm md:text-sm flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap"
        >
          See More
          <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default PowerBankProducts;
