import React from "react";
import HelpCenter from "@/components/Pages Dealer/HelpCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help & Support | Sannai Dealer",
    description: "Get assistance and find answers to your questions about Sannai products and services.",
};

export default function HelpPage() {
    return (
        <HelpCenter />
    );
}
