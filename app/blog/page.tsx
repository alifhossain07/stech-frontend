"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
// import BlogSidebar from "@/components/blog/BlogSidebar";
import "./blog.css";



interface Blog {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    banner: string;
    category: string;
    created_at?: string;
}

export default function BlogListing() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {
        async function fetchBlogs() {
            setLoading(true);
            try {
                const url = category
                    ? `/api/blog-categories/${category}`
                    : "/api/blogs";
                const res = await fetch(url);
                const data = await res.json();

                if (data.result) {
                    if (category) {
                        setBlogs(data.blogs?.data || []);
                    } else {
                        setBlogs(data.blogs?.data || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, [category]);

    return (
        <>
            <main className="min-h-screen bg-gray-50 pt-24 pb-20">
                <div className="w-9/12 mx-auto px-4">
                    <div className="">
                        {/* Main Content */}
                        <div className="">
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                    {category ? category.replace(/-/g, ' ') : "Explore Our Blog"}
                                </h1>
                                <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-2xl h-[450px] animate-pulse"
                                        ></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {blogs.map((blog) => (
                                        <BlogCard key={blog.id} blog={blog} />
                                    ))}
                                </div>
                            )}

                            {!loading && blogs.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-500 text-lg font-medium">No blogs found in this category.</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        {/* <div className="lg:w-1/4">
                            <BlogSidebar
                                categories={categories.map(c => c.category_name)}
                                recentBlogs={[]} // Will fetch in separate call if needed or pass from here
                            />
                        </div> */}
                    </div>

                    {!loading && blogs.length > 0 && (
                        <div className="mt-12 flex justify-center space-x-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all">
                                &lsaquo;
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-orange-500 bg-orange-500 text-white transition-all">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-all">
                                &rsaquo;
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
