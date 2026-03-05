import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Warranty | Sannai Technology Limited",
    description: "Warranty history is now available inside the Product Authentication page.",
};

export default function ProductWarrantyPage() {
    redirect("/authentication?tab=warranty");
}
