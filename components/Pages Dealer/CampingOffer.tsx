"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import apiClient from "@/app/lib/api-client";

interface FlashDeal {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    date: number; // Unix timestamp (seconds)
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
        <div className="flex items-center gap-1.5">
            {blocks.map((block, i) => (
                <React.Fragment key={block.label}>
                    <div className="bg-white rounded-lg px-2.5 py-1.5 text-center shadow-md min-w-[44px]">
                        <div className="text-gray-900 text-lg font-bold leading-none">{block.value}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">{block.label}</div>
                    </div>
                    {i < blocks.length - 1 && (
                        <span className="text-white font-bold text-lg">:</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

const CampingOffer = () => {
    const [deals, setDeals] = useState<FlashDeal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await apiClient.get("/api/products/flashdealsall");
            const json = res.data;
            if (json.success && Array.isArray(json.data)) {
                setDeals(json.data);
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
                <div className="h-7 w-52 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-80 bg-gray-100 rounded mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (deals.length === 0) return null;

    // Show first 2 deals as cards
    const displayDeals = deals.slice(0, 2);

    return (
        <section className="bg-white py-10">
            <div className="w-11/12 mx-auto">
                {/* Header — hardcoded as requested */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl xl:text-2xl font-semibold text-gray-900">
                            Camping offer&apos;s product
                        </h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Grab the top tech deals before they&apos;re gone
                        </p>
                    </div>
                    <Link
                        href="/dealer/camping-offers"
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap"
                    >
                        View All <FiChevronRight className="ml-1" />
                    </Link>
                </div>

                {/* Two large deal banner cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {displayDeals.map((deal) => (
                        <Link
                            key={deal.id}
                            href={`/dealer/camping-offers/${deal.slug}`}
                            className="group relative block rounded-2xl overflow-hidden bg-gray-900 shadow-lg"
                            style={{ minHeight: "400px" }}
                        >
                            {/* Deal banner image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={deal.banner}
                                    alt={deal.title}
                                    fill
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                {/* Gradient overlay at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            </div>

                            {/* Countdown timer pinned to bottom */}
                            <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                                <CountdownTimer endTimestamp={deal.date} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CampingOffer;