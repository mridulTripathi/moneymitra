import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free Financial Calculators for India`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Free financial calculators for salaried Indians — EMI, SIP, home loan prepayment, and tax regime comparator. Instant results, no signup needed.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "EMI calculator India",
    "home loan EMI calculator",
    "SIP calculator",
    "new vs old tax regime 2025",
    "home loan prepayment calculator",
    "income tax calculator India",
    "mutual fund SIP returns",
    "step-up SIP calculator",
    "loan prepayment interest savings",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>₹</text></svg>",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {umamiUrl && umamiWebsiteId && (
          <script
            defer
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiWebsiteId}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] transition-colors">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
