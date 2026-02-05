"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


import apiClient from "@/app/lib/api-client";

interface DealerHeroData {
    banner_image: string;
    title: string;
    banner_link: string;
    subtitle: string;
    button_texts: string[];
    button_links: string[];
}

interface SuggestionItem {
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
}

const DealerHero = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<DealerHeroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const suggestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await apiClient.get("/api/dealer/dealer-hero");
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Error loading dealer hero:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeroData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset searching state and clear suggestions when route change is complete
    useEffect(() => {
        setIsSearching(false);
        setShowSuggestions(false);
        setSuggestions([]);
    }, [pathname, searchParams]);

    const handleSearchSubmit = (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        // Clear any pending suggestion fetch
        if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);

        setIsSearching(true);
        setShowSuggestions(false);
        setSuggestions([]);
        router.push(`/products/search?q=${encodeURIComponent(trimmed)}`);
    };

    if (loading) {
        return <section className="w-full h-[600px] md:h-[700px] bg-black animate-pulse" />;
    }

    if (!data) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[700px] flex flex-col items-center justify-center text-center overflow-hidden bg-black pt-10 md:pt-12">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.banner_image}
                    alt="Dealer Hero Background"
                    fill
                    className="object-fill opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 md:w-11/12 2xl:max-w-6xl lg:max-w-5xl px-4 flex flex-col items-center gap-3">
                {/* Main Heading */}
                <h1 className="text-xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-white leading-tight">
                    {data.title}
                </h1>

                {/* Subheading */}
                <p className="text-gray-300 text-sm md:text-base max-w-2xl">
                    {data.subtitle}
                </p>

                {/* Search Bar */}
                <div ref={searchRef} className="relative w-full max-w-xl mt-4 group">
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

                                    // Safety check: Don't show suggestions if we already started searching
                                    if (isSearching) return;

                                    let items: SuggestionItem[] = [];
                                    if (json.success && json.data) {
                                        if (Array.isArray(json.data)) {
                                            items = json.data;
                                        } else if (json.data.data && Array.isArray(json.data.data)) {
                                            items = json.data.data;
                                        } else if (json.data.items && Array.isArray(json.data.items)) {
                                            items = json.data.items;
                                        }
                                    }

                                    const processedItems = items.map((item: SuggestionItem) => ({
                                        ...item,
                                        name: item.name || item.title || item.query || "",
                                        image: item.image || item.thumbnail || item.cover_image || item.thumbnail_image || item.photo || (item.photos?.[0]?.path) || null,
                                        price: item.price || item.sale_price || item.offer_price || item.main_price || item.stroked_price || (item.meta?.price) || null,
                                    }));
                                    setSuggestions(processedItems);
                                    setShowSuggestions(processedItems.length > 0);
                                } catch (err) {
                                    console.error("Hero suggestion fetch error:", err);
                                } finally {
                                    setIsSuggestLoading(false);
                                }
                            }, 300);
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(searchTerm); }}
                        placeholder="Search your favorite accessories"
                        className="w-full h-12  px-6 py-4 bg-white rounded-full text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-2xl"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isSuggestLoading && (
                            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <button
                            onClick={() => handleSearchSubmit(searchTerm)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 md:p-2 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                            aria-label="Search"
                        >
                            <FiSearch className="text-xl " />
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-[220px] overflow-y-auto z-50 overflow-hidden text-left border border-gray-100">
                            {suggestions.map((item: SuggestionItem, idx: number) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        if (item.slug) {
                                            setIsSearching(true);
                                            router.push(`/${item.slug}`);
                                            setShowSuggestions(false);
                                            setSuggestions([]);
                                            setSearchTerm("");
                                        } else if (item.name) {
                                            setSearchTerm(item.name);
                                            handleSearchSubmit(item.name);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors ${idx < suggestions.length - 1 ? 'border-b border-gray-50' : ''}`}
                                >
                                    {item.image && (
                                        <div className="relative w-14 h-14 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                            <Image
                                                src={item.image}
                                                alt={item.name || ""}
                                                fill
                                                sizes="56px"
                                                className="object-contain p-1"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                                        <p className="text-sm font-semibold text-gray-900 truncate w-full">
                                            {item.name}
                                        </p>
                                        {item.price && (
                                            <p className="text-xs font-bold text-orange-600 mt-0.5">
                                                {item.price}
                                            </p>
                                        )}
                                    </div>
                                    <FiArrowRight className="text-gray-300 group-hover/btn:text-orange-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                        onClick={() => window.open(data.button_links[0], "_blank")}
                        className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2 border border-white/30 rounded-full text-white bg-white/5 hover:bg-white/10 hover:border-white transition-all duration-300 group"
                    >
                        <span className="text-sm font-medium">{data.button_texts[0]}</span>

                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white group-hover:translate-x-0.5 transition-transform">
                            <FiArrowRight className="text-white text-xs" />
                        </span>
                    </button>

                    <button
                        onClick={() => window.open(data.button_links[1], "_blank")}
                        className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2 border border-white/30 rounded-full text-white bg-white/5 hover:bg-white/10 hover:border-white transition-all duration-300 group"
                    >
                        <span className="text-sm font-medium">{data.button_texts[1]}</span>

                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white group-hover:translate-x-0.5 transition-transform">
                            <FiArrowRight className="text-white text-xs" />
                        </span>
                    </button>
                </div>

            </div>

            {/* Decorative Bottom Fade */}

            {/* Global Search Loading Overlay */}
            {isSearching && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                        <p className="text-white font-medium tracking-wide drop-shadow-md">Searching...</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DealerHero;
