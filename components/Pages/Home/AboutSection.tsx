"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";

// Define a type for the SEO data
interface InfoRow {
  title: string;
  paragraph: string;
}

const Shimmer = () => {
  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
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
  const [infoRows, setInfoRows] = useState<InfoRow[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const res = await axios.get("/api/home-info-seo");
        if (res.data.success) {
          setInfoRows(res.data.rows);
          setBanner(res.data.banner);
        } else {
          console.error("API error:", res.data.error);
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
    return <Shimmer />;
  }

  const renderCard = (row: InfoRow, index: number) => {
    const isOpen = openIndex === index;
    return (
      <div key={index} className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {/* Mobile Header (Accordion Style) */}
        <div
          onClick={() => toggleAccordion(index)}
          className="md:hidden flex items-center justify-between p-4 cursor-pointer select-none bg-black text-white rounded-md m-2"
        >
          <span className="text-sm font-semibold">{row.title}</span>
          <FiChevronDown
            className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
              }`}
          />
        </div>

        {/* Desktop Header */}
        <h3 className="hidden md:inline-block bg-black text-white text-sm md:text-base font-semibold px-4 py-5 rounded-md mb-2  ">
          {row.title}
        </h3>

        {/* Paragraph Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
            }`}
        >
          <p className="text-gray-600 text-justify p-4 text-sm md:text-base leading-loose">
            {row.paragraph}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-11/12 mx-auto pb-[56px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render the first row */}
        {infoRows[0] && renderCard(infoRows[0], 0)}

        {/* Card 2 - Dynamic Image */}
        <div className="bg-white hidden md:block shadow-md rounded-xl border border-gray-200 relative overflow-hidden h-[300px] md:h-auto">
          {banner ? (
            <Image src={banner} alt="Gadget Showcase" fill className="object-contain rounded-xl" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Image src="/images/aboutimage2.jpg" alt="Gadget Showcase" fill className="object-contain rounded-xl" />
            </div>
          )}
        </div>

        {/* Render the rest of the rows (1 to 4) */}
        {infoRows.slice(1, 5).map((row, index) => renderCard(row, index + 1))}
      </div>
    </div>
  );
};

export default AboutSection;
