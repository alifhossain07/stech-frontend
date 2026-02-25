import React from "react";
import TrackOrderContent from "./TrackOrderContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Track Your Order | Sannai Technology Limited",
    description: "Easily track your order status and shipping progress from Sannai Technology using your order code.",
};

export default function TrackOrderPage() {
    return <TrackOrderContent />;
}
