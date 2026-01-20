import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
    blog: {
        id: number;
        title: string;
        slug: string;
        short_description: string;
        banner: string;
        category: string;
        created_at?: string;
    };
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const formattedDate = blog.created_at
        ? new Date(blog.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "10 Sep 2025";

    return (
        <div className="blog-card bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href={`/blog/${blog.slug}`} className="block relative h-72 w-full">
                <Image
                    src={blog.banner}
                    alt={blog.title}
                    fill
                    className="object-contain"
                />
                {/* <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    {blog.category}
                </div> */}
            </Link>
            <div className="p-3">
                <div className="flex items-center justify-between text-gray-500 text-xs mb-3 space-x-4">
                    <span className="flex items-center">
                        <svg
                            className="w-4 h-4 mr-1"
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
                    <span className="flex items-center">
                        <svg
                            className="w-4 h-4 mr-1"
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
                        {formattedDate}
                    </span>
                </div>
                <h3 className="text-xl font-semibold tracking-wide mb-1 line-clamp-2 hover:text-orange-500 transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {blog.short_description}
                </p>
                <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-block bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                >
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
