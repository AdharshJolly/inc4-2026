import { PageTitle } from "@/components/common/PageTitle";
import { Reveal } from "@/components/common/Reveal";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conference Schedule | InC4 2026",
  description: "View the complete schedule for InC4 2026. See keynote speeches, technical sessions, and timings for August 7-8, 2026 at CHRIST University, Bengaluru.",
  keywords: "InC4 schedule, conference agenda, keynote speakers, technical sessions, August 2026, Bengaluru",
  openGraph: {
    title: "Conference Schedule | InC4 2026",
    description: "View the complete schedule for InC4 2026. See keynote speeches, technical sessions, and timings for August 7-8, 2026 at CHRIST University, Bengaluru.",
    type: "website",
    url: "https://ic4.co.in/schedule",
  },
  alternates: {
    canonical: "https://ic4.co.in/schedule",
  },
};

export default function SchedulePage() {
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
                    Bengaluru and Online.
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
