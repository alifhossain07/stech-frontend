import React from "react";
import CompareContent from "./CompareContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Comparison | Sannai Technology Limited",
    description: "Compare your favorite Sannai Technology products side-by-side to find the perfect mobile accessories for your needs.",
};

export default function Page() {
    return <CompareContent />;
}
