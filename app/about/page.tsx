import React from "react";
import AboutContent from "./AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sannai Technology Limited",
  description: "Learn about Sannai Technology Limited, our mission, vision, and commitment to providing premium mobile accessories in Bangladesh.",
};

export default function AboutPage() {
  return <AboutContent />;
}