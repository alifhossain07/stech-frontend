"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import apiClient from "@/app/lib/api-client";
import { FiChevronDown, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

interface ContactCard {
    label: string;
    title: string;
    description: string;
    icon: string;
    icon_url: string;
    cta_text: string;
    cta_link: string;
    bg_color: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface HelpData {
    hero_background_image: string;
    hero_title: string;
    hero_description: string;
    contact_section_title: string;
    contact_section_description: string;
    contact_cards: ContactCard[];
    form_title: string;
    form_description: string;
    form_button_text: string;
    faq_title: string;
    faq_subtitle: string;
    faqs: FAQ[];
}

const HelpCenter = () => {
    const [data, setData] = useState<HelpData | null>(null);
    const [loading, setLoading] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        content: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get("/api/dealer/help");
                if (res.data.success && res.data.data && res.data.data.result) {
                    setData(res.data.data.data.content);
                }
            } catch (error) {
                console.error("Error fetching help center data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (submitMessage) {
            setSubmitMessage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.content.trim()) {
            setSubmitMessage({ type: "error", text: "Please fill in all required fields" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSubmitMessage({ type: "error", text: "Please enter a valid email address" });
            return;
        }

        try {
            setSubmitting(true);
            setSubmitMessage(null);

            const response = await fetch("/api/contact/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.result) {
                setSubmitMessage({ type: "success", text: result.message || "Your message has been sent successfully!" });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    content: "",
                });
            } else {
                setSubmitMessage({ type: "error", text: result.message || "Failed to send message. Please try again." });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitMessage({ type: "error", text: "An error occurred. Please try again later." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-12 animate-pulse space-y-8">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 w-1/2"></div>
                        <div className="h-4 bg-gray-200 w-full"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                    <div className="h-96 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white min-h-screen pb-20 font-poppins">
            {/* Hero Section */}
            <div className="w-11/12 mx-auto pt-6">
                <div className="relative w-full h-[150px] md:h-[250px] 2xl:h-[350px] rounded-xl overflow-hidden shadow-sm">
                    <Image
                        src={data.hero_background_image}
                        alt="Help Center Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="w-11/12 mx-auto mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side: Cards */}
                    <div className="bg-[#f4f4f4] p-5 2xl:p-8 rounded-xl h-full">
                        <div className="mb-6 2xl:mb-10">
                            <h2 className="text-3xl 2xl:text-4xl font-medium text-gray-900 mb-3 2xl:mb-5">{data.hero_title}</h2>
                            <p className="text-gray-600 text-[13px] 2xl:text-base leading-relaxed max-w-xl">
                                {data.hero_description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-6">
                            {data.contact_cards.map((card, idx) => (
                                <div
                                    key={idx}
                                    style={{ backgroundColor: card.bg_color }}
                                    className={`p-4 2xl:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${card.bg_color.toLowerCase() === '#ffffff' ? 'text-gray-900' : 'text-white'}`}
                                >
                                    <div className="mb-3 2xl:mb-5">
                                        <div className={`w-10 h-10 2xl:w-14 2xl:h-14 rounded-lg flex items-center justify-center ${card.bg_color.toLowerCase() === '#ffffff' ? 'bg-orange-50' : 'bg-white/20'}`}>
                                            <Image src={card.icon_url} alt={card.title} width={20} height={20} className={`2xl:w-7 2xl:h-7 ${card.bg_color.toLowerCase() === '#ffffff' ? '' : 'brightness-0 invert'}`} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] 2xl:text-xs font-semibold mb-1 opacity-80">{card.label}</p>
                                    <h3 className="text-xs 2xl:text-base font-bold mb-1.5 2xl:mb-3">{card.title}</h3>
                                    <p className="text-[10px] 2xl:text-sm leading-snug 2xl:leading-relaxed opacity-90 line-clamp-3">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="bg-[#f4f4f4] p-5 2xl:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h2 className="text-2xl 2xl:text-3xl font-medium text-gray-900 mb-1 2xl:mb-2">{data.form_title}</h2>
                        <p className="text-gray-500 text-[13px] 2xl:text-base mb-6 2xl:mb-10 leading-relaxed">
                            {data.form_description}
                        </p>

                        {submitMessage && (
                            <div
                                className={`mb-4 p-3 rounded-md text-sm ${submitMessage.type === "success"
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : "bg-red-100 text-red-700 border border-red-300"
                                    }`}
                            >
                                {submitMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3 2xl:space-y-6 text-black">
                            <div>
                                <label className="block text-[11px] 2xl:text-sm font-semibold mb-1 2xl:mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 2xl:py-4 text-sm 2xl:text-base focus:outline-none focus:border-orange-500"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] 2xl:text-sm font-semibold mb-1 2xl:mb-2">Phone Number *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 2xl:py-4 text-sm 2xl:text-base focus:outline-none focus:border-orange-500"
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] 2xl:text-sm font-semibold mb-1 2xl:mb-2">Your E-mail *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 2xl:py-4 text-sm 2xl:text-base focus:outline-none focus:border-orange-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] 2xl:text-sm font-semibold mb-1 2xl:mb-2">Your Message *</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 2xl:py-4 text-sm 2xl:text-base h-24 2xl:h-44 resize-none focus:outline-none focus:border-orange-500"
                                    placeholder="Talk to us..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#FF6B01] text-white font-bold py-2.5 2xl:py-4 rounded-lg hover:bg-orange-600 transition-colors text-sm 2xl:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Sending..." : data.form_button_text}
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">


                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Static Image */}
                        <div className="lg:col-span-5 relative aspect-[4/5] rounded-md overflow-hidden shadow-xl">
                            <Image
                                src="/images/herofaq.webp" // Placeholder, user will add this
                                alt="Support"
                                fill
                                className="object-contain"

                            />
                        </div>

                        {/* Accordion */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center gap-2 mb-10">

                                <h2 className="text-3xl font-semibold text-gray-900">- {data.faq_title}</h2>
                            </div>
                            {data.faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
                                    >
                                        <span className="font-semibold text-gray-900 text-sm md:text-base">
                                            {faq.question}
                                        </span>
                                        <FiChevronDown
                                            className={`text-gray-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <div
                                        className={`transition-all duration-300 ease-in-out bg-[#f4f4f4] overflow-hidden ${openFaqIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-5 pt-3 text-sm text-gray-800 leading-relaxed border-t border-gray-50">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
