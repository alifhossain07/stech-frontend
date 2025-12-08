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
import { IoSearch,IoCartOutline } from "react-icons/io5";
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
  const [closing, setClosing] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  
const [showMobileSearch, setShowMobileSearch] = useState(false);
const [cartOpen, setCartOpen] = useState(false);
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
const [logoUrl, setLogoUrl] = useState<string | null>(null);

const [showDesktopLogout, setShowDesktopLogout] = useState(false);
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
              <span>Contact Us 24/7:</span>
              <a href="tel:+--854789956" className="underline hover:text-yellow-300">+--854789956</a>
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
    <IoSearch className="text-2xl" />
  </button>

  {/* CART ICON */}
  <button onClick={() => setCartOpen(true)}>
    <IoCartOutline className="text-2xl" />
  </button>
</div>

            
          </div>
          

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* SEARCH */}
            <div className="relative w-full md:w-96 2xl:w-[550px] mr-6">
              <input
                type="text"
                placeholder="Search your Favourite Accessories."
                className="w-full text-white bg-black border border-black rounded-full py-2 px-4"
              />
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
                <FiSearch />
              </button>
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
                className={`absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50 transition-all ${
                  open ? "opacity-100 visible" : "opacity-0 invisible"
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
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="
          absolute right-0 mt-1
          w-full
          text-sm text-red-500
          border border-red-400
          bg-white
          px-3 py-2 rounded-md
          shadow-lg
          transform origin-top
          animate-[fadeInDown_0.18s_ease-out]
          hover:bg-red-50 hover:shadow-xl
          transition
        "
      >
        Logout
      </button>
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
                      className={`absolute left-0 top-full mt-2 bg-white text-black rounded-md shadow-lg transition-all ${
                        hoveredCategory === category.name
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
        className={`absolute left-full top-3 ml-1 bg-white rounded-md shadow-lg transition-all ${
          hoveredSubcategory === sub.name ? "opacity-100 visible" : "opacity-0 invisible"
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
  <div ref={searchRef} className="fixed top-[70px] left-0 w-full z-40 lg:hidden animate-[fadeDown_0.25s_ease-out]">
    <div className=" ">
      <input
        type="text"
        placeholder="Search your Favourite Accessories..."
        className="
          w-full
          bg-white
          text-black
          py-3 px-4
          rounded-md
          shadow-lg
          outline-none
          caret-black
          placeholder:text-gray-500
        "
      />
    </div>
  </div>
)}

      {/* Prevent overlap */}
      <div className="pt-[70px] xl:pt-[150px]"></div>

      {/* ========= MOBILE BOTTOM NAV ========= */}
      <div className="bg-orange-500 fixed bottom-0 left-0 w-full flex justify-around items-center py-2 text-white lg:hidden z-50">
        <Link href="/" className="flex flex-col items-center text-xs">
          <FiHome className="text-lg" />
          Home
        </Link>

        <Link href="/offers" className="flex flex-col items-center text-xs">
          <FiGift className="text-lg" />
          Offers
        </Link>

        <button onClick={() => setCartOpen(true)}  className="flex flex-col items-center text-xs">
          <FiShoppingCart className="text-lg" />
          Cart
        </button>

        <Link href="/login" className="flex flex-col items-center text-xs">
          <FiUser className="text-lg" />
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
            className={`fixed left-0 top-0 w-72 sm:w-80 h-full bg-white shadow-lg z-50 overflow-y-auto ${
              closing ? "animate-slideOut" : "animate-slideIn"
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
      className={`transition-transform ${
        expandedCategory === cat.name ? "rotate-180" : ""
      }`}
    />
  )}
</button>

                  {/* FIRST LEVEL */}
                  <div
                    className={`ml-4 border-l border-gray-200 pl-3 overflow-hidden transition-all ${
                      expandedCategory === cat.name ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
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
                                className={`transition-transform ${
                                  expandedSubcategory === sub.name ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>

                          {/* SECOND LEVEL */}
                          <div
                            className={`ml-4 border-l border-gray-200 pl-3 overflow-hidden transition-all ${
                              expandedSubcategory === sub.name
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
