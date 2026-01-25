"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

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

interface CampingOfferData {
    title: string;
    subtitle: string;
    highlight_product: {
        data: Product[];
    };
    products: {
        data: Product[];
    };
}

const CampingOffer = () => {
    const [data, setData] = useState<CampingOfferData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampingOffers = async () => {
            try {
                const response = await axios.get("/api/camping-offers");
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching camping offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampingOffers();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-96 bg-gray-100 rounded mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 bg-gray-100 h-[600px] rounded-2xl"></div>
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 h-[250px] rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const highlightProduct = data.highlight_product.data[0];
    const products = data.products.data;

    return (
        <section className=" bg-white mx-auto px-4 py-12">
            <div className="w-11/12 mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{data.title}</h2>
                        <p className="text-gray-500 mt-1">{data.subtitle}</p>
                    </div>
                    <Link href="/products" className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        View All Products <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-[1.64%]">
                    {/* Highlight Product */}
                    {highlightProduct && (
                        <div className="w-full lg:w-[38%] bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                            <div className="relative aspect-square mb-6 rounded-xl overflow-hidden bg-gray-50 group">
                                <span className="absolute top-4 left-4 z-10 bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Special offer
                                </span>
                                <Image
                                    src={highlightProduct.thumbnail_image}
                                    alt={highlightProduct.name}
                                    fill
                                    className="object-contain  group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1 shadow-sm">
                                    <span className="text-xs font-bold text-gray-900">{highlightProduct.rating.toFixed(1)}</span>
                                    <FaStar className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[10px] text-gray-500">({highlightProduct.rating_count.toString().padStart(2, '0')})</span>
                                </div>
                            </div>

                            <div className="">
                                <h3 className="text-md font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                                    {highlightProduct.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    Model : {highlightProduct.model_number || "N/A"}
                                </p>

                                <div className="space-y-2 mb-2">
                                    {highlightProduct.featured_specs?.slice(0, 2).map((spec, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                            <div className="w-5 h-5 relative flex-shrink-0">
                                                <Image src={spec.icon} alt="" fill className="object-contain" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{spec.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto pt-1 border-t border-gray-50">
                                <Link
                                    href={`/product/${highlightProduct.slug}`}
                                    className="flex-1 text-center 2xl:py-3 py-1 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    More Details
                                </Link>
                                <button className="flex-1 bg-[#F16522] hover:bg-[#d85619] text-white 2xl:py-3 py-1 px-4 rounded-xl text-sm font-medium transition-all shadow-md shadow-orange-200">
                                    Get a best price
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="w-full  grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="group bg-white  rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-square mb-4 rounded-md overflow-hidden bg-gray-50">
                                    <span className="absolute top-2 left-2 z-10 bg-orange-100 text-orange-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Special offer
                                    </span>
                                    <Image
                                        src={product.thumbnail_image}
                                        alt={product.name}
                                        fill
                                        className="object-contain  group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-2 flex flex-col flex-grow">
                                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mb-2 min-h-[32px]">
                                        {product.name}
                                    </h4>

                                </div>

                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CampingOffer;