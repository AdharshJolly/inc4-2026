import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { SpeakersSection } from "@/components/SpeakersSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <Marquee />
      <AboutSection />
      <SpeakersSection />
      <CTASection />
    </main>
  );
};

export default Index;
