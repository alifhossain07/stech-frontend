"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
    id: number;
    title: string;
    slug: string;
    summary: string;
    banner: string;
    created_at: string;
}

export default function BlogListingContent() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("/api/blog");
                const result = await response.json();
                if (result.result) {
                    setBlogs(result.data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">Latest Blogs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={blog.banner || "/images/placeholder.jpg"}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}
                                </p>
                                <h2 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                                    {blog.title}
                                </h2>
                                <p className="text-gray-600 line-clamp-3 mb-4">{blog.summary}</p>
                                <span className="text-orange-500 font-semibold flex items-center gap-2">
                                    Read More
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
