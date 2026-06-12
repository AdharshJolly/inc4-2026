import { HeroSection } from "@/components/home/HeroSection";
import { Marquee } from "@/components/home/Marquee";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";

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
