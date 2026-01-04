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
import Script from "next/script";
import FacebookPixelEvents from "@/components/layout/FacebookPixelEvents";
import GTM from "@/components/layout/GTM";
// Ensure this path matches your file structure

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

  const resolveIconType = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".ico")) return "image/x-icon";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".svg")) return "image/svg+xml";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    return "image/x-icon";
  };

  const iconUrl = siteIcon || "/images/sannailogo.png";
  const iconType = resolveIconType(iconUrl);

  return {
    title,
    description,
    icons: {
      icon: [{ url: iconUrl, type: iconType, sizes: "any" }],
      shortcut: [{ url: iconUrl, type: iconType }],
      apple: [{ url: iconUrl, type: iconType }],
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
      <head>
        {/* Meta Pixel NoScript Fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1102240858090249&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* GTM Noscript Fallback - Must be as high in <body> as possible */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NWDSC8PR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <AuthProvider>
          <CartProvider>
            <Navbar />
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
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

        {/* Google Tag Manager Main Script */}
        <GTM />

        {/* Initialize Facebook Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1102240858090249');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Component to handle PageView on route changes */}
        <FacebookPixelEvents />
      </body>
    </html>
  );
}