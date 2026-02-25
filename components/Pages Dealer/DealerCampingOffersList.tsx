"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock } from "react-icons/fi";
import apiClient from "@/app/lib/api-client";

interface FlashDeal {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    date: number; // Unix timestamp (seconds)
    countdown_timer: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(endTimestamp: number): TimeLeft {
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(endTimestamp - now, 0);
    return {
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
    };
}

function pad(n: number) {
    return n.toString().padStart(2, "0");
}

function CountdownTimer({ endTimestamp }: { endTimestamp: number }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(endTimestamp));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endTimestamp));
        }, 1000);
        return () => clearInterval(interval);
    }, [endTimestamp]);

    const blocks = [
        { label: "Days", value: pad(timeLeft.days) },
        { label: "Hour", value: pad(timeLeft.hours) },
        { label: "Minute", value: pad(timeLeft.minutes) },
        { label: "Second", value: pad(timeLeft.seconds) },
    ];

    return (
        <div className="flex items-center gap-1 md:gap-2">
            {blocks.map((block, i) => (
                <React.Fragment key={block.label}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-sm min-w-[40px] md:min-w-[50px]">
                        <div className="text-gray-900 text-sm md:text-base font-bold leading-none">{block.value}</div>
                        <div className="text-gray-500 text-[8px] md:text-[10px] mt-0.5 uppercase tracking-wider">{block.label}</div>
                    </div>
                    {i < blocks.length - 1 && (
                        <span className="text-white font-bold text-sm md:text-lg">:</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

const DealerCampingOffersList = () => {
    const [deals, setDeals] = useState<FlashDeal[]>([]);
    const [banners, setBanners] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [offersRes, bannersRes] = await Promise.all([
                apiClient.get("/api/dealer/camping-offers"),
                apiClient.get("/api/dealer/banners")
            ]);

            if (offersRes.data.success && Array.isArray(offersRes.data.data)) {
                setDeals(offersRes.data.data);
            }
            if (bannersRes.data.success) {
                setBanners(bannersRes.data.data);
            }
        } catch (error) {
            console.error("Error fetching camping offers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-44 md:h-64 bg-gray-200 rounded-xl mb-12" />
                <div className="h-8 w-64 bg-gray-200 mx-auto mb-4" />
                <div className="h-4 w-96 bg-gray-100 mx-auto mb-10" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    const bannerImage = banners?.camping_offer_banner || "/assets/img/placeholder.jpg";

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Banner Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative aspect-[16/4] w-full h-44 md:h-auto rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={bannerImage}
                        alt="Camping Offers Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Header Section */}
            <div className="text-center mt-8 md:mt-12 mb-10">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Camping Offer&apos;s Product</h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">Grab the top tech deals before they&apos;re gone</p>
            </div>

            {/* Offers Grid */}
            <div className="w-11/12 mx-auto">
                {deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {deals.map((deal) => (
                            <Link
                                key={deal.id}
                                href={`/dealer/camping-offers/${deal.slug}`}
                                className="group relative block rounded-2xl overflow-hidden bg-gray-900 shadow-xl aspect-[16/9] md:aspect-auto md:min-h-[400px]"
                            >
                                {/* Deal banner image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={deal.banner}
                                        alt={deal.title}
                                        fill
                                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                </div>

                                {/* Content overlay */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <div className="mb-4">
                                        <h3 className="text-xl md:text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                            {deal.title}
                                        </h3>
                                        <p className="text-white/80 text-sm md:text-base font-medium line-clamp-2">
                                            {deal.subtitle}
                                        </p>
                                    </div>

                                    {/* Countdown timer */}
                                    {deal.countdown_timer !== "0" && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-white/90 font-bold text-[10px] md:text-xs tracking-widest uppercase">
                                                <FiClock className="animate-pulse" /> Offer Ends In
                                            </div>
                                            <CountdownTimer endTimestamp={deal.date} />
                                        </div>
                                    )}

                                    <div className="mt-4 inline-flex items-center text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                        View Products <span className="ml-2">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 text-lg">No active camping offers at the moment. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealerCampingOffersList;
