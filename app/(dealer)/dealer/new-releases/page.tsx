import NewReleasedProductsListing from "@/components/Pages Dealer/NewReleasedProductsListing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Released Products | Sannai Dealer",
    description: "View the latest products released specially for Sannai dealers.",
};

export default function NewReleasesPage() {
    return (
        <main>
            <NewReleasedProductsListing />
        </main>
    );
}
