"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import apiClient from "@/app/lib/api-client";

interface Spec {
    text: string;
    icon: string;
}

interface Product {
    id: number;
    slug: string;
    name: string;
    thumbnail_image: string;
    main_price: string;
    stroked_price: string;
    has_discount: boolean;
    rating: number;
    rating_count: number;
    model_number?: string;
    featured_specs?: Spec[];
    created_at?: string;
}

interface Category {
    name: string;
    products: {
        data: Product[];
    };
}

interface NewReleasedProductsData {
    categories: Category[];
}

interface BusinessSetting {
    type: string;
    value: string;
}

const NewReleasedProductsListing = () => {
    const [data, setData] = useState<NewReleasedProductsData | null>(null);
    const [banners, setBanners] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

    // Fetch initial data and banners
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, bannersRes, bizRes] = await Promise.all([
                    apiClient.get("/api/dealer/new-released-products"),
                    apiClient.get("/api/dealer/banners"),
                    apiClient.get("/api/business-settings")
                ]);

                if (productsRes.data.success && productsRes.data.data) {
                    setData(productsRes.data.data);
                }
                if (bannersRes.data.success && bannersRes.data.data) {
                    setBanners(bannersRes.data.data);
                }
                if (bizRes.data.success && bizRes.data.data) {
                    const whatsappSetting = bizRes.data.data.find(
                        (setting: BusinessSetting) => setting.type === "whatsapp_number"
                    );
                    if (whatsappSetting?.value) {
                        setWhatsappNumber(whatsappSetting.value);
                    }
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-md mb-8"></div>
                <div className="h-10 w-48 bg-gray-200 mx-auto mb-4"></div>
                <div className="h-6 w-64 bg-gray-100 mx-auto mb-8"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="mb-12">
                        <div className="h-8 w-32 bg-gray-200 mb-4"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const bannerImage = banners?.new_release_banner || "/assets/img/placeholder.jpg";

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Banner Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/4] w-full h-44 md:h-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={bannerImage}
                        alt="New Released Products Banner"
                        fill
                        className="object-fill"
                        priority
                    />
                </div>
            </div>

            {/* Header Section */}
            {/* <div className="text-center mt-6 md:mt-12 mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">New Release</h1>
                <p className="text-gray-500 mt-2">Grab the top tech deals before they&apos;re gone</p>
            </div> */}

            {/* Content Section */}
            <div className="w-11/12 mx-auto space-y-12 mt-10">
                {!data || !data.categories || data.categories.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-lg">No new released products available.</p>
                    </div>
                ) : (
                    <>
                        {data.categories.map((category, categoryIndex) => (
                            <CategorySection
                                key={categoryIndex}
                                initialCategory={category}
                                whatsappNumber={whatsappNumber}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

interface FilterSectionProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="relative inline-block">
            <select
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F16522]/20 focus:border-[#F16522] transition-all cursor-pointer shadow-sm"
            >
                <option value="all">Show All</option>
                <option value="week">Previous week</option>
                <option value="month">Previous month</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FiCalendar size={18} />
            </div>
        </div>
    );
};

interface CategorySectionProps {
    initialCategory: Category;
    whatsappNumber: string | null;
}

const CategorySection: React.FC<CategorySectionProps> = ({ initialCategory, whatsappNumber }) => {
    const [products, setProducts] = useState<Product[]>(initialCategory.products?.data || []);
    const [currentFilter, setCurrentFilter] = useState<string>("all");
    const [isUpdating, setIsUpdating] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
            return () => {
                container.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
            };
        }
    }, [products]);

    // Handle filter change
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            // If filter is "all", just revert to initial products from props
            if (currentFilter === "all") {
                setProducts(initialCategory.products?.data || []);
                return;
            }

            setIsUpdating(true);
            try {
                const response = await apiClient.get(`/api/dealer/new-released-products?date_filter=${currentFilter}`);

                if (response.data.success && response.data.data) {
                    const allCategories = response.data.data.categories;
                    const thisCategory = allCategories.find((cat: Category) => cat.name === initialCategory.name);

                    if (thisCategory) {
                        setProducts(thisCategory.products.data);
                    } else {
                        setProducts([]);
                    }
                }
            } catch (error) {
                console.error(`Error fetching filtered products for ${initialCategory.name}:`, error);
            } finally {
                setIsUpdating(false);
            }
        };

        fetchFilteredProducts();
    }, [currentFilter, initialCategory.name, initialCategory.products]); // Only watch filter and category name

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Get the width of the first child (ProductCard)
            const firstCard = container.firstElementChild as HTMLElement;
            const cardWidth = firstCard ? firstCard.offsetWidth : 250;
            const gap = 16; // gap-4
            const scrollAmount = cardWidth + gap;

            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={`mb-12 transition-opacity duration-300 ${isUpdating ? "opacity-70" : "opacity-100"}`}>
            {/* Category Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{initialCategory.name}</h2>
                    <p className="text-gray-500 text-sm">Grab the top tech deals before they&apos;re gone</p>
                </div>
                <div className="flex-shrink-0">
                    <FilterSection currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
                </div>
            </div>

            {/* Products Slider Container */}
            <div className="relative group min-h-[100px] flex items-center justify-center">
                {products.length > 0 ? (
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1 w-full"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                whatsappNumber={whatsappNumber}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 text-sm">No products found for this period.</p>
                    </div>
                )}
            </div>

            {/* Bottom Slider Navigation */}
            {products.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border rounded transition-all ${canScrollLeft
                            ? "text-gray-700 border-gray-300 hover:bg-gray-50 active:scale-95"
                            : "text-gray-300 border-gray-100 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronLeft size={18} />
                        Back
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border rounded transition-all ${canScrollRight
                            ? "text-gray-700 border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm"
                            : "text-gray-300 border-gray-100 cursor-not-allowed"
                            }`}
                    >
                        Next
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

const getRelativeDate = (dateString?: string) => {
    if (!dateString) return "New Release";
    const date = new Date(dateString);
    const now = new Date();

    // Reset time for both to compare days accurately
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffInMs = nowOnly.getTime() - dateOnly.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays > 1 && diffInDays < 7) return `${diffInDays} days ago`;

    // Format as "20 Sept 2025"
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

interface ProductCardProps {
    product: Product;
    whatsappNumber: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, whatsappNumber }) => {
    const relativeDateBadge = getRelativeDate(product.created_at);

    return (
        <div className="flex-shrink-0 w-[220px] sm:w-[250px] lg:w-[calc((100%-48px)/4)] 2xl:w-[calc((100%-64px)/5)] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* Product Image */}
            <div className="relative aspect-square bg-white overflow-hidden group">
                <span className="absolute top-2 left-2 z-10 bg-orange-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {relativeDateBadge}
                </span>
                <Image
                    src={product.thumbnail_image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Product Details */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-xs font-bold text-gray-900">
                        {(product.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-[10px] text-gray-400">
                        ({product.rating_count || 0})
                    </span>
                </div>

                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight min-h-[32px]">
                    {product.name}
                </h3>

                <p className="text-[10px] text-gray-500 mb-3">
                    Model : {product.model_number || "N/A"}
                </p>

                {/* Featured Specs */}
                <div className="space-y-1.5 mb-4 h-[55px]">
                    {((product.featured_specs && product.featured_specs.length > 0)
                        ? product.featured_specs
                        : [
                            { icon: "/images/watt.png", text: "25 Watts of Power " },
                            { icon: "/images/fastcharge.png", text: "Super Fast Charging" }
                        ]
                    ).slice(0, 2).map((spec, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-md border border-slate-100/50">
                            <div className="w-3.5 h-3.5 relative flex-shrink-0">
                                <Image src={spec.icon} alt="" fill className="object-contain" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-700 line-clamp-1">
                                {spec.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2 pt-2 border-t border-gray-50">
                    <Link
                        href={`/${product.slug}`}
                        className="flex-1 text-center py-2 px-2 rounded-md border border-gray-200 text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        More Details
                    </Link>
                    <a
                        href={
                            whatsappNumber
                                ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hello, I'm interested in the new released product: ${product.name}. Link: ${typeof window !== "undefined" ? window.location.origin + "/" + product.slug : ""
                                    }`
                                )}`
                                : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#F16522] hover:bg-[#d85619] text-white py-2 px-2 rounded-md text-[10px] font-medium transition-all text-center whitespace-nowrap"
                    >
                        Get a best price
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewReleasedProductsListing;
