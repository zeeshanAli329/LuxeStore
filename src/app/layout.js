import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { StoreProvider } from "@/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { COMPANY_NAME, Tagline } from "./constants/names";

const siteConfig = {
  name: COMPANY_NAME,
  description: `${COMPANY_NAME} - ${Tagline}. Experience premium fashion and curated lifestyle products. Quality meets elegance in every collection.`,
  url: "https://luxestore-ecommerce.vercel.app",
  ogImage: "https://luxestore-ecommerce.vercel.app/og-image.jpg",
  links: {
    twitter: "https://twitter.com/luxestore",
  },
};

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${COMPANY_NAME} | ${Tagline} - Premium Online Store`,
    template: `${COMPANY_NAME} | %s`,
  },
  description: siteConfig.description,
  keywords: ["e-commerce", "luxury fashion", "premium products", "online shopping", COMPANY_NAME, "buy clothes online", "luxury lifestyle"],
  authors: [
    {
      name: `${COMPANY_NAME} Team`,
      url: siteConfig.url,
    },
  ],
  creator: COMPANY_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@luxestore",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import WhatsAppButton from "@/components/WhatsAppButton";
import ComingSoonPage from "./coming-soon/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* <StoreProvider>
          <ClientLayout>
            {children}
            <WhatsAppButton />
          </ClientLayout>
        </StoreProvider> */}
        <ComingSoonPage />
      </body>
    </html>
  );
}

