
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-hot-toast";
import { FiPackage, FiAlertCircle, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

// Types
type ActivatedProduct = {
    product_serial_id: number;
    serial: string;
    barcode: string;
    serial_status: string;
    product: {
        id: number;
        name: string;
        thumbnail: string;
        warranty_days: number;
    };
    activation: {
        activated_at: string;
        expires_at: string;
        status: string;
        is_expired: boolean;
    };
};

type WarrantyClaim = {
    id: number;
    claim_id?: number; // Adjust based on API response
    status: string;
    claimed_at: string;
    issue_description: string;
    serial: string;
    product: {
        name: string;
        thumbnail?: string;
    };
    admin_note?: string;
};

// Main Component
export default function WarrantyDashboardPage() {
    const { user, loading, accessToken } = useAuth();
    const [activeTab, setActiveTab] = useState<"activated" | "claims">("activated");

    const [activatedProducts, setActivatedProducts] = useState<ActivatedProduct[]>([]);
    const [claims, setClaims] = useState<WarrantyClaim[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Claim Modal State
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [selectedProductForClaim, setSelectedProductForClaim] = useState<ActivatedProduct | null>(null);
    const [claimDescription, setClaimDescription] = useState("");
    const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            fetchData();
        }
    }, [user, loading]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const headers: Record<string, string> = {};
            if (accessToken) {
                headers["Authorization"] = `Bearer ${accessToken}`;
            }

            // Fetch Activated Products
            const resActivated = await fetch("/api/warranty/activated-products", {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: user?.phone })
            });
            const jsonActivated = await resActivated.json();
            if (jsonActivated.result) {
                setActivatedProducts(jsonActivated.data);
            }

            // Fetch Claims
            const resClaims = await fetch("/api/warranty/my-claims", {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: user?.phone })
            });
            const jsonClaims = await resClaims.json();
            if (jsonClaims.result) {
                setClaims(jsonClaims.data);
            }

        } catch (error) {
            console.error("Failed to fetch warranty data", error);
            toast.error("Failed to load warranty information");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenClaimModal = (product: ActivatedProduct) => {
        setSelectedProductForClaim(product);
        setClaimDescription("");
        setShowClaimModal(true);
    };

    const handleSubmitClaim = async () => {
        if (!selectedProductForClaim) return;
        if (!claimDescription.trim()) {
            toast.error("Please describe the issue");
            return;
        }

        setIsSubmittingClaim(true);
        try {
            const res = await fetch("/api/warranty/claim", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
                },
                body: JSON.stringify({
                    code: selectedProductForClaim.serial,
                    phone: user?.phone,
                    name: user?.name,
                    email: user?.email,
                    address: "",
                    issue_description: claimDescription
                })
            });
            const json = await res.json();

            if (json.result) {
                toast.success(json.message || "Claim submitted successfully");
                setShowClaimModal(false);
                fetchData(); // Refresh data
            } else {
                toast.error(json.message || "Failed to submit claim");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsSubmittingClaim(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active": return "text-green-600 bg-green-50 border-green-200";
            case "expired": return "text-red-600 bg-red-50 border-red-200";
            case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "approved": return "text-blue-600 bg-blue-50 border-blue-200";
            case "rejected": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Warranty & Authentication</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab("activated")}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "activated"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Activated Products
                </button>
                <button
                    onClick={() => setActiveTab("claims")}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "claims"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    My Claims
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">Loading data...</div>
            ) : (
                <>
                    {/* ACTIVATED PRODUCTS TAB */}
                    {activeTab === "activated" && (
                        <div className="grid gap-4">
                            {activatedProducts.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                                    <FiPackage className="mx-auto text-4xl mb-2 opacity-50" />
                                    No activated products found.
                                </div>
                            ) : (
                                activatedProducts.map((item) => (
                                    <div key={item.product_serial_id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm hover:shadow-md transition">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                            <Image
                                                src={item.product?.thumbnail || "/images/placeholder.jpg"}
                                                alt={item.product?.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-800">{item.product?.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(item.activation.is_expired ? 'expired' : item.activation.status)}`}>
                                                    {item.activation.is_expired ? 'Expired' : item.activation.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">Serial: <span className="font-mono text-gray-700">{item.serial}</span></p>
                                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <FiCheckCircle /> Activated: {new Date(item.activation.activated_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FiAlertCircle /> Expires: {new Date(item.activation.expires_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div>
                                            {(!item.activation.is_expired) && (
                                                <button
                                                    onClick={() => handleOpenClaimModal(item)}
                                                    className="px-4 py-2 bg-orange-100 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-200 transition"
                                                >
                                                    Claim Warranty
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* CLAIMS TAB */}
                    {activeTab === "claims" && (
                        <div className="grid gap-4">
                            {claims.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                                    <FiAlertCircle className="mx-auto text-4xl mb-2 opacity-50" />
                                    No warranty claims found.
                                </div>
                            ) : (
                                claims.map((claim) => (
                                    <div key={claim.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition">
                                        <div className="w-full flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg mb-1">{claim.product?.name}</h3>
                                                <p className="text-sm text-gray-500">Serial: {claim.serial}</p>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(claim.status)}`}>
                                                {claim.status}
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-50 p-3 rounded-md">
                                            <p className="text-sm text-gray-700"><span className="font-semibold">Issue:</span> {claim.issue_description}</p>
                                            {claim.admin_note && (
                                                <p className="text-sm text-red-500 mt-2 pt-2 border-t border-gray-200">
                                                    <span className="font-semibold">Note:</span> {claim.admin_note}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <FiClock /> Claimed on {new Date(claim.claimed_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* CLAIM MODAL */}
            {showClaimModal && selectedProductForClaim && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 relative animate-[scaleIn_0.2s_ease-out]">
                        <button
                            onClick={() => setShowClaimModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiXCircle size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Claim Warranty</h2>

                        <div className="mb-4 bg-gray-50 p-3 rounded-lg flex gap-3">
                            <div className="w-12 h-12 bg-white rounded overflow-hidden relative border border-gray-200">
                                <Image
                                    src={selectedProductForClaim.product?.thumbnail || "/images/placeholder.jpg"}
                                    alt={selectedProductForClaim.product?.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{selectedProductForClaim.product?.name}</p>
                                <p className="text-xs text-gray-500">SN: {selectedProductForClaim.serial}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Description
                            </label>
                            <textarea
                                value={claimDescription}
                                onChange={(e) => setClaimDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                rows={4}
                                placeholder="Describe the problem with your product..."
                            ></textarea>
                        </div>

                        <button
                            onClick={handleSubmitClaim}
                            disabled={isSubmittingClaim}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-70"
                        >
                            {isSubmittingClaim ? "Submitting..." : "Submit Claim"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
