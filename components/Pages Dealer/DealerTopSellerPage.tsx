"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "@/app/lib/api-client";
import { FiChevronDown } from "react-icons/fi";

interface Dealer {
    id: number;
    rank: number;
    name: string;
    address: string;
    sales_summary: string | null;
    avatar: string;
    user_id: number;
    dealer_code: string;
    use_custom_image: boolean;
    is_featured: boolean;
}

interface Month {
    month: number;
    year: number;
    label: string;
    month_name: string;
}

interface RankingsData {
    month: {
        numeric: number;
        label: string;
        year: number;
        formatted: string;
    };
    winner: Dealer;
    dealers: Dealer[];
    available_months: Month[];
}

interface SetupData {
    title: string;
    subtitle: string;
    hero_image: string;
    footer: {
        title: string;
        description: string;
        highlights: string[];
    };
}

const DealerTopSellerPage = () => {
    const [setup, setSetup] = useState<SetupData | null>(null);
    const [rankings, setRankings] = useState<RankingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number } | null>(null);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsYearOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [setupRes, rankingsRes] = await Promise.all([
                    apiClient.get("/api/dealer/top-sellers/setup"),
                    apiClient.get("/api/dealer/top-sellers/rankings")
                ]);

                if (setupRes.data.success) {
                    setSetup(setupRes.data.data.data);
                }
                if (rankingsRes.data.success) {
                    setRankings(rankingsRes.data.data.data);
                    setSelectedMonth({
                        month: rankingsRes.data.data.data.month.numeric,
                        year: rankingsRes.data.data.data.month.year
                    });
                }
            } catch (error) {
                console.error("Error fetching top sellers data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleMonthChange = async (month: number, year: number) => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/dealer/top-sellers/rankings?month=${month}&year=${year}`);
            if (res.data.success) {
                setRankings(res.data.data.data);
                setSelectedMonth({ month, year });
            }
        } catch (error) {
            console.error("Error fetching filtered rankings:", error);
        } finally {
            setLoading(false);
            setIsYearOpen(false);
        }
    };

    if (loading && !setup) {
        return (
            <div className="w-11/12 mx-auto py-20 animate-pulse">
                <div className="h-20 bg-gray-200 rounded-md mb-8"></div>
                <div className="h-64 bg-gray-100 rounded-xl mb-12"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-t-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!setup || !rankings) return null;

    return (
        <div className=" min-h-screen">
            {/* 1. Hero Image Section */}
            <div className="w-11/12 max-w-[1440px] mx-auto pt-6">
                <div className="relative aspect-[16/6] md:aspect-[16/4] w-full rounded-xl overflow-hidden shadow-lg border-4 border-white">
                    <Image
                        src={setup.hero_image}
                        alt="Hero Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* 2. Black Header Section */}
            <div className="bg-black w-11/12 max-w-[1440px] mx-auto py-8 px-6 md:px-12 mt-6">
                <div className=" flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-medium text-white mb-2">
                            Top Seller <span className="text-yellow-400">Of the Month</span>
                        </h1>
                        <p className="text-white/70 text-sm md:text-base font-light">
                            {setup.subtitle}
                        </p>
                    </div>

                    {/* Month Filter */}
                    <div className="relative mt-4 md:mt-0" ref={dropdownRef}>
                        <button
                            onClick={() => setIsYearOpen(!isYearOpen)}
                            className="bg-transparent text-white px-5 py-2 rounded-lg flex items-center gap-3 border border-white/40 hover:bg-white/10 transition-colors"
                        >
                            <span className="text-sm">Month : {rankings.month.label}</span>
                            <FiChevronDown className={`transition-transform duration-300 ${isYearOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isYearOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-20">
                                {rankings.available_months.map((m, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleMonthChange(m.month, m.year)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 last:border-none transition-colors"
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Orange Body Section */}
            <div className="bg-[#FF6A00] w-11/12 max-w-[1440px] mx-auto pb-24">
                {/* Main Winner Focus (1st) */}
                <div className="flex flex-col items-center justify-center pt-24 pb-16 px-6">
                    <div className="relative">
                        <div className="w-44 h-44 md:w-48 md:h-48 rounded-full border-[6px] border-white/60 overflow-hidden shadow-2xl relative">
                            <Image
                                src={rankings.winner.avatar}
                                alt={rankings.winner.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* 1st Place Badge */}
                        <div className="absolute bottom-2 right-2 bg-[#FFD100] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-[3px] border-white shadow-xl text-lg font-bold">
                            1st
                        </div>
                    </div>

                    <div className="text-center mt-6 space-y-1">
                        <h2 className="text-2xl md:text-3xl font-medium text-white">
                            {rankings.winner.name}
                        </h2>
                        <p className="text-white/90 text-sm md:text-base font-medium">{rankings.winner.address}</p>
                        <div className="text-white font-medium text-lg md:text-xl pt-2">
                            {rankings.winner.sales_summary || "0+ Sales Products"}
                        </div>
                    </div>
                </div>

                {/* Arched Dealer Grid */}
                <div className="w-11/12 mx-auto px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-12">
                    {rankings.dealers.slice(1).map((dealer) => (
                        <div
                            key={dealer.id}
                            className="bg-white rounded-t-full pb-6 pt-4 px-2 shadow-lg flex flex-col items-center"
                        >
                            <div className="relative mb-4 flex justify-center w-full">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-[3px] border-gray-100 overflow-hidden relative bg-gray-50 uppercase shadow-inner">
                                    <Image
                                        src={dealer.avatar}
                                        alt={dealer.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {/* Rank Badge overlay on avatar */}
                                <div className="absolute bottom-0 right-1 md:right-2 bg-orange-400 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md text-[10px] md:text-xs font-bold">
                                    {dealer.rank}{dealer.rank === 2 ? 'nd' : dealer.rank === 3 ? 'rd' : 'th'}
                                </div>
                            </div>

                            <div className="text-center space-y-1 w-full px-1">
                                <h3 className="text-[10px] md:text-xs font-bold text-gray-900 truncate uppercase">
                                    {dealer.name}
                                </h3>
                                <p className="text-[9px] md:text-[10px] text-gray-500 truncate">{dealer.address}</p>
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-800 pt-1">
                                    {dealer.sales_summary || "0+ sales products"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Footer Highlights Section */}
            <div className=" py-8">
                <div className="w-11/12 max-w-[1440px] bg-[#f4f4f4] mx-auto  p-8 md:p-14  shadow-sm border border-gray-100">
                    <h2 className="text-2xl md:text-2xl font-medium  text-gray-900 mb-8 tracking-tight">
                        {setup.footer.title}
                    </h2>

                    <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                        {setup.footer.description.split('\r\n\r\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    <div className="mt-4">
                        <h4 className="font-extrabold text-gray-900 mb-4 text-lg">Highlights :</h4>
                        <div className="space-y-3">
                            {setup.footer.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-700 font-semibold">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerTopSellerPage;
