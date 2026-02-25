import React from "react";
import ContactContent from "./ContactContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Sannai Technology Limited",
  description: "Get in touch with Sannai Technology Limited. We are here to help you with any inquiries or feedback.",
};

export default function ContactPage() {
  return <ContactContent />;
}
