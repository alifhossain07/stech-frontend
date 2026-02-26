import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dealer Registration | Sannai Technology",
    description: "Apply to become an authorized dealer of Sannai Technology. Join our network and get access to premium mobile accessories at whole sale prices.",
};

export default function DealerRegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
