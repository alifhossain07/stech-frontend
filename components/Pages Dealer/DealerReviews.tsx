"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import apiClient from "@/app/lib/api-client";

const DealerReviews = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get("/api/dealer-reviews");
                const json = response.data;
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Error fetching dealer reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
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
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[400px] h-[250px] bg-gray-100 rounded-2xl border border-gray-200"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data || !data.reviews || data.reviews.length === 0) return null;

    // Double the reviews for seamless loop
    const doubledReviews = [...data.reviews, ...data.reviews, ...data.reviews];

    return (
        <section className="bg-gray-50 py-16 overflow-hidden">
            <div className="w-11/12 mx-auto">
                <div className="flex justify-between items-center xl:items-end mb-10">
                    <div>
                        <h2 className="xl:text-3xl text-xl font-bold text-gray-900">
                            {data.title}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">{data.subtitle}</p>
                    </div>
                    <Link
                        href="/reviews"
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-1"
                    >
                        View All Reviews <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            <div className="relative w-11/12 mx-auto">
                <div className="flex animate-marquee items-stretch">
                    {doubledReviews.map((review, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[350px] md:w-[450px] mx-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-50 bg-gray-50">
                                        <Image
                                            src={review.profile_pic}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                                        <p className="text-sm text-gray-500">{review.shop_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`w-4 h-4 ${i < parseInt(review.rating)
                                                ? "text-orange-400"
                                                : "text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                                "{review.description}"
                            </p>

                            <div className="mt-auto">
                                {review.images && review.images.length > 0 && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                                        <Image
                                            src={review.images[0]}
                                            alt="Review product"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealerReviews;
