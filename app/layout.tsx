export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script";

// Import your new consolidated library functions
import { fetchBusinessSettings, fetchScriptsInternal } from "@/app/lib/get-scripts";
import { CompareProvider } from "./context/CompareContext";
import { LanguageProvider } from "./context/LanguageContext";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



// --- Metadata ---
// --- Metadata ---
export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Sannai Technology Limited | Premium Mobile Accessories in Bangladesh";
  const defaultDescription = "Sannai Technology Limited is a leading mobile accessories brand in Bangladesh offering high-quality chargers, power banks, earbuds, cables, and smart gadgets at affordable prices.";

  const settings = await fetchBusinessSettings();

  const getMetaValue = (key: string): string | undefined => {
    if (!settings) return undefined;
    interface Setting {
      key?: string;
      type?: string;
      value?: string;
    }
    const item = settings.find((s: Setting) => s.key === key || s.type === key);
    return (item && item.value != null) ? item.value : undefined;
  };

  const siteIcon = getMetaValue("site_icon") || "/images/sannailogo.png";
  const headerLogo = getMetaValue("header_logo") || "/images/sannailogo.png";
  const facebookShare = getMetaValue("meta_image") || "/images/sannailogo.png";
  return {
    title: defaultTitle,
    description: defaultDescription,
    icons: {
      icon: [{ url: siteIcon, sizes: "any" }],
      shortcut: [{ url: siteIcon }],
      apple: [{ url: siteIcon }],
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      images: [{ url: facebookShare }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [headerLogo],
    },
  };
}

// --- Layout ---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch scripts directly via the lib (No internal HTTP fetch loop)
  const scripts = await fetchScriptsInternal();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {scripts?.header_script && (
          <Script
            id="dynamic-header-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: (scripts.header_script || "").trim(),
            }}
          />
        )}
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {scripts?.footer_script && (
          <div
            id="dynamic-footer-scripts"
            dangerouslySetInnerHTML={{ __html: scripts.footer_script }}
          />
        )}

        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <LanguageProvider>
                <Navbar />
                <Providers>
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </Providers>
                <Footer />
              </LanguageProvider>

              {/* <Script id="tawk-script" strategy="afterInteractive">
                {`
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

    Tawk_API.customStyle = {
        visibility : {
            desktop : {
                position : 'br', // Keeps desktop at Bottom-Right
                xOffset : 20,
                yOffset : 20
            },
            mobile : {
                position : 'cr', // 'cr' stands for Center-Right
                xOffset : 0,     // 0px gap from the right edge
                yOffset : 0      // 0px offset from the vertical center
            }
        }
    };

    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/${process.env.NEXT_PUBLIC_TAWK_WIDGET_ID}';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
  `}
              </Script> */}
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}