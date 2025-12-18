"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

// Define a type for the SEO data
interface SeoData {
  title: string;
  description: string;
  // Add other properties if your API response includes more fields
}

const Shimmer = () => {
  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shimmer Card 1 */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="bg-gray-300 h-6 mb-4 w-3/4 rounded-md"></div>
          <div className="bg-gray-200 h-24 rounded-md"></div>
        </div>

        {/* Shimmer Card 2 (Image) */}
        <div className="bg-white hidden md:block shadow-md rounded-xl border border-gray-200 relative overflow-hidden animate-pulse">
          <div className="bg-gray-300 w-full h-full rounded-xl"></div>
        </div>

        {/* Shimmer Other Cards */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="bg-gray-300 h-6 mb-4 w-3/4 rounded-md"></div>
            <div className="bg-gray-200 h-24 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutSection = () => {
  const [seoData, setSeoData] = useState<SeoData>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const res = await axios.get("/api/home-bottom-seo"); // Adjust the endpoint based on your route
        console.log(res.data); // Log to check the response
        if (res.data.success) {
          setSeoData(res.data); // Save the data to state
        } else {
          console.error("API error:", res.data.error); // Log error if not successful
        }
      } catch (error) {
        console.error("Error fetching SEO data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeoData();
  }, []);

  if (loading) {
    return <Shimmer />; // Show shimmer loader when loading
  }

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Text */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200">
          <h3 className="bg-black text-white text-sm md:text-base font-semibold px-4 py-5 rounded-md inline-block mb-4">
            {seoData.title}
          </h3>
          {/* Render the description as HTML */}
          <p
            className="text-gray-600 text-justify p-4 text-sm md:text-base leading-loose"
            dangerouslySetInnerHTML={{ __html: seoData.description }}
          ></p>
        </div>

        {/* Card 2 - Image only */}
        <div className="bg-white hidden md:block shadow-md rounded-xl border border-gray-200 relative overflow-hidden">
          <Image src="/images/aboutimage2.jpg" alt="Gadget Showcase" fill className="object-contain rounded-xl" />
        </div>

        {/* Other cards */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl border border-gray-200">
            <h3 className="bg-black text-white text-sm md:text-base font-semibold px-4 py-5 rounded-md inline-block mb-4">
              {seoData.title}
            </h3>
            {/* Render the description as HTML */}
            <p
              className="text-gray-600 text-justify p-4 text-sm md:text-base leading-loose"
              dangerouslySetInnerHTML={{ __html: seoData.description }}
            ></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
