import React from "react";
import Link from "next/link";
import Image from "next/image";

interface RecentBlog {
    id: number;
    title: string;
    slug: string;
    banner: string;
    created_at?: string;
}

interface BlogSidebarProps {
    categories: string[];
    recentBlogs: RecentBlog[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ categories, recentBlogs }) => {
    return (
        <aside className="blog-sidebar space-y-8">
            {/* Search Widget */}
            <div className="bg-gray-50 p-6 rounded-2xl">

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Your Keyword"
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Categories Widget */}
            <div className=" rounded-2xl">
                <h4 className="text-lg font-bold border-b-2 border-gray-400 pb-2 mb-4 flex items-center">
                    <span className="w-1 h-6  bg-orange-500 mr-2 rounded-full"></span>
                    Blog Category
                </h4>
                <ul className="space-y-3">
                    {categories.map((cat, index) => (
                        <li key={index}>
                            <Link
                                href={`/blog?category=${cat}`}
                                className="block bg-gray-100 p-3 rounded-xl border border-gray-100 hover:border-orange-500 hover:text-orange-500 transition-all text-sm font-medium text-gray-700"
                            >
                                {cat}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-gray-50 p-4 rounded-2xl">
                <h4 className="text-lg border-b-2 border-gray-200 pb-2 font-bold mb-4 flex items-center">
                    <span className="w-1 h-6 bg-orange-500 mr-2 rounded-full"></span>
                    Recent Blog Post
                </h4>
                <div className="space-y-4">
                    {recentBlogs.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="flex items-center space-x-4 group"
                        >
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={post.banner}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold line-clamp-2 group-hover:text-orange-500 transition-colors">
                                    {post.title}
                                </h5>
                                <span className="text-[10px] text-gray-400">
                                    {post.created_at
                                        ? new Date(post.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "10 Sep 2025"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Promotion Widget */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group">
                <Image
                    src="http://sannai.test/public/uploads/all/OnIRXwdKdTrOm9D5Hw4Xwg8k61XW0n9wlnGhFH3P.webp"
                    alt="Promotion"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-white text-3xl font-bold leading-tight">
                        TUNE YOUR STYLE
                    </h3>
                    <p className="text-white/80 text-sm mt-2 mb-4">
                        EXPERIENCE SUPERB SOUND
                    </p>
                    <button className="bg-orange-500 text-white rounded-full py-3 px-6 text-sm font-bold w-full uppercase tracking-wider hover:bg-white hover:text-orange-500 transition-all">
                        Order Now
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default BlogSidebar;
