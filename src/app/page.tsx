import { HeroSection } from "@/components/home/HeroSection";
import { Marquee } from "@/components/home/Marquee";
import { AboutSection } from "@/components/home/AboutSection";
import { SpeakersSection } from "@/components/sections/SpeakersSection";
import { CTASection } from "@/components/home/CTASection";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: partners } = await supabase
    .from('partners')
    .select()
    .order('order_index');

  return (
    <main className="min-h-screen bg-background">
      <HeroSection initialPartners={partners || []} />
      <Marquee />
      <SpeakersSection />
      <AboutSection />
      <CTASection />
    </main>
  );
}
