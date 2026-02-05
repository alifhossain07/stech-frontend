"use client";

import React from "react";
import BestDealsListing from "@/components/Pages Dealer/BestDealsListing";

export default function DealerBestDealsPage() {
    return (
        <BestDealsListing
            apiEndpoint="/api/dealer/best-deals"
            bannerKey="best_deals_banner"
            pageTitle="Best Deals You Can't Miss"
            pageSubtitle="Grab amazing offers and unbeatable prices—limited time only"
            badgeText="30% off"
            badgeType="special-offer"
        />
    );
}
