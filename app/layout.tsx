import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import Analytics from "@/components/Analytics";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auxeira | Evidence Intelligence for Africa",
  description:
    "Auxeira delivers evidence, economic analysis and impact intelligence to funders, governments and social sector organisations across Africa.",
  openGraph: {
    title: "Auxeira | Evidence Intelligence for Africa",
    description:
      "Bringing a billion data points online that the world doesn't know exist.",
    url: "https://auxeira.com",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "website",
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <ScrollProgress />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
