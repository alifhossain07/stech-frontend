"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface LastViewedProduct {
    id: number;
    slug: string;
    name: string;
    thumbnail_image: string;
    has_discount: boolean;
    discount: string;
    stroked_price: string;
    main_price: string;
    rating: number;
    sales: number;
    is_wholesale: boolean;
    links: {
        details: string;
    };
}

interface Product {
    id: number;
    slug: string;
    name: string;
    image: string;
    price: number;
    oldPrice: number;
    discount: string | number;
}

const RecentlyViewed = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("sannai_auth_token");
        if (!token) {
            setLoading(false);
            return;
        }
        setHasToken(true);

        const fetchProducts = async () => {
            try {
                const res = await axios.get("/api/products/last-viewed", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data && res.data.success && Array.isArray(res.data.data)) {
                    const mappedProducts: Product[] = res.data.data.map((item: LastViewedProduct) => {
                        const parsePrice = (p: string) => {
                            const num = parseFloat(p.replace(/[^\d.]/g, ""));
                            return isNaN(num) ? 0 : num;
                        };

                        return {
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            image: item.thumbnail_image,
                            price: parsePrice(item.main_price),
                            oldPrice: parsePrice(item.stroked_price),
                            discount: item.discount,
                        };
                    });
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.error("Failed to load last viewed products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (!hasToken || (!loading && products.length === 0)) {
        return null;
    }

    if (loading) {
        return (
            <div className="xl:w-[20.5%] w-full bg-white rounded-2xl shadow-sm p-4 flex justify-center">
                <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="xl:w-[20.5%] w-full bg-white rounded-2xl shadow-sm h-fit">
            <h2 className="text-lg bg-[#f4f4f4] py-4 font-semibold text-center mb-4 rounded-t-2xl">
                Recently Viewed
            </h2>

            <div className="flex flex-col gap-3 px-2 pb-4">
                {products.map((item) => (
                    <Link
                        href={`/${item.slug}`}
                        key={item.id}
                        className="flex items-center gap-3 bg-[#f4f4f4] rounded-xl p-2 hover:shadow-md transition cursor-pointer"
                    >
                        <div className="w-16 h-16 flex-shrink-0 relative">
                            <Image
                                src={item.image || "/images/placeholder.png"}
                                alt={item.name}
                                fill
                                className="rounded-lg object-cover"
                            />
                        </div>

                        <div className="flex flex-col text-sm flex-1">
                            <p className="leading-tight text-gray-800 font-medium line-clamp-2">
                                {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-orange-500 font-semibold">
                                    ৳{item.price}
                                </span>
                                {item.discount && item.discount !== "-0%" && (
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-[1px] rounded-md font-semibold">
                                        {item.discount}
                                    </span>
                                )}
                                {item.oldPrice > item.price && (
                                    <span className="text-gray-400 line-through text-xs">
                                        ৳{item.oldPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
