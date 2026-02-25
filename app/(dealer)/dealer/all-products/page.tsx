import React from "react";
import DealerAllProductsListing from "@/components/Pages Dealer/DealerAllProductsListing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Products | Dealer Portal",
    description: "Browse our full range of premium mobile accessories available for dealers.",
};

export default function DealerAllProductsPage() {
    return (
        <DealerAllProductsListing />
    );
}
