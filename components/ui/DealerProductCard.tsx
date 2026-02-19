"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

interface Spec {
    icon: string;
    text: string;
}

interface Product {
    id: number | string;
    slug: string;
    image: string;
    name: string;
    price?: number;
    oldPrice?: number;
    discount?: string | number;
    rating: number | string;
    reviews: number | string;
    model_number?: string;
    featured_spec?: Spec;
    description?: string;
    badgeText?: string;
    badgeType?: "new-arrival" | "top-sell" | "special-offer" | "upcoming";
    dealer_short_description?: string;
    dealer_featured_specs?: Spec[];
}

export default function DealerProductCard({ product }: { product: Product }) {
    const { setSelectedItems } = useCart();
    const { user } = useAuth();
    const isDealer = user?.type?.toLowerCase() === "dealer";
    const router = useRouter();
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

    useEffect(() => {
        const fetchWhatsappNumber = async () => {
            try {
                const res = await fetch("/api/business-settings", { cache: "no-store" });
                const json = await res.json();
                if (json.success && json.data) {
                    const whatsappSetting = json.data.find(
                        (setting: { type: string; value: string }) => setting.type === "whatsapp_number"
                    );
                    if (whatsappSetting?.value) {
                        setWhatsappNumber(whatsappSetting.value);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch WhatsApp number:", error);
            }
        };
        fetchWhatsappNumber();
    }, []);

    const handleProductClick = () => {
        if (typeof window !== "undefined") {
            const item = {
                item_id: product.id.toString(),
                item_name: product.name,
                item_brand: "",
                item_category: "",
                price: 0,
                item_variant: "",
            };

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "select_item",
                ecommerce: {
                    items: [item],
                },
            });
        }
    };

    const displayModel = product.model_number || "ULT WH-ULT900N";

    // Prefer dealer_featured_specs[0] over featured_spec
    const displaySpec = (product.dealer_featured_specs && product.dealer_featured_specs.length > 0)
        ? product.dealer_featured_specs[0]
        : product.featured_spec || { icon: "/images/watt.png", text: "25 Watt" };

    // Prefer dealer_short_description over description
    const displayDescription = product.dealer_short_description ||
        product.description ||
        "Experience exceptional audio clarity with Sannai Wired Earphones, designed for comfort and durability.";

    const displayBadge = product.badgeText || (product.badgeType === "top-sell" ? "top sell" : "New Arrival");

    return (
        <div className="relative w-full max-w-[350px] rounded-lg shadow-md border border-gray-200 flex flex-col bg-white">
            {/* ORIGINAL IMAGE AREA DESIGN */}
            <Link
                href={`/${product.slug}`}
                onClick={handleProductClick}
                className="relative bg-gray-50 aspect-[4/3] rounded-md flex items-center justify-center overflow-hidden"
            >
                <span
                    className={`absolute top-1.5 left-1.5 z-20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${product.badgeType === "top-sell" ? "bg-green-600 text-white" : "bg-[#FF6B01] text-white"
                        }`}
                >
                    {product.badgeType === "top-sell" && <FaStar className="w-2.5 h-2.5" />}
                    {displayBadge}
                </span>

                <div className="relative w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <div className="absolute bottom-1.5 left-1.5 bg-white px-1.5 py-0.5 rounded-md flex items-center text-[10px] shadow-sm">
                    <span className="font-semibold text-gray-900 mr-1">{product.rating}</span>
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-500">{product.reviews}</span>
                </div>
            </Link>

            <div className="p-2 flex flex-col flex-grow">
                {/* ORIGINAL TITLE DESIGN */}
                <Link href={`/${product.slug}`} onClick={handleProductClick}>
                    <h1 className=" 2xl:text-base text-sm mb-2 hover:text-orange-600 cursor-pointer hover:underline duration-300 font-semibold line-clamp-2 h-[45px]">
                        {product.name}
                    </h1>
                </Link>

                {/* MODIFIED DEALER SECTION */}
                <div className="flex flex-col flex-grow">
                    {/* Model Number */}
                    <p className="text-[10px] text-gray-500 mb-2">Model : {displayModel}</p>

                    {/* Orange Spec Block */}
                    <div className="flex items-center gap-2 bg-[#FFF3EB] p-2 rounded-md border border-[#FFE4D3] mb-3">
                        <div className="w-4 h-4 relative shrink-0">
                            <Image src={displaySpec.icon} alt="" fill className="object-contain" />
                        </div>
                        <span className="text-xs font-bold text-[#FF6B01]">{displaySpec.text}</span>
                    </div>

                    {/* Description Block */}
                    <div
                        className="text-[10px] text-gray-600 leading-tight mb-4 line-clamp-2 h-[32px] overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: displayDescription }}
                    />
                </div>

                {/* ORIGINAL BUTTON ROW DESIGN (Dealer Mode) */}
                <div className="flex gap-2 mt-auto h-[30px] md:h-[36px]">
                    <Link
                        href={`/${product.slug}`}
                        onClick={handleProductClick}
                        className="flex items-center justify-center w-1/2 rounded-md border border-black text-black md:text-sm text-[10px] duration-300 hover:bg-black hover:text-white"
                    >
                        <span className="block md:hidden">Details</span>
                        <span className="hidden md:block">More Details</span>
                    </Link>

                    <a
                        href={
                            whatsappNumber
                                ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hello, I'm interested in the product: ${product.name}. Link: ${typeof window !== "undefined" ? window.location.origin + "/" + product.slug : ""
                                    }`
                                )}`
                                : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-1/2 rounded-md text-white md:text-sm text-[10px] bg-orange-500 hover:bg-orange-400 transition-colors gap-1 font-medium"
                    >
                        <span className="block md:hidden">Get Price</span>
                        <span className="hidden md:block">Get a best price</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
