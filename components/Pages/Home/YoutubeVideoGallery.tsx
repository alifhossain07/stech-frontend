"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type YoutubeGalleryResponse = {
  data?: { youtube_video_links?: string[] };
};

const extractYoutubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.replace("/shorts/", "");
      return parsed.searchParams.get("v");
    }
    return null;
  } catch { return null; }
};

const toEmbedUrl = (url: string): string => {
  const id = extractYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1` : "";
};

const YoutubeVideoGallery = () => {
  const [links, setLinks] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get<YoutubeGalleryResponse>("/api/home/youtube-video-gallery");
        setLinks(res.data?.data?.youtube_video_links ?? []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally { setLoading(false); }
    };
    fetchGallery();
  }, []);

  const slides = useMemo(() => {
    return links.map((link) => ({ rawUrl: link, embedUrl: toEmbedUrl(link) }))
      .filter((item) => Boolean(item.embedUrl));
  }, [links]);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  if (loading) return <div className="h-[460px] animate-pulse bg-gray-200 rounded-3xl" />;
  if (!slides.length) return null;

  return (
    <section className="w-full max-w-6xl mx-auto pb-14 pt-2 overflow-hidden">
      <div className="text-center space-y-1 mb-2">
        <h2 className="text-2xl md:text-4xl font-semibold">Video Gallery</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Swipe through featured YouTube stories from Sannai.
        </p>
      </div>

      <div className="relative h-[260px] sm:h-[350px] md:h-[500px] [perspective:1200px] flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-[42%] -translate-y-1/2 z-40 p-3 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 z-40 top-[42%] -translate-y-1/2 p-3 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95"
        >
          <FaChevronRight />
        </button>

        {/* The Card Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {slides.map((slide, index) => {
            // Logic to calculate relative position (-1, 0, 1)
            let offset = index - activeIndex;
            
            // Handle looping math
            if (offset < -Math.floor(slides.length / 2)) offset += slides.length;
            if (offset > Math.floor(slides.length / 2)) offset -= slides.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1; // Only show prev, active, next

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`absolute w-[70%] md:w-[50%] h-[80%] transition-all duration-700 ease-in-out cursor-pointer
                  ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                style={{
                  zIndex: isActive ? 30 : 20,
                  transform: `
                    translateX(${offset * 50}%) 
                    translateY(-50%)
                    scale(${isActive ? 1 : 0.8}) 
                    rotateY(${offset * -30}deg)
                  `,
                  top: '45%',
                  transformStyle: "preserve-3d",
                }}
              >
                <div className={`relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 transition-all duration-700
                  ${!isActive ? "blur-[2px] opacity-60 grayscale-[0.5]" : "shadow-[0_20px_60px_rgba(0,0,0,0.5)]"}
                `}>
                  {/* We use a div overlay to prevent iframe interaction on tilted cards */}
                  {!isActive && <div className="absolute inset-0 z-10" />}
                  
                  <iframe
                    src={slide.embedUrl}
                    title={`Video ${index}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />

                  {isActive && (
                    <a
                      href={slide.rawUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs px-4 py-2 rounded-full border border-white/20 hover:bg-black/80 transition"
                    >
                      Watch on YouTube
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full ${i === activeIndex ? "w-8 bg-orange-500" : "w-2 bg-gray-300"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default YoutubeVideoGallery;