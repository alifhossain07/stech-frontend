"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { FiSearch, FiArrowRight } from "react-icons/fi";


import apiClient from "@/app/lib/api-client";

interface DealerHeroData {
    banner_image: string;
    title: string;
    banner_link: string;
    subtitle: string;
    button_texts: string[];
    button_links: string[];
}

const DealerHero = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<DealerHeroData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await apiClient.get("/api/dealer/dealer-hero");
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Error loading dealer hero:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeroData();
    }, []);

    if (loading) {
        return <section className="w-full h-[600px] md:h-[700px] bg-black animate-pulse" />;
    }

    if (!data) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[700px] flex flex-col items-center justify-center text-center overflow-hidden bg-black pt-10 md:pt-12">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.banner_image}
                    alt="Dealer Hero Background"
                    fill
                    className="object-fill opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 md:w-11/12 2xl:max-w-6xl lg:max-w-5xl px-4 flex flex-col items-center gap-3">
                {/* Main Heading */}
                <h1 className="text-xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-white leading-tight">
                    {data.title}
                </h1>

                {/* Subheading */}
                <p className="text-gray-300 text-sm md:text-base max-w-2xl">
                    {data.subtitle}
                </p>

                {/* Search Bar */}
                <div className="relative w-full max-w-xl mt-4 group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search your favorite accessories"
                        className="w-full h-12  px-6 py-4 bg-white rounded-full text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-2xl"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 md:p-2 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                        aria-label="Search"
                    >
                        <FiSearch className="text-xl " />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                        onClick={() => window.open(data.button_links[0], "_blank")}
                        className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2 border border-white/30 rounded-full text-white bg-white/5 hover:bg-white/10 hover:border-white transition-all duration-300 group"
                    >
                        <span className="text-sm font-medium">{data.button_texts[0]}</span>

                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white group-hover:translate-x-0.5 transition-transform">
                            <FiArrowRight className="text-white text-xs" />
                        </span>
                    </button>

                    <button
                        onClick={() => window.open(data.button_links[1], "_blank")}
                        className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2 border border-white/30 rounded-full text-white bg-white/5 hover:bg-white/10 hover:border-white transition-all duration-300 group"
                    >
                        <span className="text-sm font-medium">{data.button_texts[1]}</span>

                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white group-hover:translate-x-0.5 transition-transform">
                            <FiArrowRight className="text-white text-xs" />
                        </span>
                    </button>
                </div>

            </div>

            {/* Decorative Bottom Fade */}

        </section>
    );
};

export default DealerHero;
