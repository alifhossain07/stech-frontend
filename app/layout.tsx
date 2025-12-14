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
// import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
// import GTM from "@/components/layout/GTM";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type BusinessSetting = {
  key: string;
  value: string | null;
};

type InfoRouteResponse = {
  success?: boolean;
  settings?: BusinessSetting[];
};

async function getBusinessSettings(): Promise<BusinessSetting[] | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${base}/api/info`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json: InfoRouteResponse = await res.json();
    if (!json.success || !json.settings) return null;

    return json.settings;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sannai Technology";
  const fallbackDescription = "A Project By Techdyno BD LTD";

  const settings = await getBusinessSettings();
  if (!settings) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const getMetaValue = (key: string): string | undefined => {
    const item = settings.find((s) => s.key === key);
    if (!item || item.value == null) return undefined;
    return item.value;
  };

  const title =
    getMetaValue("meta_title") ||
    getMetaValue("website_name") ||
    fallbackTitle;

  const description =
    getMetaValue("meta_description") || fallbackDescription;

  const siteIcon = getMetaValue("site_icon");
 console.log("site_icon value:", siteIcon);
  return {
    title,
    description,
    // Dynamic favicon from business settings, fallback to local favicon
    icons: {
      icon: siteIcon || "/favicon.ico",
      shortcut: siteIcon || "/favicon.ico",
      apple: siteIcon || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        {/* <GoogleAnalytics id="G-S4ED028867" /> */}
        {/* <GTM /> */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Footer />
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
