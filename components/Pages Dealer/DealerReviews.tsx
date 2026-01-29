"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import apiClient from "@/app/lib/api-client";

interface Review {
    id: number;
    dealer_name: string;
    dealer_business_name: string;
    review_type: string;
    product_name: string | null;
    rating: number;
    title: string;
    description: string;
    images: string[];
    status: string;
    is_admin_created: boolean;
    date: string;
    created_at: string;
}

const DealerReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get("/api/dealer/all-reviews");
                if (response.data.success && response.data.data) {
                    setReviews(response.data.data.reviews?.slice(0, 5) || []);
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

    if (reviews.length === 0) return null;

    // Double the reviews for seamless loop
    const doubledReviews = [...reviews, ...reviews, ...reviews, ...reviews];

    return (
        <section className="bg-gray-50 w-11/12 mx-auto py-16 overflow-hidden">
            <div className="">
                <div className="flex justify-between items-center xl:items-end mb-10">
                    <div>
                        <h2 className="xl:text-3xl text-xl font-medium text-gray-900">
                            Our Trusted Dealer Customer Review
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">Genuine feedback from our verified dealer partners.</p>
                    </div>
                    <Link
                        href="/dealer/all-reviews"
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-1"
                    >
                        View All Reviews <FiChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            <div className="relative">
                <div className="flex w-max animate-marquee items-stretch">
                    {doubledReviews.map((review, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 border border-black w-[350px] md:w-[450px] mx-4 bg-white p-5 rounded-[20px] shadow-sm  flex flex-col gap-3"
                        >
                            {/* User Info */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                review.dealer_name
                                            )}&background=random`}
                                            alt={review.dealer_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[#111111] text-[15px] leading-tight mb-0.5">
                                            {review.dealer_name}
                                        </h3>
                                        <p className="text-[#666666] text-[12px] leading-none mb-1">
                                            {review.dealer_business_name}
                                        </p>
                                        <p className="text-[#999999] text-[11px] leading-none font-normal">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5 pt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            size={14}
                                            className={`${i < review.rating
                                                ? "text-[#FF9900]"
                                                : "text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Review Title & Content */}
                            <div className="flex flex-col gap-1.5 mt-1">
                                <h4 className="font-semibold text-[#111111] text-[15px]">{review.title}</h4>
                                <p className="text-gray-900 text-[12px] leading-[1.6] line-clamp-3">
                                    {review.description}
                                </p>
                            </div>

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2.5 mt-2">
                                    {review.images.slice(0, 2).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-[70px] h-[70px] rounded-lg overflow-hidden border border-gray-100"
                                        >
                                            <Image
                                                src={img}
                                                alt={`Review image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealerReviews;
