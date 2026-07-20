import { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";

export const metadata: Metadata = {
  title: "Conference Schedule | InC4 2026",
  description: "View the complete schedule for InC4 2026. Keynote speeches, technical sessions, and timings for August 7-8, 2026 at CHRIST University, Bengaluru.",
  keywords: "InC4 schedule, conference agenda, keynote speakers, technical sessions, August 2026, Bengaluru",
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

export default function SchedulePage() {
  return <ScheduleClient />;
}
