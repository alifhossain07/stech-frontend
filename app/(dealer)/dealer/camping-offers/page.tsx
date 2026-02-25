import React from "react";
import DealerCampingOffersList from "@/components/Pages Dealer/DealerCampingOffersList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Camping Offers | Dealer Portal",
    description: "Exclusive camping offers and bundles for our authorized dealers.",
};

export default function DealerCampingOffersPage() {
    return <DealerCampingOffersList />;
}
