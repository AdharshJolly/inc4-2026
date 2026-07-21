import { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getFeatureFlag } from "@/lib/featureFlags";
import ScheduleClient from "./ScheduleClient";
import { Calendar, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="p-4 bg-muted rounded-full">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Schedule Coming Soon
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                The detailed conference schedule will be published shortly.
                Check back later or follow us for updates.
              </p>
              <div className="flex gap-3 pt-4">
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
                <Link href="/important-dates">
                  <Button>View Important Dates</Button>
                </Link>
              </div>
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
