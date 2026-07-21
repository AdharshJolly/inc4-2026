import { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import ScheduleClient from "./ScheduleClient";
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

// Revalidate every 60 seconds (ISR) — balances freshness with performance
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
  const { days, events, papers } = await getScheduleData();

  return (
    <ScheduleClient
      initialDays={days}
      initialEvents={events}
      initialPapers={papers}
    />
  );
}
