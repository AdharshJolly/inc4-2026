import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InC4 2026 | International Conference on Contemporary Computing and Communications",
  description: "Join the fourth edition of International Conference on Contemporary Computing and Communications (InC4) at CHRIST University, Bengaluru. August 7-8, 2026.",
  keywords: "IEEE, InC4, conference, computing, communications, Bengaluru, CHRIST University, research, technology, 2026",
  openGraph: {
    title: "InC4 2026 | International Conference on Contemporary Computing and Communications",
    description: "Join the fourth edition of International Conference on Contemporary Computing and Communications (InC4) at CHRIST University, Bengaluru. August 7-8, 2026.",
    type: "website",
    url: "https://ic4.co.in/",
    images: ["https://ic4.co.in/images/InC4 Logo White.png"],
  },
  alternates: {
    canonical: "https://ic4.co.in/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Marquee />
      <AboutSection />
      <CTASection />
    </main>
  );
}
