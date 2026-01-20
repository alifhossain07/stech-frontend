"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiPhone } from "react-icons/fi";

const DealerLoginPage = () => {
    const { login, loading, user } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        phone: "",
        password: "",
    });

    // Redirect if already logged in as dealer
    React.useEffect(() => {
        if (user && user.type?.toLowerCase() === "dealer") {
            router.push("/dealer");
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.phone || form.phone.trim() === "") {
            toast.error("Phone number is required");
            return;
        }

        if (!form.password || form.password.trim() === "") {
            toast.error("Password is required");
            return;
        }

        try {
            // Force "dealer" type on login
            await login({
                login_by: "phone",
                phone: form.phone.trim(),
                password: form.password,
            }, "dealer");

            toast.success("Dealer logged in successfully");
            router.push("/dealer");
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full  md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">



                {/* Right Side - Form */}
                <div className="p-10 sm:p-12">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-4 leading-tight">Dealer <span className="text-orange-500">Dashboard</span> Login</h1>

                        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back!</h2>
                        <p className="text-gray-500">Please enter your credentials to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 block">Mobile Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <FiPhone />
                                </span>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="017XXXXXXXX"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 block">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <FiLock />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link href="#" className="font-medium text-orange-600 hover:text-orange-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex justify-center items-center px-4 border border-transparent text-base font-bold rounded-xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Login as Dealer"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Not a Dealer?{" "}
                            <Link href="/login" className="font-bold text-orange-600 hover:text-orange-500">
                                User Login
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Want to become a dealer?{" "}
                            <Link href="/dealer/registration" className="font-bold text-black hover:underline">
                                Register Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerLoginPage;
