"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/app/lib/api-client";
import ProductCard from "@/components/ui/ProductCard";
import { FiClock, FiArrowLeft } from "react-icons/fi";

interface Spec {
    icon: string;
    text: string;
}

interface Product {
    id: number;
    slug: string;
    image: string;
    name: string;
    price: number;
    oldPrice: number;
    discount: string | number;
    rating: number | string;
    reviews: number | string;
    featured_specs?: Spec[];
}

interface FlashDeal {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    banner: string;
    date: number; // Unix timestamp
    countdown_timer: string;
    products: {
        data: {
            id: number;
            name: string;
            slug: string;
            main_price: string;
            stroked_price: string;
            discount: string;
            rating: number;
            sales: number;
            thumbnail_image: string;
            featured_specs: Spec[];
        }[];
    };
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

const CountdownBlock = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 md:p-3 min-w-[55px] md:min-w-[70px] text-center border border-white/30">
        <div className="text-lg md:text-xl font-bold text-white leading-none">{value}</div>
        <div className="text-[9px] md:text-[10px] text-white/80 font-medium uppercase mt-1">{label}</div>
    </div>
);

export default function CampingOfferDetails() {
    const params = useParams();
    const slug = params.slug as string;

    const [offer, setOffer] = useState<FlashDeal | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const fetchData = useCallback(async () => {
        try {
            const res = await apiClient.get(`/api/dealer/camping-offers?slug=${slug}`);
            if (res.data.success && res.data.data) {
                const dealData = res.data.data;
                setOffer(dealData);

                // Map products
                const mappedProducts: Product[] = dealData.products.data.map((p: {
                    id: number;
                    name: string;
                    slug: string;
                    main_price: string;
                    stroked_price: string;
                    discount: string;
                    rating: number;
                    sales: number;
                    thumbnail_image: string;
                    featured_specs: Spec[];
                }) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: parseFloat(p.main_price.replace("৳", "").replace(",", "")),
                    oldPrice: parseFloat(p.stroked_price.replace("৳", "").replace(",", "")),
                    discount: p.discount,
                    rating: p.rating,
                    reviews: p.sales || 0,
                    image: p.thumbnail_image,
                    featured_specs: p.featured_specs || [],
                }));
                setProducts(mappedProducts);
                setTimeLeft(getTimeLeft(dealData.date));
            }
        } catch (error) {
            console.error("Error fetching offer details:", error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!offer) return;
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(offer.date));
        }, 1000);
        return () => clearInterval(interval);
    }, [offer]);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse">
                <div className="h-[300px] md:h-[400px] bg-gray-200 rounded-3xl mb-12" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h2>
                <Link href="/dealer/camping-offers" className="text-orange-500 hover:underline flex items-center gap-2">
                    <FiArrowLeft /> Back to Camping Offers
                </Link>
            </div>
        );
    }

    const hasTimer = offer.countdown_timer !== "0";

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Landing Banner Section */}
            <div className="relative h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden">
                <Image
                    src={offer.banner}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 flex items-center">
                    <div className="w-11/12 mx-auto">
                        <Link
                            href="/dealer/camping-offers"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm md:text-base"
                        >
                            <FiArrowLeft /> Back to all offers
                        </Link>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                                {offer.title}
                            </h1>
                            <p className="text-white/90 text-sm md:text-xl font-medium mb-8 max-w-2xl">
                                {offer.subtitle}
                            </p>

                            {hasTimer && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-white font-bold text-xs md:text-sm tracking-widest">
                                        <FiClock /> ENDS IN
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <CountdownBlock label="Days" value={pad(timeLeft.days)} />
                                        <CountdownBlock label="Hrs" value={pad(timeLeft.hours)} />
                                        <CountdownBlock label="Min" value={pad(timeLeft.minutes)} />
                                        <CountdownBlock label="Sec" value={pad(timeLeft.seconds)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="w-11/12 mx-auto -mt-10 md:-mt-16 relative z-10">
                <div className="bg-white rounded-t-3xl p-6 md:p-10 shadow-xl shadow-black/5 min-h-[500px]">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                            Offer Products <span className="text-gray-400 font-normal ml-2">({products.length})</span>
                        </h2>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 justify-items-center">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No products found for this offer.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
