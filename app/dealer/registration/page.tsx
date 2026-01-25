"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiImage } from "react-icons/fi";

const DealerRegistrationPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email_or_phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        dealer_code: "",
        dealer_nid: "",
        business_address: "",
    });
    const [licenseFile, setLicenseFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLicenseFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            toast.error("Passwords do not match");
            return;
        }

        if (!agreed) {
            toast.error("You must agree to the terms and conditions");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email_or_phone", form.email_or_phone);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("password_confirmation", form.password_confirmation);
            formData.append("register_by", "phone");
            formData.append("is_dealer", "1");
            formData.append("dealer_code", form.dealer_code);
            formData.append("dealer_nid", form.dealer_nid);
            formData.append("business_address", form.business_address);
            if (licenseFile) {
                formData.append("dealer_license", licenseFile);
            }

            const res = await fetch("/api/auth/dealer-signup", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.result) {
                toast.success(data.message || "Dealer registration successful! Please wait for approval.");
                router.push("/login");
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl w-full space-y-8 bg-white p-6 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-center relative">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Create an Account as a Dealer</h2>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-orange-400"></div>
                </div>

                <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Dealer Code Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Code Number</label>
                            <input
                                type="text"
                                name="dealer_code"
                                value={form.dealer_code}
                                onChange={handleChange}
                                placeholder="Enter dealer code"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <input
                                type="text"
                                name="email_or_phone"
                                required
                                value={form.email_or_phone}
                                onChange={handleChange}
                                placeholder="Enter mobile number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* E-mail (optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail ( optional)</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Business Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                            <input
                                type="text"
                                name="business_address"
                                value={form.business_address}
                                onChange={handleChange}
                                placeholder="district - city - road-etc"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* NID Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NID Number</label>
                            <input
                                type="text"
                                name="dealer_nid"
                                value={form.dealer_nid}
                                onChange={handleChange}
                                placeholder="********"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Trade License */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trade License</label>
                            <div className="relative flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <label className="bg-gray-50 p-4 border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                                    <FiImage className="text-gray-600 text-xl" />
                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                                </label>
                                <span className="px-4 text-gray-400 text-sm">
                                    {licenseFile ? licenseFile.name : "Choose file"}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400 font-medium">
                                Upload your trade license image( pdf or jpeg )<span className="text-orange-500">*</span>
                            </p>
                        </div>

                        {/* Enter Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        {/* Re-type Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Re-type Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    required
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center gap-2">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer select-none">
                            I agree to the terms and conditions
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-64 bg-orange-600 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealerRegistrationPage;
