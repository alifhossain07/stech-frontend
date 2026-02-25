import React from "react";
import ProductWarrantyContent from "./ProductWarrantyContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Warranty | Sannai Technology Limited",
    description: "Check your product warranty status or submit a warranty claim for your Sannai Technology products.",
};

export default function ProductWarrantyPage() {
    return <ProductWarrantyContent />;
}
