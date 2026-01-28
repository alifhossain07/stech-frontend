"use client";

import React from "react";
import DealerProductListing from "@/components/Pages Dealer/DealerProductListing";

export default function DealerTopSellPage() {
    return (
        <DealerProductListing
            apiEndpoint="/api/dealer/top-sell"
            bannerKey="topsell_banner"
            pageTitle="Top Sell Products"
            pageSubtitle="Grab the top tech deals before they're gone"
            badgeType="top-sell"
        />
    );
}
