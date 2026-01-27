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


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



// --- Metadata ---
export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sannai Technology";
  const fallbackDescription = "A Project By Techdyno BD LTD";

  const settings = await fetchBusinessSettings();

  if (!settings) {
    return { title: fallbackTitle, description: fallbackDescription };
  }

  const getMetaValue = (key: string): string | undefined => {
    interface Setting {
      key?: string;
      type?: string;
      value?: string;
    }
    const item = settings.find((s: Setting) => s.key === key || s.type === key);
    return (item && item.value != null) ? item.value : undefined;
  };

  const title = getMetaValue("meta_title") || getMetaValue("website_name") || fallbackTitle;
  const description = getMetaValue("meta_description") || fallbackDescription;
  const siteIcon = getMetaValue("site_icon") || "/images/sannailogo.png";

  return {
    title,
    description,
    icons: {
      icon: [{ url: siteIcon, sizes: "any" }],
      shortcut: [{ url: siteIcon }],
      apple: [{ url: siteIcon }],
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
              <Navbar />
              <Providers>
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
              </Providers>
              <Footer />

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