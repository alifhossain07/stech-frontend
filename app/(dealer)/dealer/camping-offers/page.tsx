"use client";

import React from "react";
import DealerProductListing from "@/components/Pages Dealer/DealerProductListing";

export default function DealerCampingOffersPage() {
    return (
        <DealerProductListing
            apiEndpoint="/api/dealer/camping-offers"
            bannerKey="camping_offer_banner"
            pageTitle="Camping Offer's Product"
            pageSubtitle="Grab the top tech deals before they're gone"
            badgeText="special offer"
        />
    );
}
