import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Reviews | Sannai Dealer",
    description: "Explore feedback and testimonials from our trusted dealer network across Bangladesh. See why partners choose Sannai.",
};

export default function DealerAllReviewsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
