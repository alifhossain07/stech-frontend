import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Latest Offers | Sannai Technology Limited",
    description: "Don't miss out on the latest deals and promotional offers from Sannai Technology. Save big on premium mobile accessories.",
};

export default function OffersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
