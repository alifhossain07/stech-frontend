"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DealerAllReviews from "@/components/Pages Dealer/DealerAllReviews";
import apiClient from "@/app/lib/api-client";
import { useAuth } from "@/app/context/AuthContext";

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

export default function AllReviewsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!user) return;

            try {
                const response = await apiClient.get("/api/dealer/all-reviews");
                if (response.data.success && response.data.data) {
                    setReviews(response.data.data.reviews || []);
                }
            } catch (error) {
                console.error("Fetch reviews error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchReviews();
        }
    }, [user]);

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner Section */}
            <div className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[#0047AB]"
                    style={{
                        backgroundImage: "url('/images/help-center.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.9
                    }}
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}

                <div className="relative text-center text-white px-4 md:px-0">
                    <h1 className="text-3xl md:text-3xl font-semibold mb-4 uppercase tracking-wider">
                        Our Trusted <br /> Dealer Customer Review
                    </h1>
                    <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                        Genuine feedback from our verified dealer partners.
                    </p>
                </div>
            </div>

            {/* Reviews Content */}
            <DealerAllReviews reviews={reviews} />
        </div>
    );
}
