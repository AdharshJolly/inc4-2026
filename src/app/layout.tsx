import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/common/Providers";
import { SchemaOrg } from "@/components/common/SchemaOrg";
import { PreviewModeBanner } from "@/components/common/PreviewModeBanner";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Analytics } from "@/components/common/Analytics";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ic4.co.in"),
  title: {
    default:
      "InC4 2026 | 2026 IEEE International Conference on Contemporary Computing and Communications",
    template: "%s | InC4 2026",
  },
  description:
    "The 2026 IEEE International Conference on Contemporary Computing and Communications (InC4) - Conference#70839 at CHRIST University, Bengaluru. August 7-8, 2026.",
  keywords: [
    "InC4",
    "IEEE",
    "Conference",
    "Computing",
    "Communications",
    "Bengaluru",
    "Christ University",
    "Research",
  ],
  authors: [{ name: "IEEE Computer Society Bangalore Chapter" }, { name: "Adharsh Jolly", url: "https://github.com/AdharshJolly" }],
  creator: "Adharsh Jolly",
  publisher: "CHRIST (Deemed to be University)",
  verification: {
    google: "4prcouKfo645DwvNat-O8rq_AkPLzAzRNMnA4qssBKI",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ic4.co.in",
    siteName: "InC4 2026",
    title:
      "InC4 2026 | 2026 IEEE International Conference on Contemporary Computing and Communications",
    description:
      "The 2026 IEEE International Conference on Contemporary Computing and Communications (InC4) - Conference#70839 at CHRIST University, Bengaluru. August 7-8, 2026.",
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
    title:
      "InC4 2026 | 2026 IEEE International Conference on Contemporary Computing and Communications",
    description:
      "Join us at InC4 2026, the 2026 IEEE International Conference on Contemporary Computing and Communications - Conference#70839.",
    images: ["/images/InC4 Logo White.png"],
    creator: "@ieeecomputers",
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
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="author" content="Adharsh Jolly" />
        <meta name="creator" content="Adharsh Jolly" />
        <meta name="developer" content="Adharsh Jolly" />
        <meta name="generator" content="Next.js" />
        <meta property="og:site_name" content="InC4 2026" />
        <meta property="og:see_also" content="https://github.com/AdharshJolly" />
      </head>
      <body className="bg-background text-foreground antialiased font-sans">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  analytics_storage: 'denied',
                  functionality_storage: 'denied',
                  personalization_storage: 'denied',
                  security_storage: 'granted',
                  wait_for_update: 500
                });
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                  send_page_view: false
                });
              `}
            </Script>
          </>
        ) : null}
        <Providers>
          <ConditionalLayout>
            <SchemaOrg />
            {gaId ? <Analytics /> : null}
            <PreviewModeBanner />
            <ContentWrapper>
              <main>{children}</main>
            </ContentWrapper>
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
