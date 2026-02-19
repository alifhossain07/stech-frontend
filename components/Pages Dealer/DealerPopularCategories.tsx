"use client";

import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string;
    banner: string;
    cover_image: string;
};

const DealerPopularCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/categories");
                if (res.data?.success) {
                    setCategories(res.data.featuredCategories);
                }
            } catch (error) {
                console.log("Dealer category load error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="w-11/12 mx-auto pt-10 pb-[56px]">
            <div className="space-y-3 text-center">
                <h1 className="md:text-4xl text-2xl font-semibold">
                    Explore Our Category Product
                </h1>
                <p className="md:text-sm text-xs text-gray-500">
                    Find your preferred item in the highlighted product selection.
                </p>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                        <div
                            key={i}
                            className="h-44 xl:h-52 bg-gray-800 animate-pulse rounded-2xl"
                        />
                    ))}
                </div>
            )}

            {!loading && categories.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-8 w-11/12 mx-auto">
                    {categories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className="group relative flex flex-col overflow-hidden rounded-xl  bg-black cursor-pointer transition-all duration-300 hover:border-gray-500 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.07)]"
                        >
                            {/* Image area */}
                            <div className="flex-1 flex items-center justify-center p-5 pt-6 pb-3">
                                <Image
                                    src={cat.icon || "/images/placeholder.png"}
                                    alt={cat.name}
                                    width={120}
                                    height={120}
                                    className="w-20 xl:w-36 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Name label */}
                            <div className="border-t bg-white border-gray-700 px-3 py-2 text-center">
                                <span className="text-black text-[13px] xl:text-sm font-medium leading-tight">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DealerPopularCategories;
