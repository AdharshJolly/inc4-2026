import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemaOrg } from "@/components/SchemaOrg";
import { PreviewModeBanner } from "@/components/PreviewModeBanner";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "InC4 2026 - International Conference on Contemporary Computing and Communications",
  description: "The fourth edition of International Conference on Contemporary Computing and Communications",
  verification: {
    google: "4prcouKfo645DwvNat-O8rq_AkPLzAzRNMnA4qssBKI",
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
};

import { ContentWrapper } from "@/components/ContentWrapper";

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
