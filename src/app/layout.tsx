import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SchemaOrg } from "@/components/common/SchemaOrg";
import { PreviewModeBanner } from "@/components/common/PreviewModeBanner";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ContentWrapper } from "@/components/layout/ContentWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ic4.co.in"),
  title: {
    default: "InC4 2026 - International Conference on Contemporary Computing and Communications",
    template: "%s | InC4 2026",
  },
  description: "The fourth edition of International Conference on Contemporary Computing and Communications (InC4) at CHRIST University, Bengaluru. August 7-8, 2026.",
  keywords: ["InC4", "IEEE", "Conference", "Computing", "Communications", "Bengaluru", "Christ University", "Research"],
  authors: [{ name: "IEEE Computer Society Bangalore Chapter" }],
  creator: "IEEE Computer Society Bangalore Chapter",
  publisher: "CHRIST (Deemed to be University)",
  verification: {
    google: "4prcouKfo645DwvNat-O8rq_AkPLzAzRNMnA4qssBKI",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ic4.co.in",
    siteName: "InC4 2026",
    title: "InC4 2026 - International Conference on Contemporary Computing and Communications",
    description: "The fourth edition of International Conference on Contemporary Computing and Communications (InC4) at CHRIST University, Bengaluru. August 7-8, 2026.",
    images: [
      {
        url: "/images/InC4 Logo White.png",
        width: 1200,
        height: 630,
        alt: "InC4 2026 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InC4 2026 - International Conference on Contemporary Computing and Communications",
    description: "Join us at InC4 2026, the premier international conference on contemporary computing and communications.",
    images: ["/images/InC4 Logo White.png"],
    creator: "@ieeecomputers", // Assuming this handle based on schema data
  },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-foreground antialiased font-sans">
        <Providers>
          <ScrollToTop />
          <SchemaOrg />
          <PreviewModeBanner />
          <Navbar />
          <ContentWrapper>
            <main>{children}</main>
          </ContentWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}