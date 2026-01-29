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

  // Debug log for dealer state
  useEffect(() => {
    if (user) {
      console.log("Full User Object:", user);
    }
  }, [user]);

  const isDealer = user?.type?.toLowerCase() === "dealer";
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
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
    { name: "Compare Products", href: "/compare" },
    { name: "Product Activation", href: "/authentication" },
    { name: "Warranty", href: "/productwarranty" },
  ];
  const dealerPages = [
    { name: "New Release", href: "/dealer/new-releases" },
    { name: "Best Deals", href: "/dealer/best-deals" },
    { name: "Top Seller", href: "/dealer/top-sellers" },
    { name: "Todays Offer", href: "/dealer/todays-offer" },
    { name: "All Products", href: "/dealer/all-products" },
    { name: "Reviews", href: "/dealer/all-reviews" },
    { name: "Product Catalog", href: "/dealer/product-catalog" },
    { name: "Warranty Policy", href: "/dealer/warranty-policy" },
    { name: "Help Center", href: "/dealer/help" },

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
    setShowSuggestions(false);
    setSuggestions([]);
    setShowMobileSearch(false);
    router.push(`/products/search?q=${encodeURIComponent(trimmed)}`);
  };

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/header", { cache: "no-store" });
        const json = await res.json();
        const url = json?.data?.url as string | undefined;
        if (url) {
          setLogoUrl(url);
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
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowDesktopLogout(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showMobileSearch && searchRef.current && !searchRef.current.contains(e.target as Node)) {
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
      <header className={`fixed top-0 left-0 w-full z-50 shadow-md ${isDealer ? "bg-black text-white" : "bg-white"}`}>
        {/* TOP BAR */}
        <div
          className={`py-1 border-b border-gray-100 
  ${isDealer ? "hidden" : "hidden xl:block bg-black text-white  "}
  ${!isDealer ? "" : ""}`}
        >
          <div className="w-11/12 mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Contact Us :</span>
              <a href={`tel:${helplineNumber || "+88 01319553399"}`} className="underline hover:text-yellow-300">
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
            <button className={`${isDealer ? "text-white" : "text-orange-500"} text-2xl lg:hidden`} onClick={() => setMenuOpen(true)}>
              <FiMenu />
            </button>
            <Link href="/">
              <Image src={logoUrl || "/images/sannailogo.png"} width={120} height={120} alt="Logo" />
            </Link>
            <div className={`flex lg:hidden items-center ${isDealer ? "text-white" : "text-orange-500"} gap-4`}>
              <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <IoSearch className="text-3xl" />
              </button>
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

          <div className="hidden lg:flex items-center gap-3">
            <div ref={desktopSearchRef} className="relative w-full md:w-[360px] 2xl:w-[550px] mr-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);
                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    return;
                  }
                  setIsSuggestLoading(true);
                  suggestTimeoutRef.current = setTimeout(async () => {
                    try {
                      const res = await fetch(`/api/products/search?suggest=1&query_key=${encodeURIComponent(value)}&type=product`);
                      const json = await res.json();
                      let items = json.data || [];
                      if (!Array.isArray(items) && json.data.items) items = json.data.items;
                      items = items.map((item: SuggestionItem) => ({
                        ...item,
                        name: item.name || item.title || item.query || "",
                        image: item.image || item.thumbnail || item.cover_image || item.thumbnail_image || item.photo || (item.photos?.[0]?.path) || null,
                        price: item.price || item.sale_price || item.offer_price || item.main_price || item.stroked_price || (item.meta?.price) || null,
                      }));
                      setSuggestions(items);
                      setShowSuggestions(items.length > 0);
                    } catch (err) {
                      console.error("Desktop suggestion fetch error:", err);
                    } finally {
                      setIsSuggestLoading(false);
                    }
                  }, 300);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(searchTerm); }}
                placeholder="Search your Favourite Accessories."
                className={`w-full border rounded-full py-2 px-4 focus:outline-none ${isDealer ? "bg-gray-800 text-white border-gray-700 placeholder:text-gray-400" : "bg-black text-white border-black placeholder:text-gray-300"}`}
              />
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-2">
                {isSuggestLoading && (
                  <div className="w-6 h-6 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                <button type="button" onClick={() => handleSearchSubmit(searchTerm)} className="bg-orange-500 text-white p-2 rounded-full">
                  <FiSearch />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50 text-black">
                  {suggestions.map((item: SuggestionItem, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (item.slug) {
                          setShowSuggestions(false);
                          setSuggestions([]);
                          setSearchTerm("");
                          router.push(`/${item.slug}`);
                        } else if (item.name) {
                          setSearchTerm(item.name);
                          handleSearchSubmit(item.name);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      {item.image && (
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                          <Image src={item.image} alt={item.name || ""} fill sizes="48px" className="object-contain" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col items-start min-w-0">
                        <span className="text-gray-800 line-clamp-1 font-medium">{item.name}</span>
                        {item.price && (
                          <span className="text-xs text-orange-600 font-semibold mt-0.5">৳{item.price}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/offers" className="btn-press-3d flex items-center gap-1 text-white px-5 mr-5 py-2 rounded-xl text-sm" style={{ background: "linear-gradient(to bottom, #FFD522, #FF6B01)" }}>
              <FiGift className="text-base mr-1 animate-pulseScaleColor" /> Offers
            </Link>

            {/* LANGUAGE DROPDOWN */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className={`border px-5 py-2 h-[46px] flex items-center gap-2 rounded-md ${isDealer ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-400 text-black"}`}
              >
                <span className="underline">English</span>
                <FiChevronDown className={`${isDealer ? "text-white" : "text-black"} text-2xl`} />
              </button>
              <div className={`absolute left-0 top-full mt-2 text-md bg-white text-black border border-gray-300 rounded-md shadow-md w-32 z-50 transition-all ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <button className="block w-full text-md text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button className="block w-full text-md text-left px-4 py-2 hover:bg-gray-100">Bangla</button>
              </div>
            </div>

            {/* CART */}
            {!isDealer && (
              <button
                onClick={() => setCartOpen(true)}
                className="border px-5 py-2 h-[46px] rounded-md flex items-center gap-3 text-sm bg-white border-gray-400 text-black"
              >
                <FiShoppingCart className="text-2xl" />
                <div>
                  <h1 className="text-md font-medium">Cart</h1>
                  <span className="text-xs">
                    *{cart.length.toString().padStart(2, "0")} Items
                  </span>
                </div>
              </button>
            )}

            {/* PROFILE / AUTH */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className={`border px-5 py-2 h-[46px] rounded-md flex items-center gap-2 text-sm ${isDealer ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-400"}`}
                  onClick={() => setShowDesktopLogout(prev => !prev)}
                >
                  <FiUser className="text-2xl" />
                  <div className="text-left">
                    <h1 className="text-sm font-semibold">Hi, {user.name.split(" ")[0]}</h1>
                    <p className={`text-xs ${isDealer ? "text-gray-400" : "text-gray-500"}`}>{user.phone || "Customer"}</p>
                  </div>
                </button>
                {showDesktopLogout && (
                  <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden text-black">
                    <Link href="/profile" onClick={() => setShowDesktopLogout(false)} className="block w-full text-sm px-3 py-2 hover:bg-gray-100 transition">Dashboard</Link>
                    <button onClick={() => setShowLogoutConfirm(true)} className="block text-left w-full text-sm text-red-500 px-3 py-2 hover:bg-red-50 transition border-t border-gray-200">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={`border px-5 py-2 h-[46px] rounded-md flex items-center gap-2 text-sm ${isDealer ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-400 text-black"}`}>
                <FiUser className="text-2xl" />
                <h1 className="text-sm font-semibold">Login</h1>
              </Link>
            )}
          </div>
        </div>

        {/* ========= DESKTOP NAV ========= */}
        <div className={`${isDealer ? "bg-gray-900" : "bg-orange-500"} hidden lg:block`}>
          <div className="w-11/12 mx-auto flex justify-between items-center min-h-[40px] py-2">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-white text-sm">
              {isDealer ? (
                dealerPages.map((page, i) => (
                  <li key={i}>
                    <Link href={page.href} className="hover:text-gray-200   font-medium tracking-wider">
                      {page.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {categories.map((category, i) => (
                    <li
                      key={i}
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => { setHoveredCategory(null); setHoveredSubcategory(null); }}
                    >
                      <div className="flex items-center gap-1 hover:text-gray-300" onClick={() => router.push(`/products/${category.slug}`)}>
                        {category.name}
                        {category.subcategories.length > 0 && <FiChevronDown className="text-white text-sm" />}
                      </div>
                      {category.subcategories.length > 0 && (
                        <div className={`absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg transition-all ${hoveredCategory === category.name ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                          <ul className="min-w-[180px] py-2 relative">
                            {category.subcategories.map((sub) => (
                              <li key={sub.id} className="px-4 py-2 hover:bg-gray-100 text-sm flex justify-between items-center" onMouseEnter={() => setHoveredSubcategory(sub.name)} onMouseLeave={() => setHoveredSubcategory(null)}>
                                <span onClick={() => router.push(`/products/${sub.slug}`)} className="flex-1 cursor-pointer">{sub.name}</span>
                                {sub.children?.length > 0 && <FiChevronRight className="text-gray-500 text-xs" />}
                                {sub.children?.length > 0 && (
                                  <div className={`absolute left-full top-3 ml-1 bg-white rounded-md shadow-lg transition-all ${hoveredSubcategory === sub.name ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                                    <ul className="min-w-[160px] py-2">
                                      {sub.children?.map((child) => (
                                        <li key={child.id} className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer" onClick={() => router.push(`/products/${child.slug}`)}>{child.name}</li>
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
                  {simplePages.map((page, i) => (
                    <li key={i}><Link href={page.href} className="hover:text-gray-200">{page.name}</Link></li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </header>

      {showMobileSearch && (
        <div ref={searchRef} className="fixed top-[70px] left-0 w-full z-40 lg:hidden animate-[fadeDown_0.25s_ease-out]">
          <div className="relative w-full">
            <input
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setMobileSearchTerm(value);
                if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);
                if (!value.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
                setIsSuggestLoading(true);
                suggestTimeoutRef.current = setTimeout(async () => {
                  try {
                    const res = await fetch(`/api/products/search?suggest=1&query_key=${encodeURIComponent(value)}&type=product`);
                    const json = await res.json();
                    let items = json.data || [];
                    if (!Array.isArray(items) && json.data.items) items = json.data.items;
                    items = items.map((item: SuggestionItem) => ({
                      ...item,
                      name: item.name || item.title || item.query || "",
                      image: item.image || item.thumbnail || item.cover_image || item.thumbnail_image || item.photo || (item.photos?.[0]?.path) || null,
                      price: item.price || item.sale_price || item.offer_price || item.main_price || item.stroked_price || (item.meta?.price) || null,
                    }));
                    setSuggestions(items);
                    setShowSuggestions(items.length > 0);
                  } catch (err) { console.error("Mobile suggestion fetch error:", err); } finally { setIsSuggestLoading(false); }
                }, 300);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(mobileSearchTerm); }}
              placeholder="Search your Favourite Accessories..."
              className="w-full bg-white text-black py-3 px-4 pr-12 rounded-md shadow-lg outline-none caret-black placeholder:text-gray-500"
            />
            {isSuggestLoading && <div className="absolute top-1/2 right-4 transform -translate-y-1/2"><div className="w-4 h-4 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div></div>}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                {suggestions.map((item, idx) => (
                  <button key={idx} type="button" onClick={() => { if (item.slug) router.push(`/${item.slug}`); else if (item.name) handleSearchSubmit(item.name); setShowSuggestions(false); setShowMobileSearch(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    {item.image && <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden"><Image src={item.image} alt={item.name || ""} fill sizes="48px" className="object-contain" /></div>}
                    <div className="flex-1 flex flex-col items-start min-w-0"><span className="text-gray-800 line-clamp-1 font-medium">{item.name}</span>{item.price && <span className="text-xs text-orange-600 font-semibold mt-0.5">৳{item.price}</span>}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prevent overlap */}
      <div className="pt-[70px] xl:pt-[120px]"></div>

      {/* ========= MOBILE BOTTOM NAV ========= */}
      <div className={`${isDealer ? "bg-black" : "bg-orange-500"} fixed bottom-0 left-0 w-full flex justify-around items-center py-3 text-white lg:hidden z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]`}>
        <Link href="/" className="flex flex-col items-center text-xs">
          <FiHome className="text-2xl mb-1" />
          Home
        </Link>
        {!isDealer && (
          <Link href="/offers" className="flex flex-col items-center text-xs">
            <FiGift className="text-2xl mb-1" />
            Offers
          </Link>
        )}
        {!isDealer && (
          <button onClick={() => setCartOpen(true)} className="flex flex-col items-center text-xs">
            <span className="relative">
              <FiShoppingCart className="text-2xl mb-1" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-black text-[9px] leading-none px-1 py-1 rounded-full border border-white">
                  {cart.length.toString().padStart(2, "0")}
                </span>
              )}
            </span>
            Cart
          </button>
        )}
        <Link href={user ? "/profile" : "/login"} className="flex flex-col items-center text-xs">
          <FiUser className="text-2xl mb-1" />
          {user ? "Dashboard" : "Login"}
        </Link>
      </div>

      {/* ========= MOBILE SIDEBAR ========= */}
      {menuOpen && (
        <>
          <div className={`fixed inset-0 bg-black bg-opacity-40 z-40 ${closing ? "opacity-0" : "opacity-100"} transition-opacity duration-300`} onClick={handleCloseMenu}></div>
          <div className={`fixed left-0 top-0 w-72 sm:w-80 h-full bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ${closing ? "-translate-x-full" : "translate-x-0"}`}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <Image src="/images/sannailogo.png" width={100} height={100} alt="Logo" />
              <button className="text-2xl text-orange-500" onClick={handleCloseMenu}><FiX /></button>
            </div>
            <ul className="p-4 space-y-3">
              {isDealer ? (
                <>
                  {dealerPages.map((page, i) => (
                    <li key={i} className="border-b border-gray-50 last:border-none">
                      <Link
                        href={page.href}
                        onClick={handleCloseMenu}
                        className="block py-3 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors uppercase tracking-wide"
                      >
                        {page.name}
                      </Link>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <button className="w-full py-3 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg text-sm font-semibold shadow-md">Buy Dealer Products</button>
                  {categories.map((cat, index) => (
                    <li key={index} className="border-b border-gray-50 last:border-none">
                      <div className="flex justify-between items-center py-3">
                        <span onClick={() => { router.push(`/products/${cat.slug}`); handleCloseMenu(); }} className="flex-1 text-sm font-medium text-gray-700">{cat.name}</span>
                        {cat.subcategories.length > 0 && (
                          <FiChevronDown onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)} className={`transition-transform duration-200 ${expandedCategory === cat.name ? "rotate-180" : ""}`} />
                        )}
                      </div>
                      {expandedCategory === cat.name && (
                        <ul className="pl-4 pb-2 space-y-2">
                          {cat.subcategories.map((sub, subIndex) => (
                            <li key={subIndex}>
                              <div className="flex justify-between items-center py-1">
                                <span onClick={() => { router.push(`/products/${sub.slug}`); handleCloseMenu(); }} className="text-sm text-gray-600">{sub.name}</span>
                                {sub.children?.length > 0 && (
                                  <FiChevronDown onClick={() => setExpandedSubcategory(expandedSubcategory === sub.name ? null : sub.name)} className={`text-xs transition-transform duration-200 ${expandedSubcategory === sub.name ? "rotate-180" : ""}`} />
                                )}
                              </div>
                              {expandedSubcategory === sub.name && (
                                <ul className="pl-4 py-1 space-y-1">
                                  {sub.children?.map((child, cidx) => (
                                    <li key={cidx} onClick={() => { router.push(`/products/${child.slug}`); handleCloseMenu(); }} className="text-xs text-gray-500 py-1">{child.name}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                    {simplePages.map((page, i) => (
                      <Link key={i} href={page.href} onClick={handleCloseMenu} className="block py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">{page.name}</Link>
                    ))}
                  </div>
                </>
              )}
            </ul>
          </div>
        </>
      )}
      <CartSidebar externalOpen={cartOpen} setExternalOpen={setCartOpen} />
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg shadow-xl px-6 py-5 w-80 max-w-[90%] text-center">
            <h2 className="text-lg font-semibold mb-2">Are you sure you want to log out?</h2>
            <p className="text-sm text-gray-600 mb-4">You will need to log in again to access your account.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600">Yes, log out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
