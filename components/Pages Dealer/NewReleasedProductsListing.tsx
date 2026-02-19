"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import apiClient from "@/app/lib/api-client";
import DealerProductCard from "../ui/DealerProductCard";

interface Spec {
    text: string;
    icon: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    thumbnail_image: string;
    rating: number;
    rating_count: number;
    model_number?: string;
    created_at: string;
    featured_specs?: Spec[];
    dealer_short_description?: string;
    dealer_featured_specs?: Spec[];
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
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-[220px] sm:w-[250px] lg:w-[calc((100%-36px)/4)] 2xl:w-[calc((100%-48px)/5)]"
                            >
                                <DealerProductCard
                                    product={{
                                        id: product.id,
                                        slug: product.slug,
                                        name: product.name,
                                        image: product.thumbnail_image,
                                        rating: product.rating,
                                        reviews: `(${product.rating_count})`,
                                        model_number: product.model_number,
                                        featured_spec: product.featured_specs?.[0],
                                        badgeText: getRelativeDate(product.created_at),
                                        dealer_short_description: product.dealer_short_description,
                                        dealer_featured_specs: product.dealer_featured_specs
                                    }}
                                />
                            </div>
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



export default NewReleasedProductsListing;
