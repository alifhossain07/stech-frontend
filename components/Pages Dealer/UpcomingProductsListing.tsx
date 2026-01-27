"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
}

interface Category {
    name: string;
    products: {
        data: Product[];
    };
}

interface UpcomingProductsData {
    categories: Category[];
}

interface BusinessSetting {
    type: string;
    value: string;
}

const UpcomingProductsListing = () => {
    const [data, setData] = useState<UpcomingProductsData | null>(null);
    const [banners, setBanners] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

    // Fetch WhatsApp number
    useEffect(() => {
        const fetchWhatsappNumber = async () => {
            try {
                const res = await apiClient.get("/api/business-settings");
                const json = res.data;

                if (json.success && json.data) {
                    const whatsappSetting = json.data.find(
                        (setting: BusinessSetting) => setting.type === "whatsapp_number"
                    );
                    if (whatsappSetting?.value) {
                        setWhatsappNumber(whatsappSetting.value);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch WhatsApp number:", error);
            }
        };

        fetchWhatsappNumber();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, bannersRes] = await Promise.all([
                    apiClient.get("/api/dealer/upcoming-products"),
                    apiClient.get("/api/dealer/banners")
                ]);

                // The proxy route wraps the response in { success: true, data: { ... } }
                if (productsRes.data.success && productsRes.data.data) {
                    setData(productsRes.data.data);
                }
                if (bannersRes.data.success && bannersRes.data.data) {
                    setBanners(bannersRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching upcoming products:", error);
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

    if (!data || !data.categories || data.categories.length === 0) {
        return (
            <div className="w-11/12 mx-auto py-20 text-center">
                <p className="text-gray-500 text-lg">No upcoming products available.</p>
            </div>
        );
    }

    const bannerImage = banners?.upcoming_banner || "/assets/img/placeholder.jpg";

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Banner Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/4] w-full h-44 md:h-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={bannerImage}
                        alt="Upcoming Products Banner"
                        fill
                        className="object-fill"
                        priority
                    />
                </div>
            </div>

            {/* Header Section */}
            <div className="text-center mt-6 md:mt-12 mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">Upcoming products</h1>
                <p className="text-gray-500 mt-2">Grab the top tech deals before they&apos;re gone</p>
            </div>

            {/* Categories with Product Sliders */}
            <div className="w-11/12 mx-auto space-y-12">
                {data.categories.map((category, categoryIndex) => (
                    <CategorySection
                        key={categoryIndex}
                        category={category}
                        whatsappNumber={whatsappNumber}
                    />
                ))}
            </div>
        </div>
    );
};

interface CategorySectionProps {
    category: Category;
    whatsappNumber: string | null;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, whatsappNumber }) => {
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
    }, [category]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Determine scroll amount based on product card width + gap
            const isMobile = window.innerWidth < 768;
            const cardWidth = isMobile ? 200 : 250;
            const gap = 16; // gap-4 is 16px
            const scrollAmount = cardWidth + gap;

            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const products = category.products?.data || [];

    if (products.length === 0) return null;

    return (
        <div className="mb-12">
            {/* Category Header */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{category.name}</h2>
            <p className="text-gray-500 text-sm mb-6">Grab the top tech deals before they&apos;re gone</p>

            {/* Products Slider Container */}
            <div className="relative group">
                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
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
            </div>

            {/* Bottom Slider Navigation */}
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
        </div>
    );
};

interface ProductCardProps {
    product: Product;
    whatsappNumber: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, whatsappNumber }) => {
    return (
        <div className="flex-shrink-0 w-[200px] md:w-[250px] bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden group">
                <span className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Upcoming
                </span>
                <Image
                    src={product.thumbnail_image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Product Details */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Rating - Moved above title */}
                <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-xs font-bold text-gray-900">
                        {(product.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-[10px] text-gray-400">
                        ({product.rating_count || 0})
                    </span>
                </div>

                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight min-h-[32px]">
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
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-md">
                            <div className="w-3.5 h-3.5 relative flex-shrink-0 grayscale opacity-70">
                                <Image src={spec.icon} alt="" fill className="object-contain" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600 line-clamp-1">
                                {spec.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2 pt-2 border-t border-gray-50">
                    <Link
                        href={`/${product.slug}`}
                        className="flex-1 text-center py-2 px-2 rounded-md border border-gray-200 text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        More Details
                    </Link>
                    <a
                        href={
                            whatsappNumber
                                ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hello, I'm interested in the upcoming product: ${product.name}. Link: ${typeof window !== "undefined" ? window.location.origin + "/" + product.slug : ""
                                    }`
                                )}`
                                : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#F16522] hover:bg-[#d85619] text-white py-2 px-2 rounded-md text-[10px] font-bold transition-all text-center whitespace-nowrap"
                    >
                        Get a best price
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UpcomingProductsListing;
