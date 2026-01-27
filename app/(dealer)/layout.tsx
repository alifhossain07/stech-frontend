"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DealerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const isDealer = user?.type?.toLowerCase() === "dealer";
        if (!loading && (!user || !isDealer)) {
            router.push("/dealer/login");
        }
    }, [user, loading, router]);

    const isDealer = user?.type?.toLowerCase() === "dealer";

    if (loading || !user || !isDealer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="dealer-layout">
            {/* Dealers can have specific layouts or sidebars here if needed */}
            <main className="min-h-screen">{children}</main>
        </div>
    );
}
