"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";


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
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

    // Fetch WhatsApp number from business-settings
    useEffect(() => {
        const fetchWhatsappNumber = async () => {
            try {
                const res = await apiClient.get("/api/business-settings");
                const json = res.data;

                if (json.success && json.data) {
                    const whatsappSetting = json.data.find(
                        (setting: { type: string; value: string }) => setting.type === "whatsapp_number"
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
        const fetchCampingOffers = async () => {
            try {
                const res = await apiClient.get("/api/camping-offers");

                const json = res.data;
                if (json.success) {
                    setData(json.data); // The API proxy returns { success: true, data: { ... } }
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

    const highlightProduct = data.highlight_product?.data?.[0];
    const products = data.products?.data || [];

    return (
        <section className=" bg-white mx-auto px-4 py-12">
            <div className="w-11/12 mx-auto">
                <div className="flex justify-between  items-center mb-8">
                    <div>
                        <h2 className="xl:text-3xl text-xl font-semibold text-gray-900">{data.title}</h2>
                        <p className="text-gray-500 text-md mt-1">{data.subtitle}</p>
                    </div>
                    <Link href="/dealer/camping-offers" className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        View All Products <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Highlight Product */}
                    {highlightProduct && (
                        <div className="w-full lg:w-[25%] bg-white  rounded-2xl   flex flex-col">
                            <div className="relative aspect-square mb-2 rounded-xl overflow-hidden bg-gray-50 group">
                                <span className="absolute top-4 left-4 z-10 bg-[#FFDED2] text-[#F16522] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Special offer
                                </span>
                                <Image
                                    src={highlightProduct.thumbnail_image}
                                    alt={highlightProduct.name}
                                    fill
                                    className="object-contain  group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1 shadow-sm">
                                    <span className="text-xs font-bold text-gray-900">{(highlightProduct.rating || 0).toFixed(1)}</span>
                                    <FaStar className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[10px] text-gray-500">({(highlightProduct.rating_count || 0).toString().padStart(2, '0')})</span>
                                </div>
                            </div>

                            <div className="mb-1">
                                <h3 className="text-[16px] font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                                    {highlightProduct.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    Model : {highlightProduct.model_number || "N/A"}
                                </p>

                                <div className="space-y-2">
                                    {highlightProduct.featured_specs?.slice(0, 2).map((spec, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-md">
                                            <div className="w-4 h-4 relative flex-shrink-0 grayscale">
                                                <Image src={spec.icon} alt="" fill className="object-contain" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{spec.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3  mt-1">
                                <Link
                                    href={`/${highlightProduct.slug}`}
                                    className="flex-1 text-center py-1 px-4 rounded-md border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    More Details
                                </Link>
                                <a
                                    href={
                                        whatsappNumber
                                            ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                                `Hello, I'm interested in the product: ${highlightProduct.name}. Link: ${typeof window !== "undefined" ? window.location.origin + "/" + highlightProduct.slug : ""
                                                }`
                                            )}`
                                            : "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-[#F16522] hover:bg-[#d85619] text-white py-1 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center text-center"
                                >
                                    Get a best price
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/${product.slug}`}
                                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-orange-100 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
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
                                <div className="p-3 flex flex-col flex-grow">
                                    <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-[1.3] group-hover:text-primary transition-colors">
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