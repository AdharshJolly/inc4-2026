import { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getFeatureFlag } from "@/lib/featureFlags";
import ScheduleClient from "./ScheduleClient";
import { PageTitle } from "@/components/common/PageTitle";
import { Reveal } from "@/components/common/Reveal";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { ScheduleDay, ScheduleEvent, SchedulePaper } from "@/types/data";

export const metadata: Metadata = {
  title: "Conference Schedule | InC4 2026",
  description:
    "View the complete schedule for InC4 2026. Keynote speeches, technical sessions, and timings for August 7-8, 2026 at CHRIST University, Bengaluru.",
  keywords:
    "InC4 schedule, conference agenda, keynote speakers, technical sessions, August 2026, Bengaluru",
  openGraph: {
    title: "Conference Schedule | InC4 2026",
    description: "View the complete schedule for InC4 2026.",
    type: "website",
    url: "https://ic4.co.in/schedule",
  },
  alternates: {
    canonical: "https://ic4.co.in/schedule",
  },
};

export const revalidate = 60;

async function getScheduleData(): Promise<{
  days: ScheduleDay[];
  events: ScheduleEvent[];
  papers: SchedulePaper[];
}> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const [daysRes, eventsRes, papersRes] = await Promise.all([
      supabase.from("schedule_days").select("*").order("sort_order"),
      supabase.from("schedule_events").select("*").order("sort_order"),
      supabase.from("schedule_papers").select("*").order("sort_order"),
    ]);

    return {
      days: (daysRes.data || []) as ScheduleDay[],
      events: (eventsRes.data || []) as ScheduleEvent[],
      papers: (papersRes.data || []) as SchedulePaper[],
    };
  } catch (err) {
    console.error("Failed to fetch schedule data server-side:", err);
    return { days: [], events: [], papers: [] };
  }
}

export default async function SchedulePage() {
  const [scheduleVisible, { days, events, papers }] = await Promise.all([
    getFeatureFlag("schedule_visible", false),
    getScheduleData(),
  ]);

  if (!scheduleVisible) {
    return (
      <div className="min-h-screen bg-background">
        <PageTitle title="Schedule" />

        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="relative">
              <Reveal width="100%">
                <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                      <Calendar className="w-4 h-4" /> Conference Agenda
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                      August 7-8, 2026
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Join us for two days of insightful keynotes, technical
                      sessions, and networking opportunities at CHRIST University,
                      Bengaluru.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="flex items-center gap-2 text-sm bg-secondary/20 px-4 py-2 rounded-lg text-secondary-foreground border border-border">
                        <MapPin className="w-4 h-4 text-primary" /> Kengeri
                        Campus, Bengaluru
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-secondary/20 px-4 py-2 rounded-lg text-secondary-foreground border border-border">
                        <Clock className="w-4 h-4 text-primary" /> IST (Indian
                        Standard Time)
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />
                </div>
              </Reveal>
            </section>

            {/* Schedule To Be Announced Placeholder */}
            <div className="py-20 text-center space-y-8">
              <Reveal width="100%">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-primary/5 rounded-full border border-primary/10">
                    <Calendar className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Detailed Schedule Coming Soon
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We are currently finalizing the agenda for InC4 2026. Please
                  check back later for the complete schedule of keynotes and
                  technical sessions.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScheduleClient
      initialDays={days}
      initialEvents={events}
      initialPapers={papers}
    />
  );
}
