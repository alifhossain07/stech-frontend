"use client";

import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import apiClient from "@/app/lib/api-client";

interface FAQ {
    question: string;
    answer: string;
}

interface FAQData {
    title: string;
    subtitle: string;
    faqs: FAQ[];
}

const DealerFAQ = () => {
    const [data, setData] = useState<FAQData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await apiClient.get("/api/dealer/faqs");
                const json = response.data;
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Error fetching dealer FAQs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto py-16 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-20 w-full bg-gray-100 rounded"></div>
                    </div>
                    <div className="lg:col-span-8 space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 w-full bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.faqs || data.faqs.length === 0) return null;

    return (
        <section className="bg-white  py-16 md:py-24 border-t border-gray-100">
            <div className="w-11/12 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left Side: Title and Subtitle */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                    <h2 className="text-2xl md:w-7/12 md:text-3xl lg:text-[30px] font-semibold text-gray-900 leading-[1.2] mb-6">
                        {(() => {
                            const [firstWord, ...rest] = data.title.split(" ");
                            return (
                                <>
                                    {firstWord}
                                    <br />
                                    {rest.join(" ")}
                                </>
                            );
                        })()}
                    </h2>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                        {data.subtitle}
                    </p>
                </div>

                {/* Right Side: FAQ Accordion */}
                <div className="lg:col-span-7 space-y-4">
                    {data.faqs.map((faq: FAQ, index: number) => (
                        <div
                            key={index}
                            className="bg-white
  rounded-md
  border border-gray-200
  shadow-[inset_0_0_22px_rgba(0,0,0,0.22),inset_0_2px_6px_rgba(255,255,255,0.6)]
  overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 md:p-5 text-left group"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-gray-900 font-bold text-xl mt-[-2px]">
                                        &bull;
                                    </span>
                                    <h3 className="text-gray-800 font-semibold text-lg  leading-snug">
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    <FiChevronDown className={`w-5 h-5 text-gray-900 transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`} />
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${activeIndex === index
                                    ? "max-h-[500px] opacity-100"
                                    : "max-h-0 opacity-0"
                                    } overflow-hidden`}
                            >
                                <div className="px-5 md:px-6 pb-6 pt-2 ml-8">
                                    <p className="text-gray-600 text-[15px] md:text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealerFAQ;
