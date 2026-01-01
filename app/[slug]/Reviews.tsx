"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
  images: string[];
  avatar: string;
};

interface ApiReview {
  user_id: string | null;
  user_name: string;
  avatar: string;
  images: Array<{ path: string }>;
  rating: number;
  comment: string;
  time: string;
}

interface ReviewsProps {
  slug: string;
}

const Reviews = ({ slug }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reviews/product/${slug}`);

        if (!res.ok) {
          // Treat 404 as "no reviews" (e.g. product not found or no review resource yet)
          if (res.status === 404) {
            setError(null);
            setReviews([]);
            setTotalReviews(0);
            setLoading(false);
            return;
          }
          // Other HTTP errors are real failures
          setError(`Failed to fetch reviews (${res.status})`);
          setReviews([]);
          setTotalReviews(0);
          setLoading(false);
          return;
        }

        const json = await res.json();

        if (!json.success) {
          setError(json.error || "Failed to fetch reviews");
          setReviews([]);
          setTotalReviews(0);
          return;
        }

        // If data exists but is empty, show empty state without error
        if (!json.data || json.data.length === 0) {
          setError(null);
          setReviews([]);
          setTotalReviews(0);
          return;
        }

        // Map API response to component format
        const mappedReviews: Review[] = (json.data || []).map((review: ApiReview) => ({
          name: review.user_name || "Anonymous",
          date: review.time || "",
          rating: review.rating || 0,
          text: review.comment || "",
          images: review.images?.map((img) => img.path) || [],
          avatar: review.avatar || "",
        }));

        setReviews(mappedReviews);
        setTotalReviews(json.meta?.total || mappedReviews.length);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
        setReviews([]);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [slug]);

  return (
    <section className="w-full py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
            -Reviews ({totalReviews < 10 ? "0" : ""}{totalReviews})
          </h2>
          <p className="text-gray-600 text-sm mt-1 w-10/12 md:w-full">
            Get specific details about this product from customers who own it.
          </p>
        </div>

        <button className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md text-sm hover:bg-orange-50 transition">
          Write a Review
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading reviews...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          This product has no reviews yet. Be the first one to write a review.
        </div>
      )}

      {/* Review List */}
      {!loading && !error && reviews.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-300 bg-gray-50 rounded-md">
          {reviews.map((review, idx) => (
          <div key={idx} className="p-6">
            {/* Reviewer Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden bg-gray-100">
                {review.avatar ? (
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                    />
                  </svg>
                )}
              </div>

              <div>
                <p className="text-gray-900 font-medium">{review.name}</p>
                <p className="text-gray-500 text-sm">{review.date}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex text-orange-500 text-lg mb-2">
              {"★".repeat(review.rating)}
            </div>

            {/* Review Text */}
            <p className="text-gray-800 md:text-base text-sm mb-3">{review.text}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-3">
                {review.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setPreview(img)}
                    className="cursor-pointer hover:opacity-90 transition"
                  >
                    <Image
                      src={img}
                      alt="review image"
                      width={100}
                      height={100}
                      className="rounded-md object-cover border"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setPreview(null)}
        >
          <Image
            src={preview}
            alt="Preview"
            width={700}
            height={700}
            className="rounded-lg shadow-xl object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default Reviews;
