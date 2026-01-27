"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

import apiClient from "@/app/lib/api-client";

interface Banner {
    position: number;
    type: "large" | "small";
    image: string;
}

interface UpcomingProductsData {
    title: string;
    subtitle: string;
    banners: Banner[];
}

const UpcomingProducts = () => {
    const [data, setData] = useState<UpcomingProductsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingProducts = async () => {
            try {
                const response = await apiClient.get("/api/upcoming-products");
                const json = response.data;
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Error fetching upcoming products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingProducts();
    }, []);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="flex justify-between items-end mb-8">
                    <div className="space-y-3">
                        <div className="h-8 w-64 bg-gray-200 rounded"></div>
                        <div className="h-4 w-96 bg-gray-100 rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 aspect-[800/600] bg-gray-100 rounded-md"></div>
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <div className="flex-1 aspect-[400/300] bg-gray-100 rounded-md"></div>
                        <div className="flex-1 aspect-[400/300] bg-gray-100 rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.banners || data.banners.length === 0) return null;

    const banner1 = data.banners.find(b => b.position === 1);
    const banner2 = data.banners.find(b => b.position === 2);
    const banner3 = data.banners.find(b => b.position === 3);

    return (
        <section className="bg-white py-12">
            <div className="w-11/12 mx-auto">
                <div className="flex justify-between xl:items-end items-center mb-8">
                    <div>
                        <h2 className="xl:text-3xl text-xl font-bold text-gray-900">{data.title}</h2>
                        <p className="text-gray-500 mt-1">{data.subtitle}</p>
                    </div>
                    <Link href="/products" className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        View All Products <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                    {/* Large Banner (Left) */}
                    <div className="md:col-span-6">
                        {banner1 && (
                            <div className="relative aspect-[498/412] w-full h-full rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                <Image
                                    src={banner1.image}
                                    alt="Upcoming Product 1"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Small Banners (Right) */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        {banner2 && (
                            <div className="relative aspect-[334/200] w-full flex-1 rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                <Image
                                    src={banner2.image}
                                    alt="Upcoming Product 2"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                        {banner3 && (
                            <div className="relative aspect-[334/200] w-full flex-1 rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                <Image
                                    src={banner3.image}
                                    alt="Upcoming Product 3"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingProducts;
