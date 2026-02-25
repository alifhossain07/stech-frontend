import React from "react";
import CheckoutContent from "./CheckoutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Sannai Technology Limited",
  description: "Securely complete your purchase of premium mobile accessories at Sannai Technology. Multiple payment options available.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
