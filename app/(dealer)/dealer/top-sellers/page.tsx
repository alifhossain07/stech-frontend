import DealerTopSellerPage from "@/components/Pages Dealer/DealerTopSellerPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Top Seller Rankings | Sannai Technology",
    description: "View our top-performing dealers of the month.",
};

export default function Page() {
    return <DealerTopSellerPage />;
}
