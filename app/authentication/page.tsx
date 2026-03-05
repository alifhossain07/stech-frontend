"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { FiCheck, FiX, FiChevronDown, } from "react-icons/fi";
import { toast } from "react-hot-toast";
import WarrantyClaimModal from "@/components/ui/WarrantyClaimModal";
import ProductInfoModal from "@/components/ui/ProductInfoModal";
import { useSearchParams } from "next/navigation";

interface ActivatedProduct {
    product_serial_id: number;
    serial: string;
    serial_status: string;
    product: {
        id: number;
        name: string;
        thumbnail: string;
        warranty_days: number;
        unit_price?: number;
        discount?: number;
        discount_type?: string;
    };
    activation: {
        id: number;
        activated_at: string;
        expires_at: string;
        status: string;
        is_expired: boolean;
        claim_count: number;
    };
}

interface SuccessData {
    serial: {
        serial: string;
        product: {
            name: string;
            warranty_days: number;
        };
        warranty_expires_at: string;
    };
}

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
        thumbnail?: string | { file_name: string };
        thumbnail_image?: string;
        image?: string;
        photos?: { path: string }[] | string;
    };
    admin_note?: string;
}

export default function AuthenticationPage() {
    const { loading } = useAuth();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<"code_input" | "mobile_input" | "success_validation" | "activation_status" | "history_mobile_input">("code_input");

    // Form States
    const [mobileNumber, setMobileNumber] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [activatedProducts, setActivatedProducts] = useState<ActivatedProduct[]>([]);
    const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
    const [successData, setSuccessData] = useState<SuccessData | null>(null);
    const [historyTab, setHistoryTab] = useState<"activated" | "warranty">("activated");

    // Modal States
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ActivatedProduct | undefined>(undefined);
    const [selectedClaimData, setSelectedClaimData] = useState<{ productName?: string; serial?: string }>({});
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [activationError, setActivationError] = useState<string | null>(null);
    const [mobileError, setMobileError] = useState<string | null>(null);

    // Refs for scrolling
    const codeSectionRef = useRef<HTMLDivElement>(null);
    const mobileSectionRef = useRef<HTMLDivElement>(null);
    const resultSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tabMode = searchParams.get("tab");
        if (tabMode === "warranty") {
            setHistoryTab("warranty");
            setStep((prev) => (prev === "code_input" ? "history_mobile_input" : prev));
        }
    }, [searchParams]);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        setTimeout(() => {
            if (ref.current) {
                ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 150);
    };

    const handleCodeNext = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!activationCode) {
            setActivationError("Please enter activation code");
            return;
        }
        setActivationError(null);
        setStep("mobile_input");
        scrollToSection(mobileSectionRef);
    };

    const handleActivate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setMobileError(null);

        if (mobileNumber.length !== 11) {
            setMobileError("Phone number must be 11 digits");
            return;
        }

        setIsActivating(true);
        try {
            const res = await fetch("/api/warranty/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: mobileNumber, code: activationCode }),
            });
            const data = await res.json();

            if (data.result) {
                toast.success(data.message || "Product activated successfully");
                setSuccessData(data.data);
                setStep("success_validation");
                scrollToSection(resultSectionRef);
            } else {
                setActivationError(data.message || "Invalid or already activated code");
                await fetchHistory();
                setStep("activation_status");
                scrollToSection(resultSectionRef);
            }
        } catch (error) {
            console.error(error);
            setActivationError("Activation failed. Please try again.");
        } finally {
            setIsActivating(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const [activatedRes, claimsRes] = await Promise.all([
                fetch("/api/warranty/activated-products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: mobileNumber }),
                }),
                fetch("/api/warranty/my-claims", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: mobileNumber }),
                }),
            ]);

            const activatedData = await activatedRes.json();
            const claimsData = await claimsRes.json();

            const activatedList: ActivatedProduct[] = activatedData.result ? (activatedData.data || []) : [];
            const claimList: WarrantyClaim[] = claimsData.result ? (claimsData.data || []) : [];

            setActivatedProducts(activatedList);
            setWarrantyClaims(claimList);

            if (activatedList.length > 0) {
                setExpandedId(activatedList[0].product_serial_id);
            } else if (claimList.length > 0) {
                setExpandedId(claimList[0].id);
                setHistoryTab("warranty");
            } else {
                setExpandedId(null);
                toast.error("No activation or warranty history found for this number");
            }

            if (!activatedData.result && !claimsData.result) {
                toast.error("Failed to fetch records");
            } else if (!activatedData.result) {
                setActivatedProducts([]);
            } else if (!claimsData.result) {
                setWarrantyClaims([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch records");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMobileNumber("");
        setActivationCode("");
        setActivatedProducts([]);
        setWarrantyClaims([]);
        setStep("code_input");
        setHistoryTab("activated");
        setExpandedId(null);
        setSelectedClaimData({});
        setSuccessData(null);
        setActivationError(null);
        setMobileError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openClaimModal = (product: ActivatedProduct) => {
        setSelectedClaimData({});
        setSelectedProduct(product);
        setIsClaimModalOpen(true);
    };

    const openClaimModalFromHistory = (claim: WarrantyClaim) => {
        setSelectedProduct(undefined);
        setSelectedClaimData({ productName: claim.product.name, serial: claim.serial });
        setIsClaimModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getProductImage = (product: WarrantyClaim["product"]) => {
        if (typeof product.thumbnail === "string" && product.thumbnail.startsWith("http")) return product.thumbnail;
        if (product.thumbnail && typeof product.thumbnail === "object" && "file_name" in product.thumbnail) {
            return `https://sannaiadmin.techdynobdltd.com/public/${product.thumbnail.file_name}`;
        }
        if (product.image) return product.image;
        if (product.thumbnail_image) return product.thumbnail_image;
        if (Array.isArray(product.photos) && product.photos.length > 0) return product.photos[0].path;
        return "/images/placeholder.jpg";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-[20vh] xl:pt-16 pt-8">
            <div className="max-w-7xl mx-auto px-4">

                <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-center text-orange-500 xl:mt-8  xl:mb-8 mb-4">
                    Sannai Technology Product Activation
                </h1>

                <div className="max-w-4xl mx-auto">

                    {/* STEP 1: ACTIVATION CODE INPUT */}
                    {step === "code_input" && (
                        <div ref={codeSectionRef} className="bg-white rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.03)] p-4 md:p-8 flex flex-col items-center mb-6 animate-fadeIn transition-all">
                            <div className="bg-[#F5F5F5] w-full max-w-md h-32 rounded-xl flex flex-col items-center justify-center mb-6 relative overflow-hidden group">
                                <div className="relative w-40 h-16 mb-1">
                                    <div className="flex gap-0.5 h-full items-end justify-center">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className={`w-0.5 bg-black ${i % 3 === 0 ? 'h-full' : i % 2 === 0 ? 'h-3/4' : 'h-1/2'}`}></div>
                                        ))}
                                    </div>
                                    <div className="text-center text-[8px] font-medium mt-1 uppercase tracking-widest text-gray-600">Sannai Technology</div>
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-6 text-center px-4">
                                Please scratch the coating and provide the code below
                            </h3>

                            <form onSubmit={handleCodeNext} className="w-full max-w-2xl space-y-6">
                                <input
                                    type="text"
                                    value={activationCode}
                                    onChange={(e) => {
                                        setActivationCode(e.target.value);
                                        if (activationError) setActivationError(null);
                                    }}
                                    placeholder="Enter activation code"
                                    className={`w-full h-11 bg-[#F5F5F5] border-none rounded-lg px-6 text-center text-lg font-semibold focus:ring-2 focus:ring-orange-500 transition-all placeholder:font-normal placeholder:text-gray-400 ${activationError ? "ring-2 ring-red-500 bg-red-50 text-red-600" : ""}`}
                                />
                                {activationError && (
                                    <p className="text-red-500 text-center text-sm font-medium -mt-4 animate-fadeIn">
                                        {activationError}
                                    </p>
                                )}

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-bold text-base hover:bg-gray-200 transition-all min-w-[120px]"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 rounded-full bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition-all shadow-md shadow-orange-100 min-w-[120px]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <p
                                        onClick={() => {
                                            setStep("history_mobile_input");
                                            setActivationError(null);
                                            scrollToSection(mobileSectionRef);
                                        }}
                                        className="text-gray-500 text-sm font-medium cursor-pointer hover:text-orange-500 transition-colors"
                                    >
                                        Already activated? <span className="text-orange-500 underline">Check Your Products</span>
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STEP 2: MOBILE INPUT SECTION */}
                    {(step === "mobile_input" || step === "success_validation" || step === "activation_status" || step === "history_mobile_input") && (
                        <div ref={mobileSectionRef} className="bg-white rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.03)] p-6 md:p-8 flex flex-col items-center mb-6 animate-fadeIn transition-all">
                            <form
                                onSubmit={(e) => {
                                    if (step === "history_mobile_input") {
                                        e.preventDefault();
                                        if (mobileNumber.length !== 11) {
                                            setMobileError("Phone number must be 11 digits");
                                            return;
                                        }
                                        fetchHistory().then(() => {
                                            const preferredTab = searchParams.get("tab") === "warranty" ? "warranty" : "activated";
                                            setHistoryTab(preferredTab);
                                            setStep("activation_status");
                                            scrollToSection(resultSectionRef);
                                        });
                                    } else {
                                        handleActivate(e);
                                    }
                                }}
                                className="w-full max-w-xl"
                            >
                                <div className="mb-6">
                                    <label className="block text-base md:text-lg font-medium text-gray-800 mb-3">
                                        {step === "history_mobile_input" ? "Enter Registered Mobile Number" : "Enter Mobile Number"} <span className="text-xs text-gray-400 font-normal">{step === "history_mobile_input" ? "( to see your activated products )" : "( product purchase number )"}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            setMobileNumber(e.target.value);
                                            if (mobileError) setMobileError(null);
                                        }}
                                        placeholder="Enter number"
                                        className={`w-full h-11 bg-white border border-gray-200 rounded-lg px-6 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 ${mobileError ? "ring-2 ring-red-500 bg-red-50 text-red-600 border-red-500" : ""}`}
                                    />
                                    {mobileError && (
                                        <p className="text-red-500 mt-2 text-sm font-medium animate-fadeIn">
                                            {mobileError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("code_input");
                                            setMobileNumber("");
                                            setActivatedProducts([]);
                                            setWarrantyClaims([]);
                                            setHistoryTab("activated");
                                            setExpandedId(null);
                                            setMobileError(null);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold text-base hover:bg-gray-200 transition-all min-w-[120px]"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isActivating || isLoading}
                                        className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold text-base hover:bg-orange-600 transition-all shadow-md shadow-orange-100 min-w-[120px] disabled:opacity-70"
                                    >
                                        {isActivating || isLoading ? "Verifying..." : (step === "history_mobile_input" ? "Check Products" : "Activate")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* RESULTS SECTION */}
                    <div ref={resultSectionRef}>
                        {/* STEP 3: SUCCESS VALIDATION */}
                        {step === "success_validation" && successData && (
                            <div className="animate-fadeIn">
                                <div className="bg-white rounded-[2rem] shadow-[0_5px_30px_rgba(0,0,0,0.04)] p-6 md:p-2relative max-w-4xl mx-auto border border-gray-50">
                                    <button onClick={handleReset} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
                                        <FiX size={24} />
                                    </button>

                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-1">
                                            <div className="w-32 h-32 relative flex items-center justify-center">
                                                <div className="absolute inset-0 bg-orange-50 rounded-full animate-pulse"></div>
                                                <div className="relative z-10">
                                                    <div className="w-24 h-20 bg-orange-500 rounded-xl flex items-center justify-center text-white text-4xl shadow-lg transform -rotate-2">
                                                        📦
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white">
                                                        <FiCheck size={24} strokeWidth={4} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Code : {successData.serial.serial}</h3>
                                        <h2 className="text-xl md:text-2xl font-black text-[#26B95C] mb-2 tracking-wide uppercase">Successfully Activated</h2>

                                        <p className="text-gray-500 text-base md:text-lg font-medium mb-5 leading-relaxed ">
                                            Genuine Sannai Product. Thank You For Choosing Quality.
                                        </p>

                                        <div className="w-full space-y-3 max-w-xl">
                                            <div className="bg-[#F5F5F5] p-2.5 rounded-xl flex justify-between items-center px-6 border border-gray-100">
                                                <span className="text-gray-600 font-semibold text-sm md:text-base">Product Name:</span>
                                                <span className="text-gray-800 font-bold text-sm md:text-base">{successData.serial.product.name}</span>
                                            </div>
                                            <div className="bg-[#F5F5F5] p-2.5 rounded-xl flex justify-between items-center px-6 border border-gray-100">
                                                <span className="text-gray-600 font-semibold text-sm md:text-base">Warranty:</span>
                                                <span className="text-gray-800 font-bold text-sm md:text-base">{successData.serial.product.warranty_days} Days</span>
                                            </div>
                                            <div className="bg-[#F5F5F5] p-2.5 rounded-xl flex justify-between items-center px-6 border border-gray-100">
                                                <span className="text-gray-600 font-semibold text-sm md:text-base">Expires At:</span>
                                                <span className="text-gray-800 font-bold text-sm md:text-base">{formatDate(successData.serial.warranty_expires_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HISTORY SECTION */}
                        {step === "activation_status" && (activatedProducts.length > 0 || warrantyClaims.length > 0) && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="bg-[#F5F5F5] py-2.5 rounded-lg text-center">
                                    <h2 className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-wide">Product Records</h2>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-100 p-2 flex items-center gap-2 w-fit mx-auto">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHistoryTab("activated");
                                            if (activatedProducts.length > 0) setExpandedId(activatedProducts[0].product_serial_id);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${historyTab === "activated" ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    >
                                        Activated Products
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHistoryTab("warranty");
                                            if (warrantyClaims.length > 0) setExpandedId(warrantyClaims[0].id);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${historyTab === "warranty" ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    >
                                        Warranty History
                                    </button>
                                </div>

                                {historyTab === "activated" ? (
                                    <div className="bg-white rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.03)] overflow-hidden">
                                        {activatedProducts.length === 0 ? (
                                            <p className="py-10 text-center text-sm text-gray-500">No activated products found for this number.</p>
                                        ) : (
                                            activatedProducts.map((prod) => (
                                                <div key={prod.product_serial_id} className="border-b border-gray-50 last:border-none">
                                                    <div className="p-3 md:p-5 flex flex-col md:flex-row items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0 relative overflow-hidden">
                                                                <Image
                                                                    src={prod.product.thumbnail || "/images/placeholder.jpg"}
                                                                    alt={prod.product.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(expandedId === prod.product_serial_id ? null : prod.product_serial_id)}>
                                                                    <h4 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-1">{prod.product.name}</h4>
                                                                    <FiChevronDown className={`transition-transform duration-300 ${expandedId === prod.product_serial_id ? "rotate-180" : ""}`} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => openClaimModal(prod)}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-lg transition-all shadow-sm text-xs whitespace-nowrap"
                                                        >
                                                            Warranty Claim
                                                        </button>
                                                    </div>

                                                    {expandedId === prod.product_serial_id && (
                                                        <div className="px-4 pb-4 md:px-8 md:pb-6 space-y-2 animate-fadeIn text-xs md:text-sm">
                                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                                <span className="text-gray-500 font-medium">Warranty :</span>
                                                                <span className="text-gray-800 font-bold">{prod.product.warranty_days} Days</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                                <span className="text-gray-500 font-medium">Activated :</span>
                                                                <span className="text-gray-800 font-bold">{formatDate(prod.activation.activated_at)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-[#FFE8E8] px-3 py-2 rounded-md">
                                                                <span className="text-red-500 font-semibold">Expires :</span>
                                                                <span className="text-red-500 font-bold">{formatDate(prod.activation.expires_at)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                                <span className="text-gray-500 font-medium">Claims :</span>
                                                                <span className="text-gray-800 font-bold">{prod.activation.claim_count.toString().padStart(2, "0")} Times</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.03)] overflow-hidden">
                                        {warrantyClaims.length === 0 ? (
                                            <p className="py-10 text-center text-sm text-gray-500">No warranty claim history found for this number.</p>
                                        ) : (
                                            warrantyClaims.map((claim) => (
                                                <div key={claim.id} className="border-b border-gray-100 last:border-none">
                                                    <div className="p-3 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0 relative overflow-hidden">
                                                                <Image
                                                                    src={getProductImage(claim.product)}
                                                                    alt={claim.product.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(expandedId === claim.id ? null : claim.id)}>
                                                                    <h4 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-1">{claim.product.name}</h4>
                                                                    <FiChevronDown className={`transition-transform duration-300 ${expandedId === claim.id ? "rotate-180" : ""}`} />
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${claim.status.toLowerCase() === "approved" ? "text-green-600 bg-green-50 border-green-200" : claim.status.toLowerCase() === "pending" ? "text-orange-500 bg-orange-50 border-orange-200" : "text-gray-600 bg-gray-50 border-gray-200"}`}>
                                                                        {claim.status}
                                                                    </span>
                                                                    <span className="text-gray-400 text-[10px] md:text-xs">Claimed on: {formatDate(claim.claimed_at)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => openClaimModalFromHistory(claim)}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-lg transition-all shadow-sm text-xs whitespace-nowrap"
                                                        >
                                                            New Claim
                                                        </button>
                                                    </div>

                                                    {expandedId === claim.id && (
                                                        <div className="px-4 pb-4 md:px-8 md:pb-6 space-y-3 animate-fadeIn text-xs md:text-sm">
                                                            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                                                <div>
                                                                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Issue Description</span>
                                                                    <p className="text-gray-800 mt-1">{claim.issue_description}</p>
                                                                </div>
                                                                {claim.admin_note && (
                                                                    <div className="pt-2 border-t border-gray-200">
                                                                        <span className="text-orange-500 text-[10px] font-semibold uppercase tracking-wider">Admin Response</span>
                                                                        <p className="text-gray-800 mt-1 italic">&quot;{claim.admin_note}&quot;</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                                <span className="text-gray-500 font-medium">Product Serial :</span>
                                                                <span className="text-gray-800 font-bold font-mono">{claim.serial}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                                <span className="text-gray-500 font-medium">Claim ID :</span>
                                                                <span className="text-gray-800 font-bold">#{claim.claim_id || claim.id}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <ProductInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                product={selectedProduct}
            />

            <WarrantyClaimModal
                isOpen={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
                productName={selectedProduct?.product.name || selectedClaimData.productName}
                productSerial={selectedProduct?.serial || selectedClaimData.serial}
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
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
