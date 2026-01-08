"use client";

import React, { useEffect, useState } from "react";
import { AboutPageResponse, AboutData } from "@/types/about";
import AboutBanner from "./AboutBanner";
import Commitment from "./Commitment";
import Features from "./Features";
import FutureVision from "./FutureVision";
import MarqueeGallery from "./MarqueeGallery";
import MissonVission from "./MissonVission";
import NewsLetter from "./NewsLetter";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      // Ensure this matches your route path: api/about
      const response = await fetch("/api/about");
      const result: AboutPageResponse = await response.json();

      if (result.result && result.data) {
        setAboutData(result.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (!aboutData) {
    return <div className="text-center py-20">Error loading page content</div>;
  }

  return (
    <div className="w-11/12 mx-auto py-12">
      <AboutBanner
        hero_image={aboutData.hero_image}
        hero_heading={aboutData.hero_heading}
        hero_description={aboutData.hero_description}
        feature_cards={aboutData.feature_cards}
      />

      <MissonVission
        mission_icon={aboutData.mission_icon}
        mission_title={aboutData.mission_title}
        mission_description={aboutData.mission_description}
        vision_icon={aboutData.vision_icon}
        vision_title={aboutData.vision_title}
        vision_description={aboutData.vision_description}
      />

      <FutureVision
        future_image={aboutData.future_image}
        future_title={aboutData.future_title}
        future_description={aboutData.future_description}
      />

      <Commitment
        commitment_image={aboutData.commitment_image}
        commitment_title={aboutData.commitment_title}
        commitment_description={aboutData.commitment_description}
      />

      <Features highlights={aboutData.highlights} />

      <MarqueeGallery social_posts={aboutData.social_posts} />

      <NewsLetter />
    </div>
  );
}