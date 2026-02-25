import React from "react";
import BlogListingContent from "./BlogListingContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Sannai Technology Limited",
    description: "Stay updated with the latest trends, news, and tips about mobile accessories from Sannai Technology.",
};

export default function BlogPage() {
    return <BlogListingContent />;
}
