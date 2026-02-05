"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

import apiClient from "@/app/lib/api-client";

interface Banner {
    position: number;
    type: "vertical" | "horizontal";
    image: string;
    link: string;
}

interface TopSellProductsData {
    title: string;
    subtitle: string;
    banners: Banner[];
}

const TopSellBanner = () => {
    const [data, setData] = useState<TopSellProductsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSellProducts = async () => {
            try {
                const response = await apiClient.get("/api/top-sell-products");
                const json = response.data;
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Error fetching top sell products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSellProducts();
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="aspect-[400/600] bg-gray-100 rounded-md"></div>
                    <div className="flex flex-col gap-6">
                        <div className="flex-1 aspect-[1300/400] bg-gray-100 rounded-md"></div>
                        <div className="flex-1 aspect-[1300/400] bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="aspect-[400/600] bg-gray-100 rounded-md"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const banner1 = data.banners.find(b => b.position === 1);
    const banner2 = data.banners.find(b => b.position === 2);
    const banner3 = data.banners.find(b => b.position === 3);
    const banner4 = data.banners.find(b => b.position === 4);

    return (
        <section className=" py-12">
            <div className="w-11/12 mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="xl:text-3xl text-xl font-medium text-gray-900">{data.title}</h2>
                        <p className="text-gray-500 mt-1">{data.subtitle}</p>
                    </div>
                    <Link href="/dealer/top-sell" className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        View All Products <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                    {/* Left Banner */}
                    <div className="md:col-span-3">
                        {banner1 && (
                            <a href={banner1.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <div className="relative aspect-[334/412] w-full h-full rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                        src={banner1.image}
                                        alt="Top Sell 1"
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Middle Banners */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        {banner2 && (
                            <a href={banner2.link || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 block">
                                <div className="relative aspect-[454/200] w-full h-full rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                        src={banner2.image}
                                        alt="Top Sell 2"
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </a>
                        )}
                        {banner3 && (
                            <a href={banner3.link || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 block">
                                <div className="relative aspect-[454/200] w-full h-full rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                        src={banner3.image}
                                        alt="Top Sell 3"
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Right Banner */}
                    <div className="md:col-span-3">
                        {banner4 && (
                            <a href={banner4.link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <div className="relative aspect-[334/412] w-full h-full rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                        src={banner4.image}
                                        alt="Top Sell 4"
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopSellBanner;
