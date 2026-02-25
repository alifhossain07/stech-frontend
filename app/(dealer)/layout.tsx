"use client";

import React from "react";

export default function DealerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dealer-layout">
            {/* Dealers can have specific layouts or sidebars here if needed */}
            <main className="min-h-screen">{children}</main>
        </div>
    );
}
