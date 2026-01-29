"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

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

interface DealerAllReviewsProps {
    reviews: Review[];
}

const DealerAllReviews = ({ reviews }: DealerAllReviewsProps) => {
    if (!reviews || !Array.isArray(reviews)) {
        return (
            <div className="w-11/12 mx-auto py-20 text-center">
                <p className="text-gray-500">No reviews found or error loading reviews.</p>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-3"
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
                                    <h3 className="font-bold text-[#111111] text-[15px] leading-tight mb-0.5">
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
                            <h4 className="font-bold text-[#111111] text-[15px]">{review.title}</h4>
                            <p className="text-[#444444] text-[12px] leading-[1.6] line-clamp-3">
                                {review.description}
                            </p>
                        </div>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2.5 mt-2">
                                {review.images.map((img, idx) => (
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
    );
};

export default DealerAllReviews;
