"use client";

import { useState } from "react";
import CartSidebar from "@/components/layout/CartSidebar";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [externalOpen, setExternalOpen] = useState(false);

  return (
    <>
      <CartSidebar externalOpen={externalOpen} setExternalOpen={setExternalOpen} />
      {children}
    </>
  );
}
