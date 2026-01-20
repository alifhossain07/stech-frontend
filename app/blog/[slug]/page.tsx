"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogCard from "@/components/blog/BlogCard";
import "../blog.css";

interface BlogDetails {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    intro_para: string;
    description: string;
    banner: string;
    sidebar_poster: string;
    category: string;
    created_at?: string;
}

interface RecentBlog {
    id: number;
    title: string;
    slug: string;
    banner: string;
    created_at?: string;
}

export default function BlogDetailsPage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<BlogDetails | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
    const [similarBlogs, setSimilarBlogs] = useState<RecentBlog[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/blog-categories");
                const data = await res.json();
                if (data.result && data.categories) {
                    setCategories(data.categories.map((c: any) => c.category_name));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchBlogData() {
            setLoading(true);
            try {
                // Fetch blog details
                const detailRes = await fetch(`/api/blogs/${slug}`);
                const detailData = await detailRes.json();
                if (detailData.result && detailData.blog) {
                    setBlog(detailData.blog);
                }

                // Fetch recent blogs
                const recentRes = await fetch("/api/blogs/recent");
                const recentData = await recentRes.json();
                if (recentData.result && recentData.blogs) {
                    setRecentBlogs(recentData.blogs);
                }

                // Fetch similar blogs
                const similarRes = await fetch(`/api/blogs/similar/${slug}`);
                const similarData = await similarRes.json();
                if (similarData.result && similarData.blogs) {
                    setSimilarBlogs(similarData.blogs);
                }
            } catch (error) {
                console.error("Error fetching blog data:", error);
            } finally {
                setLoading(false);
            }
        }
        if (slug) fetchBlogData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pt-32">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pt-32">
                <p className="text-gray-500 text-lg">Blog not found.</p>
            </div>
        );
    }

    return (
        <>
            <main className="min-h-screen bg-white pt-20 pb-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Content */}
                        <div className="">
                            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden mb-8 shadow-xl">
                                <Image
                                    src={blog.banner}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-500 font-medium">
                                <span className="flex items-center text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {blog.category}
                                </span>
                                <span className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {blog.created_at
                                        ? new Date(blog.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "10 Sep 2025"}
                                </span>
                                <span className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Sannai Technology Team
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="prose max-w-none text-gray-700 leading-relaxed mb-12">
                                <div className="mb-8 font-base text-lg text-gray-600">
                                    {blog.intro_para}
                                </div>
                                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                    <div
                                        className="blog-content w-full lg:w-[70%] space-y-6"
                                        dangerouslySetInnerHTML={{ __html: blog.description }}
                                    />
                                    <div className="w-full lg:w-[30%]">
                                        <BlogSidebar
                                            categories={categories.length > 0 ? categories : [blog.category, "Mobile Bank", "Cables", "Fast Charger", "Earphone", "Headphone"]}
                                            recentBlogs={recentBlogs}
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Similar Blogs Section */}
                            <div className="mt-20">
                                <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center">
                                    <span className="w-2 h-8 bg-orange-500 mr-3 rounded-full"></span>
                                    Similar blogs
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {similarBlogs.length > 0 ? (
                                        similarBlogs.slice(0, 3).map((similar) => (
                                            <BlogCard
                                                key={similar.id}
                                                blog={{
                                                    ...similar,
                                                    short_description: "",
                                                    category: blog.category,
                                                }}
                                            />
                                        ))
                                    ) : (
                                        recentBlogs.slice(0, 3).map((similar) => (
                                            <BlogCard
                                                key={similar.id}
                                                blog={{
                                                    ...similar,
                                                    short_description: "",
                                                    category: blog.category,
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}

                    </div>
                </div>
            </main>
        </>
    );
}
