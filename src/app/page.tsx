import { HeroSection } from "@/components/HeroSection";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";

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
