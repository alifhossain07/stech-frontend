export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";



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
         <AuthProvider>
        <CartProvider>
     <Navbar />
 
     <ClientLayoutWrapper>
        {children}
        </ClientLayoutWrapper>
        
        <Footer/>
            <Toaster
    position="top-right"
    reverseOrder={false}
    toastOptions={{
      duration: 3000,
      style: {
        fontWeight: 500,
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
    }}
  />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
