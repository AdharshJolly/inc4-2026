import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { SponsorsSection } from "@/components/SponsorsSection";
import { SpeakersSection } from "@/components/SpeakersSection";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title:
      "InC4 2026 | International Conference on Contemporary Computing and Communications",
    description:
      "Join the fourth edition of International Conference on Contemporary Computing and Communications (InC4) at CHRIST University, Bengaluru. August 7-8, 2026.",
    keywords:
      "IEEE, InC4, conference, computing, communications, Bengaluru, CHRIST University, research, technology, 2026",
    ogType: "event",
    canonicalUrl: "https://ic4.co.in/",
  });

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Marquee />
      <AboutSection />
      {/* <SpeakersSection /> */}
      {/* <SponsorsSection /> */}
      <CTASection />
    </main>
  );
};

export default Index;
