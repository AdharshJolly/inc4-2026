import { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

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

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [daysRes, eventsRes, papersRes] = await Promise.all([
    supabase.from("schedule_days").select("*").order("sort_order"),
    supabase.from("schedule_events").select("*").order("sort_order"),
    supabase.from("schedule_papers").select("*").order("sort_order"),
  ]);

  const days = (daysRes.data as ScheduleDay[]) || [];
  const events = (eventsRes.data as ScheduleEvent[]) || [];
  const papers = (papersRes.data as SchedulePaper[]) || [];

  return (
    <ScheduleClient
      initialDays={days}
      initialEvents={events}
      initialPapers={papers}
    />
  );
}
