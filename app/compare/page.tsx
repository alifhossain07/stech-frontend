"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { useCompare, CompareItem } from "../context/CompareContext";
import { toast } from "react-hot-toast";

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

const ComparePage = () => {
    const { compareList, removeFromCompare, addToCompare } = useCompare();

    return (
        <div className="w-7/12 mx-auto py-10 min-h-[80vh]">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Compare Selected Product</h1>
            </div>

            <div className="flex flex-col lg:flex-row border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">

                {/* Column 1: Labels */}
                <div className="hidden lg:flex flex-col w-[250px] flex-shrink-0 border-r border-gray-200">
                    {/* Header Section */}
                    <div className="p-6 h-[400px] flex flex-col bg-gray-100 justify-center">
                        <h2 className="text-xl font-bold text-orange-500 mb-2">Compare Products</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Find and select products to see the differences and similarities between them
                        </p>
                    </div>

                    {/* Rows Labels: Just Description now */}
                    <div className="p-4 h-[300px] flex items-center bg-gray-100 border-t-4 border-gray-500 text-gray-700 font-medium">
                        <span className="self-start mt-2">Description</span>
                    </div>
                </div>

                {/* Product Columns Wrapper */}
                <div className="flex-1 flex overflow-x-auto">
                    {/* Render exactly 2 slots */}
                    {[0, 1].map((index) => {
                        const product = compareList[index];
                        return (
                            <div key={index} className="w-[300px] lg:w-1/2 min-w-[280px]  border-r border-gray-200 last:border-r-0 flex flex-col">
                                {product ? (
                                    <ProductColumn product={product} onRemove={() => removeFromCompare(product.id)} />
                                ) : (
                                    <EmptyColumn onAdd={addToCompare} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Subcomponents ---

const ProductColumn = ({ product, onRemove }: { product: CompareItem, onRemove: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header: Product Info */}
            <div className="p-6 h-[400px] flex flex-col items-center justify-between relative group border-b border-gray-200">
                <div className="w-full relative h-[200px] flex items-center justify-center mb-4">
                    <div className="absolute top-0 right-0 z-10">
                        {/* Remove Button */}
                        <button onClick={onRemove} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition">
                            <FiX />
                        </button>
                    </div>
                    <Image
                        src={product.image || "/images/placeholder.jpg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain max-h-full"
                    />
                </div>

                <div className="text-center w-full">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[48px] mb-2 text-lg">
                        {product.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500 font-bold text-xl">{product.main_price}</span>
                            {product.has_discount && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {product.discount}
                                </span>
                            )}
                        </div>
                        {product.stroked_price && product.stroked_price !== product.main_price && (
                            <span className="text-gray-400 line-through text-sm">{product.stroked_price}</span>
                        )}
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <Link href={`/product/${product.slug}`} className="block w-8/12 mx-auto text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-full transition">
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Description Row */}
            <div className={`p-4 h-[300px] overflow-y-auto text-sm text-gray-600 border-t-4 border-gray-500 leading-relaxed whitespace-pre-line`}>
                {product.compare_specifications || "No description available."}
            </div>
        </div>
    );
};

const EmptyColumn = ({ onAdd }: { onAdd: (item: CompareItem) => void }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SuggestionItem[]>([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (val: string) => {
        setQuery(val);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (!val.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products/search?suggest=1&query_key=${encodeURIComponent(val)}&type=product`);
                const json = await res.json();

                let items: SuggestionItem[] = [];
                if (json.data && Array.isArray(json.data)) items = json.data;
                else if (json.data && Array.isArray(json.data.products)) items = json.data.products;
                else if (json.data && Array.isArray(json.data.items)) items = json.data.items;

                setResults(items);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSelect = async (item: SuggestionItem) => {
        if (!item.slug) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/products/${item.slug}`);
            const json = await res.json();

            if (json.success && json.data && json.data.length > 0) {
                const p = json.data[0];
                const compareItem: CompareItem = {
                    id: p.id,
                    slug: item.slug || p.slug, // item.slug is surely there
                    name: p.name,
                    image: p.thumbnail_image || p.image || "/images/placeholder.jpg",
                    main_price: p.main_price,
                    stroked_price: p.stroked_price,
                    has_discount: p.has_discount,
                    discount: p.discount,
                    rating: p.rating,
                    compare_specifications: p.compare_specifications || "",
                    brand: p.brand,
                    model_number: p.model_number,
                    other_features: p.other_features,
                };
                onAdd(compareItem);
            } else {
                toast.error("Could not fetch product details.");
            }
        } catch (e) {
            console.error("Error fetching full product details", e);
            toast.error("Failed to load product.");
        } finally {
            setLoading(false);
            setQuery("");
            setResults([]);
        }
    };

    return (
        <div className="p-6 h-[400px] flex flex-col items-center justify-start relative">
            <div className="w-full relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search your favorite accessories"
                    className="w-full bg-gray-100 border-none rounded-full py-3 px-5 pr-10 focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                    {loading ? <div className="animate-spin h-4 w-4 border-2 border-orange-500 rounded-full border-t-transparent"></div> : <FiSearch size={18} />}
                </div>

                {/* Suggestions Dropdown */}
                {query && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-[300px] overflow-y-auto">
                        {results.map((res, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(res)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                            >
                                <div className="w-10 h-10 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={res.image || res.thumbnail_image || "/images/placeholder.jpg"}
                                        alt={res.name || ""}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{res.name}</p>
                                    <p className="text-xs text-orange-500 font-semibold">{res.main_price || res.price}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {query && !loading && results.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white p-4 text-center text-sm text-gray-500 shadow-lg rounded-lg z-50">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparePage;
