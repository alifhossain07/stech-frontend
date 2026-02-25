import React from "react";
import TodaysOfferListing from "@/components/Pages Dealer/TodaysOfferListing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Today's Special Offers | Sannai Dealer",
    description: "Check out our exclusive deals and offers available only for today.",
};

export default function TodaysOfferPage() {
    return (
        <TodaysOfferListing />
    );
}
