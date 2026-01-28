"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import apiClient from "@/app/lib/api-client";
import ProductCard from "../ui/ProductCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Product {
    id: number;
    slug: string;
    name: string;
    thumbnail_image: string;
    main_price: string;
    stroked_price: string;
    discount: string;
    rating: number;
    rating_count: number;
    featured_specs: { icon: string; text: string }[];
}

interface Category {
    name: string;
    products: {
        data: Product[];
    };
}

interface DealerProductListingProps {
    apiEndpoint: string;
    bannerKey: string;
    pageTitle?: string;
    pageSubtitle?: string;
    badgeText?: string;
    badgeType?: "new-arrival" | "top-sell" | "special-offer" | "upcoming";
}

interface DealerBanners {
    [key: string]: string;
}

const DealerProductListing: React.FC<DealerProductListingProps> = ({
    apiEndpoint,
    bannerKey,
    pageTitle,
    pageSubtitle,
    badgeText,
    badgeType
}) => {
    const [productsData, setProductsData] = useState<Category[]>([]);
    const [banners, setBanners] = useState<DealerBanners | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, bannersRes] = await Promise.all([
                    apiClient.get(apiEndpoint),
                    apiClient.get("/api/dealer/banners")
                ]);

                if (productsRes.data.success) {
                    setProductsData(productsRes.data.data.categories || []);
                }
                if (bannersRes.data.success) {
                    setBanners(bannersRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching dealer product listing data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint]);

    const categories = useMemo(() => {
        const cats = productsData.map(c => c.name);
        return ["All", ...cats];
    }, [productsData]);

    const allProducts = useMemo(() => {
        if (activeCategory === "All") {
            return productsData.flatMap(c => c.products.data);
        }
        const category = productsData.find(c => c.name === activeCategory);
        return category ? category.products.data : [];
    }, [productsData, activeCategory]);

    // Pagination logic
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-md mb-8"></div>
                <div className="h-10 w-48 bg-gray-200 mx-auto mb-4"></div>
                <div className="h-6 w-64 bg-gray-100 mx-auto mb-8"></div>
                <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    const bannerImage = banners?.[bannerKey] || "/assets/img/placeholder.jpg";

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Banner Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/4] w-full h-44 md:h-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={bannerImage}
                        alt="Page Banner"
                        fill
                        className="object-fill"
                        priority
                    />
                </div>
            </div>

            {/* Header Section */}
            <div className="text-center mt-6 md:mt-12 mb-8">
                <h1 className="text-xl md:text-3xl   font-medium text-gray-900">{pageTitle || "Products"}</h1>
                <p className="text-gray-500 mt-2">{pageSubtitle || "Grab the best deals before they're gone"}</p>
            </div>

            {/* Category Filter */}
            <div className="w-11/12 mx-auto flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            setCurrentPage(1);
                        }}
                        className={`md:px-6 md:py-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                            ? "bg-black text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="w-11/12 mx-auto">
                {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-2  md:grid-cols-3 items-center justify-center lg:grid-cols-4 gap-6">
                        {currentProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    id: product.id,
                                    slug: product.slug,
                                    name: product.name,
                                    image: product.thumbnail_image,
                                    price: parseFloat(product.main_price.replace(/[^\d.]/g, '')),
                                    oldPrice: parseFloat(product.stroked_price.replace(/[^\d.]/g, '')),
                                    discount: product.discount,
                                    rating: product.rating,
                                    reviews: `(${product.rating_count})`,
                                    featured_specs: product.featured_specs,
                                    badgeText: badgeText,
                                    badgeType: badgeType
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found for this category.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="w-11/12 mx-auto mt-16 flex justify-center items-center gap-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full border transition-all ${currentPage === 1
                            ? "text-gray-300 border-gray-200 cursor-not-allowed"
                            : "text-gray-600 border-gray-400 hover:bg-black hover:text-white hover:border-black"
                            }`}
                    >
                        <FiChevronLeft size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-full font-medium transition-all ${currentPage === page
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full border transition-all ${currentPage === totalPages
                            ? "text-gray-300 border-gray-200 cursor-not-allowed"
                            : "text-gray-600 border-gray-400 hover:bg-black hover:text-white hover:border-black"
                            }`}
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DealerProductListing;
