import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { CartProvider } from "./context/CartContext";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Adjust as needed
});

export const metadata: Metadata = {
  title: "Sannai Technology",
  description: "A Project By Techdyno BD LTD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      {/* Add the font variable to <html> */}
      <body className={`${poppins.variable} antialiased`}>
        <CartProvider>
     <Navbar />
     <ClientLayoutWrapper>
        {children}
        </ClientLayoutWrapper>
        <Footer/>
        </CartProvider>
      </body>
    </html>
  );
}
