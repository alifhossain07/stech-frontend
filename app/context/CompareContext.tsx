"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Based on the user provided API response and requirements
export type CompareItem = {
    id: number;
    slug: string;
    name: string;
    image: string;
    main_price: string; // "৳2,500.00"
    stroked_price: string; // "৳2,500.00"
    has_discount: boolean;
    discount: string; // "-0%"
    rating: number; // 0
    reviewCount?: number; // 0
    status?: string; // "In Stock" (derived from current_stock > 0)
    compare_specifications: string; // "True Wireless\r\n\r\nStereo Sound..."
    // Other fields potentially needed for the UI rows if they are not in compare_specifications
    brand?: { name: string };
    model_number?: string;
    other_features?: string;
    warranty?: string; // derived or from description?
};

type CompareContextType = {
    compareList: CompareItem[];
    addToCompare: (item: CompareItem) => void;
    removeFromCompare: (id: number) => void;
    isInCompare: (id: number) => boolean;
    clearCompare: () => void;
};

const CompareContext = createContext<CompareContextType | null>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
    const [compareList, setCompareList] = useState<CompareItem[]>([]);

    // Load from local storage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("compareList");
            if (saved) {
                setCompareList(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to load compare list", error);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem("compareList", JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (item: CompareItem) => {
        if (compareList.length >= 3) { // Limit to 3 items for display sanity, or maybe 4 based on UI space
            toast.error("You can only compare up to 3 products at a time.");
            return;
        }

        const exists = compareList.find((i) => i.id === item.id);
        if (exists) {
            toast("This product is already in your comparison list.", {
                icon: "ℹ️",
            });
            return;
        }

        setCompareList((prev) => [...prev, item]);
        toast.success("Added to comparison!");
    };

    const removeFromCompare = (id: number) => {
        setCompareList((prev) => prev.filter((i) => i.id !== id));
        toast.success("Removed from comparison.");
    };

    const isInCompare = (id: number) => {
        return compareList.some((i) => i.id === id);
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
};
