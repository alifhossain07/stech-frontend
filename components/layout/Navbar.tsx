"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  FiChevronDown,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiGift,
  FiMenu,
  FiX,
  FiHome,
  FiChevronRight,
} from "react-icons/fi";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import CartSidebar from "./CartSidebar";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

// ------------------ TYPES ------------------
// type Subcategory = {
//   name: string;
//   children: string[];
// };

// type NavbarCategoryAPI = {
//   id: number;
//   name: string;
//   slug: string;
//   banner?: string;
// };

type APICategory = {
  id: number;
  name: string;
  slug: string;
  banner: string;
  cover_image: string;
  icon: string;
  children: APICategory[];
};

type SuggestionItem = {
  name?: string;
  title?: string;
  query?: string;
  slug?: string;
  image?: string | null;
  thumbnail?: string | null;
  cover_image?: string | null;
  thumbnail_image?: string | null;
  photo?: string | null;
  photos?: Array<{ path?: string }>;
  price?: number | string | null;
  sale_price?: number | string | null;
  offer_price?: number | string | null;
  main_price?: number | string | null;
  stroked_price?: number | string | null;
  meta?: {
    price?: number | string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  banner?: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
    banner?: string;
    children: {
      id: number;
      name: string;
      slug: string;
      banner?: string;
    }[];
  }[];
};

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [helplineNumber, setHelplineNumber] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const { cart, cartOpen, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  // let suggestTimeout: NodeJS.Timeout;
  const suggestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDesktopLogout, setShowDesktopLogout] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const handleCloseMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMenuOpen(false);
    }, 300);
  };

  // ✅ REAL CATEGORIES (ONLY THOSE WITH DROPDOWNS)
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ SIMPLE LINKS (NOT CATEGORIES)
  const simplePages = [
    { name: "About Us", href: "/about" },
    { name: "Our Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
    { name: "Authentication", href: "/auth" },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/navbarCategories", { cache: "no-store" });
        const json = await res.json();

        const apiCategories: APICategory[] = json.data || [];

        const formatted: Category[] = apiCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          banner: cat.banner,
          subcategories: (cat.children || []).map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            banner: sub.banner,
            children: (sub.children || []).map((child) => ({
              id: child.id,
              name: child.name,
              slug: child.slug,
              banner: child.banner,
            })),
          })),
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Navbar category error:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
  async function fetchHelpline() {
    try {
      const res = await fetch("/api/footer", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data?.helpline_number) {
        setHelplineNumber(String(json.data.helpline_number));
      }
    } catch (err) {
      console.error("Failed to fetch helpline number:", err);
    }
  }

  fetchHelpline();
}, []);

  const handleSearchSubmit = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return;
  // Close suggestions and clear search
  setShowSuggestions(false);
  setSuggestions([]);
 
  setShowMobileSearch(false);
  // Navigate to search page
  router.push(`/products/search?q=${encodeURIComponent(trimmed)}`);
};

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/header", { cache: "no-store" });
        const json = await res.json();
        // Expecting shape: { data: { url: string, ... }, success: true, status: 200 }
        const url = json?.data?.url as string | undefined;
        if (url) {
          setLogoUrl(url);
        } else {
          console.error("Logo URL missing in /api/header response", json);
        }
      } catch (err) {
        console.error("Failed to fetch header logo:", err);
      }
    }

    fetchLogo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setHoveredCategory(null);
        setHoveredSubcategory(null);
        setExpandedCategory(null);
        setExpandedSubcategory(null);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDesktopLogout(false);
      }
      // Add desktop search suggestions close logic
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        showMobileSearch &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    toast.success("Successfully logged out");
  };


  return (
    <>
      {/* ========= HEADER ========= */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* TOP BAR */}
        <div className="py-1 hidden xl:block border-b border-gray-100 bg-black text-white">
          <div className="w-11/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Contact Us :</span>
              <a
    href={`tel:${helplineNumber || "+88 01319553399"}`}
    className="underline hover:text-yellow-300"
  >
    {helplineNumber || "+88 01319553399"}
  </a>
            </div>

            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-lg" />
              <span>Store Locations</span>
            </div>
          </div>
        </div>

        {/* MIDDLE LOGO + SEARCH */}
        <div className="w-11/12 mx-auto py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex justify-between w-full md:w-full lg:w-auto items-center">
            <button className="text-2xl text-orange-500 lg:hidden" onClick={() => setMenuOpen(true)}>
              <FiMenu />
            </button>
            <Link href="/">
              <Image
                src={logoUrl || "/images/sannailogo.png"}
                width={120}
                height={120}
                alt="Logo"
              />
            </Link>

            <div className="flex lg:hidden items-center text-orange-500 gap-4">
              {/* SEARCH ICON */}
              <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <IoSearch className="text-3xl" />
              </button>

             {/* CART ICON */}
<button onClick={() => setCartOpen(true)} className="relative">
  <IoCartOutline className="text-3xl" />
  {cart.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] leading-none px-1 py-1 rounded-full border border-white">
      {cart.length.toString().padStart(2, "0")}
    </span>
  )}
</button>
            </div>


          </div>


          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* SEARCH */}
            <div ref={desktopSearchRef} className="relative w-full md:w-96 2xl:w-[550px] mr-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (suggestTimeoutRef.current) {
                    clearTimeout(suggestTimeoutRef.current);
                  }

                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setIsSuggestLoading(false);
                    return;
                  }

                  setIsSuggestLoading(true);
                  suggestTimeoutRef.current = setTimeout(async () => {
                    try {
                      const res = await fetch(
                        `/api/products/search?suggest=1&query_key=${encodeURIComponent(
                          value
                        )}&type=product`
                      );
                      const json = await res.json();

                      // 🔍 DEBUG: Log the Next.js API response
                      console.log("=== NEXT.JS API RESPONSE (Desktop) ===");
                      console.log("Full response:", json);
                      console.log("Response structure:", {
                        hasData: !!json.data,
                        dataType: typeof json.data,
                        isDataArray: Array.isArray(json.data),
                        dataKeys: json.data && typeof json.data === 'object' ? Object.keys(json.data) : null
                      });
                      console.log("========================================");

                      let items: SuggestionItem[] = [];
                      if (Array.isArray(json.data)) {
                        items = json.data;
                        console.log("✅ Using json.data (array), count:", items.length);
                      } else if (json.data && Array.isArray(json.data.items)) {
                        items = json.data.items;
                        console.log("✅ Using json.data.items, count:", items.length);
                      } else if (json.data && Array.isArray(json.data.suggestions)) {
                        items = json.data.suggestions;
                        console.log("✅ Using json.data.suggestions, count:", items.length);
                      } else if (json.data && Array.isArray(json.data.data)) {
                        items = json.data.data;
                        console.log("✅ Using json.data.data, count:", items.length);
                      } else if (json.data && Array.isArray(json.data.products)) {
                        items = json.data.products;
                        console.log("✅ Using json.data.products, count:", items.length);
                      } else {
                        console.warn("⚠️ No suggestions array found in response structure");
                        console.log("Available paths checked:", [
                          "json.data",
                          "json.data.items",
                          "json.data.suggestions",
                          "json.data.data",
                          "json.data.products"
                        ]);
                      }

                      // Log first item structure before normalization
                      if (items.length > 0) {
                        console.log("=== FIRST ITEM (Before Normalization) ===");
                        console.log("Item keys:", Object.keys(items[0]));
                        console.log("Item:", JSON.stringify(items[0], null, 2));
                        console.log("==========================================");
                      }

                      // Normalize items to ensure consistent structure
                      items = items.map((item: SuggestionItem) => ({
                        ...item,
                        // Ensure we have name/title
                        name: item.name || item.title || item.query || "",
                        // Normalize image field
                        image: item.image || item.thumbnail || item.cover_image || item.thumbnail_image || item.photo || (item.photos?.[0]?.path) || null,
                        // Normalize price field
                        price: item.price || item.sale_price || item.offer_price || item.main_price || item.stroked_price || (item.meta?.price) || null,
                      }));

                      // Log first item after normalization
                      if (items.length > 0) {
                        console.log("=== FIRST ITEM (After Normalization) ===");
                        console.log("Normalized item:", {
                          name: items[0].name,
                          image: items[0].image,
                          price: items[0].price,
                          slug: items[0].slug
                        });
                        console.log("==========================================");
                      }

                      setSuggestions(items);
                      setShowSuggestions(items.length > 0);
                    } catch (err) {
                      console.error("Desktop suggestion fetch error:", err);
                    } finally {
                      setIsSuggestLoading(false);
                    }
                  }, 300);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(searchTerm);
                  }
                }}
                placeholder="Search your Favourite Accessories."
                className="w-full text-white bg-black border border-black rounded-full py-2 px-4"
              />
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-2">
                {isSuggestLoading && (
                  <div className="w-6 h-6 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit(searchTerm)}
                  className="bg-orange-500 text-white p-2 rounded-full"
                >
                  <FiSearch />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                  {suggestions.map((item: SuggestionItem, idx: number) => {
                    const label = item.name || item.title || item.query || "";
                    const slug = item.slug;
                    const image = 
                      item.image || 
                      item.thumbnail || 
                      item.cover_image || 
                      item.thumbnail_image ||
                      item.photo ||
                      item.photos?.[0]?.path ||
                      null;
                    const price =
                      item.price ||
                      item.sale_price ||
                      item.offer_price ||
                      item.main_price ||
                      item.stroked_price ||
                      (item.meta && item.meta.price) ||
                      null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (slug) {
                            setShowSuggestions(false);
                            setSuggestions([]);
                            setSearchTerm("");
                            router.push(`/${slug}`);
                          } else if (label) {
                            setSearchTerm(label);
                            handleSearchSubmit(label);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b-2 border-gray-200' : ''}`}
                      >
                        {image && image !== "" && (
                          <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                            <Image
                              src={image}
                              alt={label}
                              fill
                              sizes="48px"
                              className="object-contain"
                              onError={(e) => {
                                // Hide image on error
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col items-start min-w-0">
                          <span className="text-gray-800 line-clamp-1 font-medium">{label}</span>
                          {price !== null && price !== undefined && price !== "" && (
                            <span className="text-xs text-orange-600 font-semibold mt-0.5">
                              ৳{typeof price === 'number' ? price : String(price).replace(/[^\d.]/g, '') || price}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {isSuggestLoading && (
                    <div className="px-3 py-2 text-xs text-gray-500">Loading…</div>
                  )}
                </div>
              )}
            </div>

            <Link href="/offers"
              className="flex items-center gap-1 text-white px-5 mr-5 py-2 rounded-xl text-sm"
              style={{ background: "linear-gradient(to bottom, #FFD522, #FF6B01)" }}
            >
              <FiGift className="text-base mr-1 animate-pulseScaleColor" /> Offers
            </Link>

            {/* LANGUAGE DROPDOWN */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="border border-gray-400 px-5 py-2 h-[46px] flex items-center gap-2 rounded-md bg-white"
              >
                <span className="underline">English</span>
                <FiChevronDown className="text-black text-2xl" />
              </button>

              <div
                className={`absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50 transition-all ${open ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Bangla</button>
              </div>
            </div>

            {/* CART */}

          <button onClick={() => setCartOpen(true)} className="border border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-3 text-sm">
              <FiShoppingCart className="text-2xl" />
              <div>
                <h1 className="text-base">Cart</h1>
                <span className="text-xs mt-2">*{cart.length.toString().padStart(2, "0")} Items</span>
              </div>
            </button>


            {/* PROFILE / AUTH */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className="border border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-2 text-sm bg-white"
                  onClick={() => setShowDesktopLogout(prev => !prev)}
                >
                  <FiUser className="text-2xl" />
                  <div className="text-left">
                    <h1 className="text-base">Hi, {user.name.split(" ")[0]}</h1>
                    <p className="text-xs text-gray-500">
                      {user.phone || user.email || "Customer"}
                    </p>
                  </div>
                </button>

                {showDesktopLogout && (
                  <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg transform origin-top animate-[fadeInDown_0.18s_ease-out] overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setShowDesktopLogout(false)}
                      className="block w-full text-sm text-gray-700 px-3 py-2 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="block w-full text-sm text-red-500 px-3 py-2 hover:bg-red-50 transition border-t border-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="border border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-1 text-sm">
                <Link href="/login" className="flex items-center gap-2">
                  <FiUser className="text-2xl" />
                  <div>
                    <h1 className="text-base">Login</h1>

                  </div>
                </Link>
              </button>
            )}
          </div>
        </div>


        {/* ========= DESKTOP NAV ========= */}
        <div className="bg-orange-500 hidden lg:block">
          <div className="w-11/12 mx-auto flex justify-between items-center h-10">
            <ul className="flex gap-6 text-white text-sm">
              {/* CATEGORIES WITH DROPDOWNS */}
              {categories.map((category, i) => (
                <li
                  key={i}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => {
                    setHoveredCategory(null);
                    setHoveredSubcategory(null);
                  }}
                >
                  <div
                    className="flex items-center gap-1 hover:text-gray-300"
                    onClick={() => router.push(`/products/${category.slug}`)}
                  >
                    {category.name}
                    {category.subcategories.length > 0 && <FiChevronDown className="text-white text-sm" />}
                  </div>

                  {/* FIRST LEVEL DROPDOWN */}
                  {category.subcategories.length > 0 && (
                    <div
                      className={`absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg transition-all ${hoveredCategory === category.name
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                        }`}
                    >
                      <ul className="min-w-[180px] py-2 relative">
                        {category.subcategories.map((sub) => (
                          <li
                            key={sub.id}
                            className="px-4 py-2 hover:bg-gray-100 text-sm flex justify-between items-center"
                            onMouseEnter={() => setHoveredSubcategory(sub.name)}
                            onMouseLeave={() => setHoveredSubcategory(null)}
                          >
                            {sub.name}

                            {sub.children?.length > 0 && <FiChevronRight className="text-gray-500 text-xs" />}

                            {/* SECOND LEVEL DROPDOWN */}
                            {sub.children?.length > 0 && (
                              <div
                                className={`absolute left-full top-3 ml-1 bg-white rounded-md shadow-lg transition-all ${hoveredSubcategory === sub.name ? "opacity-100 visible" : "opacity-0 invisible"
                                  }`}
                              >
                                <ul className="min-w-[160px] py-2">
                                  {sub.children?.map((child) => (
                                    <li key={child.id} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                      {child.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}

                      </ul>
                    </div>
                  )}
                </li>
              ))}

              {/* ⭐ SIMPLE LINKS (NO DROPDOWNS) */}
              {simplePages.map((page, i) => (
                <li key={i}>
                  <Link href={page.href} className="hover:text-gray-200">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      {showMobileSearch && (
  <div
    ref={searchRef}
    className="fixed top-[70px] left-0 w-full z-40 lg:hidden animate-[fadeDown_0.25s_ease-out]"
  >
    <div className="relative w-full ">
      <input
        type="text"
        value={mobileSearchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setMobileSearchTerm(value);

          if (suggestTimeoutRef.current) {
            clearTimeout(suggestTimeoutRef.current);
          }

          if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsSuggestLoading(false);
            return;
          }

          setIsSuggestLoading(true);
          suggestTimeoutRef.current = setTimeout(async () => {
            try {
              const res = await fetch(
                `/api/products/search?suggest=1&query_key=${encodeURIComponent(
                  value
                )}&type=product`
              );
              const json = await res.json();

              // 🔍 DEBUG: Log the Next.js API response
              console.log("=== NEXT.JS API RESPONSE (Mobile) ===");
              console.log("Full response:", json);
              console.log("Response structure:", {
                hasData: !!json.data,
                dataType: typeof json.data,
                isDataArray: Array.isArray(json.data),
                dataKeys: json.data && typeof json.data === 'object' ? Object.keys(json.data) : null
              });
              console.log("========================================");

              let items:SuggestionItem[] = [];
              if (Array.isArray(json.data)) {
                items = json.data;
                console.log("✅ Using json.data (array), count:", items.length);
              } else if (json.data && Array.isArray(json.data.items)) {
                items = json.data.items;
                console.log("✅ Using json.data.items, count:", items.length);
              } else if (json.data && Array.isArray(json.data.suggestions)) {
                items = json.data.suggestions;
                console.log("✅ Using json.data.suggestions, count:", items.length);
              } else if (json.data && Array.isArray(json.data.data)) {
                items = json.data.data;
                console.log("✅ Using json.data.data, count:", items.length);
              } else if (json.data && Array.isArray(json.data.products)) {
                items = json.data.products;
                console.log("✅ Using json.data.products, count:", items.length);
              } else {
                console.warn("⚠️ No suggestions array found in response structure");
                console.log("Available paths checked:", [
                  "json.data",
                  "json.data.items",
                  "json.data.suggestions",
                  "json.data.data",
                  "json.data.products"
                ]);
              }

              // Log first item structure before normalization
              if (items.length > 0) {
                console.log("=== FIRST ITEM (Before Normalization - Mobile) ===");
                console.log("Item keys:", Object.keys(items[0]));
                console.log("Item:", JSON.stringify(items[0], null, 2));
                console.log("===================================================");
              }

              // Normalize items to ensure consistent structure
              items = items.map((item: SuggestionItem) => ({
                ...item,
                // Ensure we have name/title
                name: item.name || item.title || item.query || "",
                // Normalize image field
                image: item.image || item.thumbnail || item.cover_image || item.thumbnail_image || item.photo || (item.photos?.[0]?.path) || null,
                // Normalize price field
                price: item.price || item.sale_price || item.offer_price || item.main_price || item.stroked_price || (item.meta?.price) || null,
              }));

              // Log first item after normalization
              if (items.length > 0) {
                console.log("=== FIRST ITEM (After Normalization - Mobile) ===");
                console.log("Normalized item:", {
                  name: items[0].name,
                  image: items[0].image,
                  price: items[0].price,
                  slug: items[0].slug
                });
                console.log("==================================================");
              }

              setSuggestions(items);
              setShowSuggestions(items.length > 0);
            } catch (err) {
              console.error("Mobile suggestion fetch error:", err);
            } finally {
              setIsSuggestLoading(false);
            }
          }, 300);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchSubmit(mobileSearchTerm);
          }
        }}
        placeholder="Search your Favourite Accessories..."
        className="w-full bg-white text-black py-3 px-4 pr-12 rounded-md shadow-lg outline-none caret-black placeholder:text-gray-500"
      />
      {isSuggestLoading && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <div className="w-4 h-4 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 🔥 Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0  bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
          {suggestions.map((item: SuggestionItem, idx: number) => {
            const label = item.name || item.title || item.query || "";
            const slug = item.slug;
            const image = 
              item.image || 
              item.thumbnail || 
              item.cover_image || 
              item.thumbnail_image ||
              item.photo ||
              item.photos?.[0]?.path ||
              null;
            const price =
              item.price ||
              item.sale_price ||
              item.offer_price ||
              item.main_price ||
              item.stroked_price ||
              (item.meta && item.meta.price) ||
              null;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (slug) {
                    router.push(`/${slug}`);
                  } else if (label) {
                    handleSearchSubmit(label);
                  }
                  setShowSuggestions(false);
                  setShowMobileSearch(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {image && image !== "" && (
                  <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                    <Image
                      src={image}
                      alt={label}
                      fill
                      sizes="48px"
                      className="object-contain"
                      onError={(e) => {
                        // Hide image on error
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col items-start min-w-0">
                  <span className="text-gray-800 line-clamp-1 font-medium">{label}</span>
                  {price !== null && price !== undefined && price !== "" && (
                    <span className="text-xs text-orange-600 font-semibold mt-0.5">
                      ৳{typeof price === 'number' ? price : String(price).replace(/[^\d.]/g, '') || price}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {isSuggestLoading && (
            <div className="px-3 py-2 text-xs text-gray-500">Loading…</div>
          )}
        </div>
      )}
    </div>
  </div>
)}


      {/* Prevent overlap */}
      <div className="pt-[70px] xl:pt-[150px]"></div>

      {/* ========= MOBILE BOTTOM NAV ========= */}
      <div className="bg-orange-500 fixed bottom-0 left-0 w-full flex justify-around items-center py-3 text-white lg:hidden z-50">
        <Link href="/" className="flex flex-col items-center text-sm">
          <FiHome className="text-2xl" />
          Home
        </Link>

        <Link href="/offers" className="flex flex-col items-center text-sm">
          <FiGift className="text-2xl" />
          Offers
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center text-sm"
        >
          <span className="relative">
            <FiShoppingCart className="text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] leading-none px-1 py-1 rounded-full border border-white">
                {cart.length.toString().padStart(2, "0")}
              </span>
            )}
          </span>
          Cart
        </button>

        <Link href="/login" className="flex flex-col items-center text-sm">
          <FiUser className="text-2xl" />
          Profile
        </Link>
      </div>

      {/* ========= MOBILE SIDEBAR ========= */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 ${closing ? "opacity-0" : "opacity-100"}`}
            onClick={handleCloseMenu}
          ></div>

          {/* SIDEBAR */}
          <div
            className={`fixed left-0 top-0 w-72 sm:w-80 h-full bg-white shadow-lg z-50 overflow-y-auto ${closing ? "animate-slideOut" : "animate-slideIn"
              }`}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <Image src="/images/sannailogo.png" width={120} height={120} alt="Logo" />
              <button className="text-3xl text-orange-500" onClick={handleCloseMenu}>
                <FiX />
              </button>
            </div>

            <ul ref={submenuRef} className="p-4 space-y-3 text-gray-800">
              <button className="mt-1 w-full py-3 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg text-sm">
                Buy Dealer Products
              </button>

              {/* MOBILE DROPDOWNS */}
              {categories.map((cat, index) => (
                <li key={index}>
                  <button
                    className="flex justify-between w-full items-center py-2 text-left"
                  >
                    <span
                      onClick={() => {
                        router.push(`/products/${cat.slug}`);
                        handleCloseMenu();
                      }}
                    >
                      {cat.name}
                    </span>

                    {cat.subcategories.length > 0 && (
                      <FiChevronDown
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCategory(expandedCategory === cat.name ? null : cat.name);
                        }}
                        className={`transition-transform ${expandedCategory === cat.name ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>

                  {/* FIRST LEVEL */}
                  <div
                    className={`ml-4 border-l border-gray-200 pl-3 overflow-hidden transition-all ${expandedCategory === cat.name ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <ul className="space-y-1">
                      {cat.subcategories.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <button
                            className="flex justify-between w-full py-1 text-sm text-gray-600"
                            onClick={() =>
                              setExpandedSubcategory(
                                expandedSubcategory === sub.name ? null : sub.name
                              )
                            }
                          >
                            {sub.name}

                            {sub.children?.length > 0 && (
                              <FiChevronDown
                                className={`transition-transform ${expandedSubcategory === sub.name ? "rotate-180" : ""
                                  }`}
                              />
                            )}
                          </button>

                          {/* SECOND LEVEL */}
                          <div
                            className={`ml-4 border-l border-gray-200 pl-3 overflow-hidden transition-all ${expandedSubcategory === sub.name
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                              }`}
                          >
                            <ul className="space-y-1">
                              {sub.children?.map((child, cidx) => (
                                <li key={cidx} className="py-1 text-sm text-gray-600">
                                  {child.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}

              {/* ⭐ SIMPLE PAGE LINKS (NO DROPDOWNS) */}
              <hr className="my-2" />
              {simplePages.map((page, i) => (
                <Link
                  key={i}
                  href={page.href}
                  onClick={handleCloseMenu}
                  className="block py-2 text-sm hover:text-orange-500"
                >
                  {page.name}
                </Link>
              ))}
            </ul>
          </div>
        </>
      )}
      <CartSidebar externalOpen={cartOpen} setExternalOpen={setCartOpen} />

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-[fadeIn_0.18s_ease-out]">
          <div className="bg-white rounded-lg shadow-xl px-6 py-5 w-80 max-w-[90%] text-center transform animate-[scaleIn_0.18s_ease-out]">
            <h2 className="text-lg font-semibold mb-2">
              Are you sure you want to log out?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You will need to log in again to access your account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
};

export default Navbar;
