"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/app/lib/api-client";

interface FooterInfoData {
    image: string;
    title: string;
    subtitle: string;
    description: string | null;
    bullet_points: string[];
    button_text: string;
    link: string;
}

const DealerFooterInfo = () => {
    const [data, setData] = useState<FooterInfoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFooterInfo = async () => {
            try {
                const res = await apiClient.get("/api/dealer/footer-info");
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching dealer footer info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFooterInfo();
    }, []);

    if (loading) {
        return (
            <div className="w-11/12 mx-auto my-12 h-96 bg-white animate-pulse rounded-2xl" />
        );
    }

    if (!data) return null;

    return (
        <section
            className="w-11/12 mx-auto my-16 relative overflow-hidden rounded-md bg-white flex items-center lg:block"
            style={{
                backgroundImage: `url(${data.image})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                aspectRatio: '1746/500',
                minHeight: '400px'
            }}
        >
            {/* Content Card - Stacked on mobile, Absolute on desktop */}
            <div className="relative lg:absolute inset-0 z-10 w-full h-full flex items-center justify-center lg:justify-end px-4 md:px-10 lg:px-[5%]">
                <div className="w-full lg:w-[40%] 2xl:w-[32%] bg-white p-6 md:p-8 lg:p-[2.5%] rounded-xl shadow-lg lg:mr-[2%]">
                    <h2 className="text-lg md:text-xl lg:text-[1.8vw] xl:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-[4%]">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm lg:text-[12px] 2xl:text-[14px] mb-2 leading-relaxed">
                        {data.subtitle}
                    </p>

                    <ul className="">
                        {data.bullet_points.map((point, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-800 font-normal">
                                <span className="text-gray-900 lg:text-[1.2vw]">➔</span>
                                <span className="text-xs md:text-sm lg:text-[0.9vw] xl:text-[13px]">{point}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={data.link || "#"}
                        className="inline-flex mt-2 items-center justify-center bg-[#FF6B01] hover:bg-[#F56600] text-white px-6 py-2 md:px-8 md:py-[1.5%] rounded-full font-semibold transition-all gap-[3%] shadow-md whitespace-nowrap lg:text-[0.9vw] 2xl:text-[14px] xl:text-[12px]"
                    >
                        <span className="w-[0.8vw] h-[0.8vw] max-w-[6px] max-h-[6px] bg-white rounded-full"></span>
                        <span>{data.button_text}</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DealerFooterInfo;
