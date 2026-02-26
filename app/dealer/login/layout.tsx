import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dealer Login | Sannai Technology Limited",
    description: "Login to the Sannai Dealer Dashboard to manage your orders, view exclusive pricing, and access dealer-only resources.",
};

export default function DealerLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
