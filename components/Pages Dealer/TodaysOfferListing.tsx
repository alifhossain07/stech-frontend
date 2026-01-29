"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/app/lib/api-client";

interface Poster {
    image: string;
    link: string;
}

interface TodaysOfferData {
    main_banner: string;
    posters: Poster[];
}

const TodaysOfferListing = () => {
    const [data, setData] = useState<TodaysOfferData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get("/api/dealer/todays-offer");
                // The proxy route wraps backend response in { success: true, data: json }
                // Backend response is { data: { main_banner, posters }, success, status }
                if (res.data.success && res.data.data && res.data.data.success) {
                    setData(res.data.data.data);
                }
            } catch (error) {
                console.error("Error fetching today's offer data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-44 md:h-64 bg-gray-200 rounded-xl mb-12"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-11/12 mx-auto py-20 text-center">
                <p className="text-gray-500 text-lg">No offers available for today.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Main Banner */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/5] w-full h-[180px] md:h-[350px] rounded-md overflow-hidden shadow-lg border border-gray-100">
                    <Image
                        src={data.main_banner}
                        alt="Today's Offer Main Banner"
                        fill
                        className="object-fill md:object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Posters Grid */}
            <div className="w-11/12 mx-auto mt-12 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-3">
                    {data.posters && data.posters.map((poster, index) => (
                        <Link
                            key={index}
                            href={poster.link || "#"}
                            className="relative aspect-square w-full rounded-md overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-50 bg-gray-50"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src={poster.image}
                                alt={`Offer Poster ${index + 1}`}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Subtle Overlay on hover */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodaysOfferListing;
