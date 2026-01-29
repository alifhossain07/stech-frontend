"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import apiClient from "@/app/lib/api-client";
import ProductCard from "../ui/ProductCard";
import { FiFilter, FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { Range } from "react-range";

interface Product {
    id: number;
    slug: string;
    name: string;
    image: string;
    price: number;
    oldPrice: number;
    discount: string;
    rating: string | number;
    reviews: string | number;
    featured_specs: { icon: string; text: string }[];
    current_stock: number;
    variants: any[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface FilterAttribute {
    id: number;
    name: string;
    values: { id: number; value: string }[];
}

const DealerAllProductsListing = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [banner, setBanner] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const [filteringAttributes, setFilteringAttributes] = useState<FilterAttribute[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const MIN = 0;
    const MAX = 120000;
    const [minPrice, setMinPrice] = useState(MIN);
    const [maxPrice, setMaxPrice] = useState(MAX);
    const [sortOption, setSortOption] = useState("default");
    const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
    const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>({});

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Initial fetch: Banners and Categories
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [bannerRes, categoriesRes] = await Promise.all([
                    apiClient.get("/api/dealer/banners"),
                    apiClient.get("/api/navbarCategories")
                ]);

                if (bannerRes.data.success) {
                    setBanner(bannerRes.data.data.product_filter_banner);
                }

                if (categoriesRes.data.data) {
                    const cats = categoriesRes.data.data.map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        slug: c.slug,
                        icon: c.icon
                    }));
                    setCategories(cats);
                    if (cats.length > 0) {
                        setActiveCategory(cats[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching initial dealer data:", error);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch products when activeCategory or page/sort updates
    const fetchProducts = useCallback(async () => {
        if (!activeCategory) return;

        setIsFilterLoading(true);
        try {
            const params = new URLSearchParams();
            if (sortOption === "price-low-high") params.set("sort_key", "price_low_to_high");
            else if (sortOption === "price-high-low") params.set("sort_key", "price_high_to_low");

            params.set("page", String(currentPage));

            const res = await apiClient.get(`/api/products/category/${activeCategory.slug}?${params.toString()}`);

            if (res.data.success) {
                setProducts(res.data.products || []);
                setFilteringAttributes(res.data.filtering_attributes || []);
                setTotalProducts(res.data.total || 0);
                setTotalPages(res.data.meta?.last_page || 1);
            }
        } catch (error) {
            console.error("Error fetching products for category:", error);
        } finally {
            setIsFilterLoading(false);
            setLoading(false);
        }
    }, [activeCategory, currentPage, sortOption]);

    useEffect(() => {
        if (activeCategory) {
            fetchProducts();
        }
    }, [activeCategory, fetchProducts]);

    // Client-side filtering logic (matching user side)
    const filteredProducts = products.filter((p) => {
        if (p.price < minPrice || p.price > maxPrice) return false;

        if (availabilityFilter) {
            const isInStock = p.current_stock > 0;
            if (availabilityFilter === "inStock" && !isInStock) return false;
            if (availabilityFilter === "outOfStock" && isInStock) return false;
        }

        const dynamicAttrKeys = Object.keys(dynamicFilters);
        if (dynamicAttrKeys.length > 0) {
            const satisfiesAllAttributes = dynamicAttrKeys.every((attrName) => {
                const selectedValues = dynamicFilters[attrName];
                if (selectedValues.length === 0) return true;

                return (p.variants || []).some((v) => {
                    const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, "");
                    const normalizedVariant = normalize(v.variant);
                    return selectedValues.some((val) => normalizedVariant.includes(normalize(val)));
                });
            });
            if (!satisfiesAllAttributes) return false;
        }

        return true;
    });

    const toggleDynamicFilter = (attrName: string, value: string) => {
        setDynamicFilters((prev) => {
            const currentValues = prev[attrName] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            const newFilters = { ...prev };
            if (newValues.length === 0) {
                delete newFilters[attrName];
            } else {
                newFilters[attrName] = newValues;
            }
            return newFilters;
        });
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setMinPrice(MIN);
        setMaxPrice(MAX);
        setAvailabilityFilter(null);
        setDynamicFilters({});
        setSortOption("default");
        setCurrentPage(1);
    };

    const SidebarContent = (
        <div className="w-full bg-[#f4f4f4] h-full xl:h-auto rounded-md xl:rounded-md shadow p-4 border overflow-y-auto xl:overflow-visible">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#ff6b01] text-lg md:text-[22px]">
                    Product Filter
                </h2>
                <button
                    className="text-orange-500 text-xs md:text-[12px] hover:underline"
                    onClick={clearAllFilters}
                >
                    Clear all
                </button>
            </div>

            {/* Availability */}
            <div className="border-t py-3">
                <h3 className="font-medium text-base md:text-[18px] mb-2">Availability</h3>
                <div className="space-y-1 text-[#626262] text-sm md:text-[16px]">
                    <label className="flex gap-2 items-center cursor-pointer">
                        <input
                            className="accent-orange-500 cursor-pointer"
                            type="checkbox"
                            checked={availabilityFilter === "inStock"}
                            onChange={() => setAvailabilityFilter(availabilityFilter === "inStock" ? null : "inStock")}
                        /> In Stock
                    </label>
                    <label className="flex gap-2 items-center cursor-pointer">
                        <input
                            className="accent-orange-500 cursor-pointer"
                            type="checkbox"
                            checked={availabilityFilter === "outOfStock"}
                            onChange={() => setAvailabilityFilter(availabilityFilter === "outOfStock" ? null : "outOfStock")}
                        /> Out of Stock
                    </label>
                    <label className="flex gap-2 items-center cursor-pointer">
                        <input
                            className="accent-orange-500 cursor-pointer"
                            type="checkbox"
                            checked={availabilityFilter === "preOrder"}
                            onChange={() => setAvailabilityFilter(availabilityFilter === "preOrder" ? null : "preOrder")}
                        /> Pre-Order
                    </label>
                    <label className="flex gap-2 items-center cursor-pointer">
                        <input
                            className="accent-orange-500 cursor-pointer"
                            type="checkbox"
                            checked={availabilityFilter === "upcoming"}
                            onChange={() => setAvailabilityFilter(availabilityFilter === "upcoming" ? null : "upcoming")}
                        /> Up Coming
                    </label>
                </div>
            </div>

            {/* Price Range */}
            <div className="border-t py-3">
                <h3 className="font-medium text-base md:text-[18px] mb-2">Price Range</h3>
                <p className="text-2xl md:text-[24px] my-4 text-center font-medium">৳{minPrice} — ৳{maxPrice}</p>
                <Range
                    step={1}
                    min={MIN}
                    max={MAX}
                    values={[minPrice, maxPrice]}
                    onChange={(vals) => {
                        setMinPrice(vals[0]);
                        setMaxPrice(vals[1]);
                    }}
                    renderTrack={({ props, children }) => (
                        <div {...props} className="w-full h-2 rounded-full bg-gray-200 relative">
                            <div
                                className="absolute h-2 bg-orange-500 rounded-full"
                                style={{
                                    left: `${(minPrice / MAX) * 100}%`,
                                    width: `${((maxPrice - minPrice) / MAX) * 100}%`,
                                }}
                            />
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div {...props} className="w-4 h-4 bg-white border border-gray-400 rounded-full shadow cursor-pointer focus:outline-none" />
                    )}
                />
                <div className="flex justify-between gap-3 text-xs md:text-sm mt-4">
                    <div className="w-1/2 flex flex-col">
                        <label className="text-[10px] text-gray-500 mb-0.5">Min Price</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-full py-2 text-center bg-white border border-gray-300 rounded focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <label className="text-[10px] text-gray-500 mb-0.5">Max Price</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full py-2 text-center bg-white border border-gray-300 rounded focus:border-orange-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Attributes */}
            {filteringAttributes.map((attr) => (
                <div key={attr.id} className="border-t py-3">
                    <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">{attr.name}</h3>
                    <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
                        {attr.values.map((val) => (
                            <label key={val.id} className="flex gap-2 items-center cursor-pointer">
                                <input
                                    className="accent-orange-500 cursor-pointer"
                                    type="checkbox"
                                    checked={(dynamicFilters[attr.name] || []).includes(val.value)}
                                    onChange={() => toggleDynamicFilter(attr.name, val.value)}
                                />
                                {val.value}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
                <div className="h-10 w-48 bg-gray-200 mx-auto mb-10"></div>
                <div className="flex justify-center gap-6 mb-12">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-12 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-6">
                    <div className="hidden xl:block w-[340px] h-[600px] bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Banner Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/4] w-full h-44 md:h-auto rounded-xl overflow-hidden shadow-lg bg-gray-100">
                    <Image
                        src={banner || "/assets/img/placeholder.jpg"}
                        alt="All Products Banner"
                        fill
                        className="object-fill"
                        priority
                    />
                </div>
            </div>

            {/* Title Section */}
            <div className="text-left w-11/12 mx-auto mt-8 md:mt-12 mb-4 xl:mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">All Products</h1>
            </div>

            {/* Categories Circle Bar */}
            <div className="w-11/12 mx-auto mb-2 xl:mb-3">
                <div
                    className="
            flex flex-wrap justify-start items-start
            gap-3 md:gap-4
            xl:flex-nowrap xl:overflow-x-auto xl:pb-4 xl:min-w-max
        "
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat);
                                setCurrentPage(1);
                                clearAllFilters();
                            }}
                            className="flex flex-col items-start group focus:outline-none"
                        >
                            <span
                                className={`
                        text-[11px] md:text-sm
                        px-3 py-1.5 md:px-5 md:py-2
                        rounded-full
                        bg-[#FFD1B0]
                        font-semibold
                        transition-colors
                        ${activeCategory?.id === cat.id
                                        ? "text-orange-600"
                                        : "text-gray-900 group-hover:text-orange-500"
                                    }
                    `}
                            >
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-11/12 mx-auto">
                {/* Mobile Filter & Sort */}
                <div className="xl:hidden flex items-center justify-between bg-[#f4f4f4] rounded-xl p-1 mb-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-sm font-medium text-[#626262]"
                    >
                        <FiFilter className="text-lg" />
                        <span>Filter</span>
                    </button>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border px-2 py-2 text-xs text-[#626262] rounded-md bg-white outline-none"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                    </select>
                </div>

                <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden xl:block xl:w-[250px] 2xl:w-[355px]">
                        {SidebarContent}
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full xl:flex-1 2xl:w-[1368px]">
                        {/* Desktop Sort Header */}
                        <div className="hidden xl:flex justify-between items-center bg-[#f4f4f4] px-2 py-1 rounded-xl mb-6">
                            <div className="text-[16px] text-[#626262] font-medium">
                                Showing {filteredProducts.length} Products in {activeCategory?.name}
                            </div>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border px-4 py-2 text-[#626262] rounded-md text-sm bg-white outline-none focus:border-orange-500"
                            >
                                <option value="default">Default</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Mobile product count */}
                        <div className="xl:hidden mb-3 text-xs text-[#626262]">
                            Showing {filteredProducts.length} Products
                        </div>

                        {/* Product Grid */}
                        <div className="relative">
                            {isFilterLoading && (
                                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {filteredProducts.length > 0 ? (
                                <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-7">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 text-lg">No products found matching these filters.</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="mt-4 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 mb-8">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"}`}
                                    >
                                        &lt; Back
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 border rounded-md text-sm font-medium transition-all ${currentPage === page ? "bg-black text-white border-black" : "hover:bg-gray-100 border-gray-300"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"}`}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <div
                className={`fixed inset-0 bg-black/40 z-50 xl:hidden transition-opacity duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsFilterOpen(false)}
            />
            <div
                className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-[60] xl:hidden flex flex-col transform transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-lg">Filters</span>
                    <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 font-medium">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {SidebarContent}
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default DealerAllProductsListing;
