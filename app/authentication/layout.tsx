import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Authentication | Sannai Technology",
    description: "Verify the authenticity of your Sannai products. Use your activation code to ensure you have a genuine premium mobile accessory.",
};

export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
