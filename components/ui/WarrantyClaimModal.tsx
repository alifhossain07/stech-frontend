"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";

import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

interface WarrantyClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    productSerial?: string;
    userPhone?: string;
}

const WarrantyClaimModal: React.FC<WarrantyClaimModalProps> = ({
    isOpen,
    onClose,
    productName,
    productSerial,
    userPhone,
}) => {
    const { accessToken } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        codeNumber: "",
        address: "",
        issue_description: "",
        productImage: null as File | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                phoneNumber: userPhone || prev.phoneNumber,
                codeNumber: productSerial || prev.codeNumber
            }));
        }
    }, [isOpen, userPhone, productSerial]);

    if (!isOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, productImage: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                phone: formData.phoneNumber,
                code: formData.codeNumber,
                name: formData.fullName,
                email: formData.email,
                address: formData.address,
                issue_description: formData.issue_description,
            };

            const res = await fetch("/api/warranty/claim", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.result) {
                toast.success(data.message || "Warranty claim submitted successfully");
                onClose();
            } else {
                toast.error(data.message || "Failed to submit claim");
            }
        } catch (error) {
            console.error("Claim Submission Error:", error);
            toast.error("An error occurred during submission");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Warranty Claim From
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={28} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        {productName && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                                <p className="text-orange-800 font-semibold">Product: {productName}</p>
                                <p className="text-orange-600 text-sm">Serial: {productSerial}</p>
                            </div>
                        )}

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Phone and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter e-mail"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Code Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code Number
                            </label>
                            <input
                                type="text"
                                name="codeNumber"
                                value={formData.codeNumber}
                                onChange={handleInputChange}
                                placeholder="Enter code"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Issue Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Description
                            </label>
                            <textarea
                                name="issue_description"
                                value={formData.issue_description}
                                onChange={handleInputChange}
                                placeholder="Describe the issue with your product"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all min-h-[100px]"
                                required
                            />
                        </div>

                        {/* Product Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product image
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-gray-100 rounded-xl group-hover:bg-gray-100 transition-all border-dashed border-2">
                                    <div className="bg-gray-200 p-2 rounded-lg text-gray-500">
                                        <FiUploadCloud size={20} />
                                    </div>
                                    <span className="text-gray-400">
                                        {formData.productImage
                                            ? formData.productImage.name
                                            : "Browse"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end pt-4 pb-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-70"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #bbb;
                }
            `}</style>
        </div>
    );
};


export default WarrantyClaimModal;
