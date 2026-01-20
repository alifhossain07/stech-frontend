"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import WarrantyClaimModal from "@/components/ui/WarrantyClaimModal";
import { useAuth } from "@/app/context/AuthContext";

interface WarrantyClaim {
    id: number;
    claim_id?: number;
    status: string;
    claimed_at: string;
    issue_description: string;
    serial: string;
    product: {
        id?: number;
        name: string;
        thumbnail?: string;
        unit_price?: number;
        discount?: number;
    };
    admin_note?: string;
}

export default function ProductWarrantyPage() {
    const { loading: authLoading } = useAuth();
    const [mobileNumber, setMobileNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [claims, setClaims] = useState<WarrantyClaim[]>([]);
    const [isResultsVisible, setIsResultsVisible] = useState(false);

    // UI States
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | undefined>(undefined);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (mobileNumber.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/warranty/my-claims", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: mobileNumber }),
            });
            const data = await res.json();

            if (data.result) {
                setClaims(data.data || []);
                setIsResultsVisible(true);
                if (data.data && data.data.length > 0) {
                    setExpandedId(data.data[0].id);
                } else {
                    toast.error("No claims found for this number");
                }
            } else {
                setClaims([]);
                toast.error(data.message || "Failed to fetch claims");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching claims");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMobileNumber("");
        setClaims([]);
        setIsResultsVisible(false);
        setExpandedId(null);
    };

    const openClaimModal = (claim: WarrantyClaim) => {
        setSelectedClaim(claim);
        setIsClaimModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20 xl:pt-28 pt-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* TITLE */}
                <h1 className="text-xl md:text-4xl font-bold text-center text-orange-500 mb-16">
                    Sannai Technology Product Warranty
                </h1>

                <div className="max-w-6xl mx-auto">

                    {/* MOBILE INPUT SECTION */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] p-8 md:p-14 flex flex-col items-center mb-12 animate-fadeIn transition-all">
                        <form onSubmit={handleSearch} className="w-full max-w-2xl">
                            <div className="mb-10 text-center md:text-left">
                                <label className="block text-lg xl:text-xl font-medium text-gray-800 mb-4">
                                    Enter Mobile Number <span className="text-sm text-gray-400 font-normal">( product purchase number )</span>
                                </label>
                                <input
                                    type="text"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    placeholder="Enter number"
                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-6 text-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="xl:px-12 xl:py-3 px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold text-lg hover:bg-gray-200 transition-all min-w-[140px]"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="xl:px-12 xl:py-3 px-6 py-2 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 min-w-[140px] disabled:opacity-70"
                                >
                                    {isLoading ? "Loading..." : "Enter"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RESULTS SECTION */}
                    {isResultsVisible && claims.length > 0 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-[#F5F5F5] py-4 rounded-xl text-center">
                                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Your Warranty Claim History</h2>
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                                {claims.map((claim) => (
                                    <div key={claim.id} className="border-b border-gray-100 last:border-none">
                                        {/* Header Row */}
                                        <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0 relative overflow-hidden">
                                                    <Image
                                                        src={claim.product.thumbnail || "/images/placeholder.jpg"}
                                                        alt={claim.product.name}
                                                        width={50}
                                                        height={50}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(expandedId === claim.id ? null : claim.id)}>
                                                        <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                                                            {claim.product.name}
                                                        </h4>
                                                        <FiChevronDown className={`transition-transform duration-300 ${expandedId === claim.id ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${claim.status.toLowerCase() === 'approved' ? 'text-green-600 bg-green-50 border-green-200' :
                                                            claim.status.toLowerCase() === 'pending' ? 'text-orange-500 bg-orange-50 border-orange-200' :
                                                                'text-gray-600 bg-gray-50 border-gray-200'
                                                            }`}>
                                                            {claim.status}
                                                        </span>
                                                        <span className="text-gray-400 text-xs">
                                                            Claimed on: {formatDate(claim.claimed_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openClaimModal(claim)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-sm text-sm whitespace-nowrap"
                                            >
                                                New Claim
                                            </button>
                                        </div>

                                        {/* Dropdown Content */}
                                        {expandedId === claim.id && (
                                            <div className="px-6 pb-6 md:px-10 md:pb-10 space-y-4 animate-fadeIn">
                                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                                    <div>
                                                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Issue Description</span>
                                                        <p className="text-gray-800 text-sm mt-1">{claim.issue_description}</p>
                                                    </div>
                                                    {claim.admin_note && (
                                                        <div className="pt-3 border-t border-gray-200">
                                                            <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Admin Response</span>
                                                            <p className="text-gray-800 text-sm mt-1 italic">"{claim.admin_note}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                                                    <span className="text-gray-500 font-medium">Product Serial :</span>
                                                    <span className="text-gray-800 font-bold font-mono">{claim.serial}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                                                    <span className="text-gray-500 font-medium">Claim ID :</span>
                                                    <span className="text-gray-800 font-bold">#{claim.claim_id || claim.id}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Store App Banner */}
            {/* <div className="max-w-6xl mx-auto px-4 mt-20">
                <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-orange-500 italic mb-4 tracking-tighter">Sannai</h2>
                        <p className="text-white text-xl font-semibold">Get the Sannai Technology Store App</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex flex-col gap-4">
                            <Image src="/images/app-store.png" alt="App Store" width={140} height={42} className="cursor-pointer" />
                            <Image src="/images/google-play.png" alt="Google Play" width={140} height={42} className="cursor-pointer" />
                        </div>
                        <Image src="/images/galaxy-store.png" alt="Galaxy Store" width={140} height={42} className="cursor-pointer self-end" />
                    </div>
                </div>
            </div> */}

            {/* Claim Modal */}
            <WarrantyClaimModal
                isOpen={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
                productName={selectedClaim?.product.name}
                productSerial={selectedClaim?.serial}
                userPhone={mobileNumber}
            />

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
