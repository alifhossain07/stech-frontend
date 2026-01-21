"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { FiCheck, FiX, FiChevronDown, } from "react-icons/fi";
import { toast } from "react-hot-toast";
import WarrantyClaimModal from "@/components/ui/WarrantyClaimModal";



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

export default function AuthenticationPage() {
    const { loading } = useAuth();
    const [step, setStep] = useState<"activation_status" | "mobile_input" | "success_validation">("mobile_input");

    // Form States
    const [mobileNumber, setMobileNumber] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [activatedProducts, setActivatedProducts] = useState<ActivatedProduct[]>([]);
    const [successData, setSuccessData] = useState<SuccessData | null>(null);

    // Modal States
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ActivatedProduct | undefined>(undefined);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleMobileNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileNumber.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/warranty/activated-products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: mobileNumber }),
            });
            const data = await res.json();
            if (data.result) {
                setActivatedProducts(data.data || []);
                if (data.data && data.data.length > 0) {
                    setExpandedId(data.data[0].product_serial_id);
                }
            } else {
                setActivatedProducts([]);
            }
            setStep("activation_status");
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!activationCode) {
            toast.error("Please enter activation code");
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
            } else {
                toast.error(data.message || "Invalid or already activated code");
            }
        } catch (error) {
            console.error(error);
            toast.error("Activation failed");
        } finally {
            setIsActivating(false);
        }
    };

    const handleReset = () => {
        setMobileNumber("");
        setActivationCode("");
        setActivatedProducts([]);
        setStep("mobile_input");
        setSuccessData(null);
    };

    const openClaimModal = (product: ActivatedProduct) => {
        setSelectedProduct(product);
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

    if (loading) {
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
                <h1 className="text-2xl md:text-4xl font-bold text-center text-orange-500 mb-16">
                    Sannai Technology Product Activation
                </h1>

                <div className="max-w-6xl mx-auto">

                    {/* MOBILE INPUT SECTION */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] p-8 md:p-14 flex flex-col items-center mb-12 animate-fadeIn transition-all">
                        <form onSubmit={handleMobileNext} className="w-full max-w-2xl">
                            <div className="mb-10">
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

                    {/* STEP 2: ACTIVATION CODE INPUT & PREVIOUS HISTORY */}
                    {step === "activation_status" && (
                        <div className="space-y-12 animate-fadeIn">
                            <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] p-3 md:p-16 flex flex-col items-center">
                                <div className="bg-[#F5F5F5] w-full max-w-lg h-48 rounded-2xl flex flex-col items-center justify-center mb-10 relative overflow-hidden group">
                                    <div className="relative w-48 h-20 mb-2">
                                        <div className="flex gap-0.5 h-full items-end justify-center">
                                            {[...Array(40)].map((_, i) => (
                                                <div key={i} className={`w-0.5 bg-black ${i % 3 === 0 ? 'h-full' : i % 2 === 0 ? 'h-3/4' : 'h-1/2'}`}></div>
                                            ))}
                                        </div>
                                        <div className="text-center text-[10px] font-medium mt-1 uppercase tracking-widest text-gray-600">Sannai Technology</div>
                                    </div>
                                </div>

                                <h3 className="xl:text-2xl text-xl font-semibold text-gray-800 mb-8 text-center px-4">
                                    Please scratch the coating of the sticker on your product and provide the code below
                                </h3>

                                <div className="w-full max-w-3xl space-y-8">
                                    <input
                                        type="text"
                                        value={activationCode}
                                        onChange={(e) => setActivationCode(e.target.value)}
                                        placeholder="Enter activation code"
                                        className="w-full h-12 bg-[#F5F5F5] border-none rounded-xl px-6 text-center text-xl font-bold focus:ring-2 focus:ring-orange-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />

                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setStep("mobile_input")}
                                            className="xl:px-12 xl:py-3 px-6 py-2 rounded-full bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-all min-w-[140px]"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleVerify}
                                            disabled={isActivating}
                                            className="xl:px-12 xl:py-3 px-6 py-2 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 min-w-[140px] disabled:opacity-70"
                                        >
                                            {isActivating ? "Verifying..." : "Verify"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details List - Shown if items exist for this number */}
                            {activatedProducts.length > 0 && (
                                <div className="space-y-6">
                                    <div className="bg-[#F5F5F5] py-4 rounded-xl text-center">
                                        <h2 className="md:text-2xl   text-md font-bold text-gray-800 uppercase tracking-wide">Your Product Warranty Details</h2>
                                    </div>

                                    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                                        {activatedProducts.map((prod) => (
                                            <div key={prod.product_serial_id} className="border-b border-gray-100 last:border-none">
                                                {/* Header Row */}
                                                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0 relative overflow-hidden">
                                                            <Image
                                                                src={prod.product.thumbnail || "/images/placeholder.jpg"}
                                                                alt={prod.product.name}
                                                                width={50}
                                                                height={50}
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(expandedId === prod.product_serial_id ? null : prod.product_serial_id)}>
                                                                <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                                                                    {prod.product.name}
                                                                </h4>
                                                                <FiChevronDown className={`transition-transform duration-300 ${expandedId === prod.product_serial_id ? 'rotate-180' : ''}`} />
                                                            </div>
                                                            {/* <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-orange-500 font-bold text-base md:text-lg">৳{prod.product.unit_price || 0}</span>
                                                                {prod.product.discount && (
                                                                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                        {prod.product.discount}% OFF
                                                                    </span>
                                                                )}
                                                                <span className="text-gray-300 line-through text-xs">
                                                                    ৳{prod.product.unit_price ? Math.round(prod.product.unit_price * 1.1) : 0}
                                                                </span>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => openClaimModal(prod)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-sm text-sm whitespace-nowrap"
                                                    >
                                                        Warranty Claim
                                                    </button>
                                                </div>

                                                {/* Dropdown Content */}
                                                {expandedId === prod.product_serial_id && (
                                                    <div className="px-2 pb-6 md:px-10 md:pb-10 space-y-3 animate-fadeIn">
                                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                            <span className="text-gray-500 font-medium">Product warranty :</span>
                                                            <span className="text-gray-800 font-bold">{prod.product.warranty_days} Days</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                            <span className="text-gray-500 font-medium">Your warranty start from :</span>
                                                            <span className="text-gray-800 font-bold">{formatDate(prod.activation.activated_at)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-[#FFE8E8] px-4 py-3 rounded-md">
                                                            <span className="text-red-500 font-semibold">Your warranty Expire :</span>
                                                            <span className="text-red-500 font-bold">{formatDate(prod.activation.expires_at)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                            <span className="text-gray-500 font-medium">Service taken :</span>
                                                            <span className="text-gray-800 font-bold">{prod.activation.claim_count.toString().padStart(2, '0')} Times</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: SUCCESS VALIDATION */}
                    {step === "success_validation" && successData && (
                        <div className="animate-fadeIn">


                            <div className="bg-white rounded-[3rem] shadow-[0_10px_60px_rgba(0,0,0,0.06)] p-4 md:p-20 relative max-w-5xl mx-auto border border-gray-50">
                                <button onClick={handleReset} className="absolute top-10 right-10 text-gray-300 hover:text-gray-500 transition-colors">
                                    <FiX size={32} />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-12">
                                        {/* Successful Illustration */}
                                        <div className="w-48 h-48 relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-orange-50 rounded-full animate-pulse"></div>
                                            <div className="relative z-10">
                                                <div className="w-40 h-32 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-6xl shadow-xl transform -rotate-3">
                                                    📦
                                                </div>
                                                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-500 rounded-full border-[6px] border-white shadow-lg flex items-center justify-center text-white">
                                                    <FiCheck size={40} strokeWidth={4} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="xl:text-2xl text-xl font-bold text-gray-800 mb-4">Code : {successData.serial.serial}</h3>
                                    <h2 className="text-2xl md:text-4xl font-black text-[#26B95C] mb-8 tracking-wide uppercase">SUCCESSFULLY VALIDATED</h2>

                                    <p className="text-gray-500 md:text-xl text-lg font-medium mb-16 leading-relaxed">
                                        This Is A Genuine Sannai Product.
                                        Thank You For Choosing Quality And Originality.
                                    </p>

                                    <div className="w-full space-y-4 max-w-2xl">
                                        <div className="bg-[#F5F5F5] p-3 rounded-2xl flex justify-between items-center px-8 border border-gray-100">
                                            <span className="text-gray-600 font-semibold md:text-lg text-md">Product Name :</span>
                                            <span className="text-gray-800 font-bold md:text-lg text-md">{successData.serial.product.name}</span>
                                        </div>
                                        <div className="bg-[#F5F5F5] p-3 rounded-2xl flex justify-between items-center px-8 border border-gray-100">
                                            <span className="text-gray-600 font-semibold md:text-lg text-md">Warranty :</span>
                                            <span className="text-gray-800 font-bold md:text-lg text-md">{successData.serial.product.warranty_days} Days</span>
                                        </div>
                                        <div className="bg-[#F5F5F5] p-3 rounded-2xl flex justify-between items-center px-8 border border-gray-100">
                                            <span className="text-gray-600 font-semibold md:text-lg text-md">Expires At :</span>
                                            <span className="text-gray-800 font-bold md:text-lg text-md">{formatDate(successData.serial.warranty_expires_at)}</span>
                                        </div>
                                    </div>
                                </div>
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

            {/* Warranty Claim Modal */}
            <WarrantyClaimModal
                isOpen={isClaimModalOpen}
                onClose={() => setIsClaimModalOpen(false)}
                productName={selectedProduct?.product.name}
                productSerial={selectedProduct?.serial}
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
