"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiStar, FiCamera, FiX, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

interface ReviewImage {
    image: string; // base64
    filename: string;
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    productName: string;
    productImage: string;
    onSuccess?: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    productImage,
    onSuccess,
}: ReviewModalProps) {
    const { accessToken } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<ReviewImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleRatingClick = (val: number) => {
        setRating(val);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max size is 2MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [
                    ...prev,
                    {
                        image: reader.result as string,
                        filename: file.name,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!accessToken) {
            toast.error("You must be logged in to submit a review");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    rating,
                    comment,
                    images,
                }),
            });

            const data = await response.json();

            if (data.success || response.ok) {
                toast.success("Review submitted successfully!");
                onSuccess?.();
                onClose();
                // Reset state
                setComment("");
                setRating(5);
                setImages([]);
            } else {
                toast.error(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-[20001] w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="text-xl text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <Image
                                src={productImage}
                                alt={productName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{productName}</p>
                            <p className="text-sm text-gray-500">ID: {productId}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-3">Overall Rating</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleRatingClick(val)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <FiStar
                                        className={`w-10 h-10 ${val <= rating
                                            ? "fill-orange-400 text-orange-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike?"
                            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all outline-none text-gray-700"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Add Photos</label>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                                >
                                    <Image
                                        src={img.image}
                                        alt="Review"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all bg-gray-50"
                                >
                                    <FiCamera size={24} />
                                    <span className="text-[10px] mt-1">Upload</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <p className="text-[10px] text-gray-400">Up to 5 images, max 2MB each.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex gap-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <FiLoader className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
