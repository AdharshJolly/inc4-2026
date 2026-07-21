"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type {
  ScheduleDay,
  ScheduleEvent,
  SchedulePaper,
} from "@/types/data";
import { PageTitle } from "@/components/common/PageTitle";
import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Mic,
  MapPin,
  User,
  FileText,
  Coffee,
  Clock,
  Users,
  Loader2,
} from "lucide-react";

// ── Event type styling config ──
const EVENT_STYLES: Record<
  ScheduleEvent["event_type"],
  {
    border: string;
    bg: string;
    badge: string;
    icon: React.ReactNode;
    compact?: boolean;
  }
> = {
  keynote: {
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: <Mic className="w-3.5 h-3.5" />,
  },
  inauguration: {
    border: "border-violet-500",
    bg: "bg-violet-500/10",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  valedictory: {
    border: "border-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  session: {
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  lunch: {
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <Coffee className="w-3.5 h-3.5" />,
    compact: true,
  },
  high_tea: {
    border: "border-pink-500",
    bg: "bg-pink-500/10",
    badge: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: <Coffee className="w-3.5 h-3.5" />,
    compact: true,
  },
  break: {
    border: "border-gray-500",
    bg: "bg-gray-500/10",
    badge: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    icon: <Clock className="w-3.5 h-3.5" />,
    compact: true,
  },
  other: {
    border: "border-border",
    bg: "bg-card",
    badge: "bg-secondary/50 text-muted-foreground border-border",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
};

// ── Time formatting ──
function formatTime(time: string): string {
  // Handle "09:00" (HTML time input) or "09:00 AM" (already formatted)
  if (time.includes("AM") || time.includes("PM")) return time;
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

const EVENT_TYPE_LABELS: Record<ScheduleEvent["event_type"], string> = {
  keynote: "Keynote",
  inauguration: "Inauguration",
  valedictory: "Valedictory",
  session: "Session",
  lunch: "Lunch",
  high_tea: "High Tea",
  break: "Break",
  other: "Event",
};

// ── Skeleton loader ──
function ScheduleSkeleton() {
  return (
    <div className="space-y-8">
      {/* Tab skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-24 rounded-full bg-muted animate-pulse" />
        <div className="h-10 w-24 rounded-full bg-muted animate-pulse" />
      </div>
      {/* Timeline skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-8 w-20 bg-muted rounded animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-24 bg-muted rounded-xl animate-pulse" />
            {i % 2 === 0 && (
              <div className="h-24 bg-muted rounded-xl animate-pulse" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Event Card ──
function EventCard({ event, papers }: { event: ScheduleEvent; papers: SchedulePaper[] }) {
  const style = EVENT_STYLES[event.event_type] || EVENT_STYLES.other;

  if (style.compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl border",
          style.border,
          style.bg
        )}
      >
        <div className="shrink-0">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">{event.title}</span>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatTime(event.time_start)} – {formatTime(event.time_end)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all hover:shadow-md",
        style.border,
        style.bg
      )}
    >
      {/* Badge + Title */}
      <div className="flex items-start gap-3 mb-3">
        <Badge
          className={cn("shrink-0 gap-1.5", style.badge)}
          variant="outline"
        >
          {style.icon}
          {EVENT_TYPE_LABELS[event.event_type]}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold leading-snug mb-2">{event.title}</h3>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
        )}
        {event.session_chair && (
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {event.session_chair}
          </span>
        )}
      </div>

      {/* Papers */}
      {papers.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
          {papers.map((paper) => (
            <div key={paper.id} className="flex flex-col">
              <span className="text-sm font-medium leading-snug">
                {paper.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {paper.presenter}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Time Slot Group ──
interface TimeSlotGroup {
  timeKey: string;
  timeLabel: string;
  events: ScheduleEvent[];
  papersByEvent: Map<string, SchedulePaper[]>;
}

function TimeSlot({ group }: { group: TimeSlotGroup }) {
  const { timeLabel, events, papersByEvent } = group;
  const isParallel = events.length > 1;

  return (
    <div className="flex gap-4">
      {/* Time label - hidden on mobile */}
      <div className="shrink-0 w-20 pt-2 text-right hidden sm:block">
        <span className="text-sm font-mono font-medium text-muted-foreground">
          {formatTime(timeLabel)}
        </span>
      </div>

      {/* Dot + line - hidden on mobile */}
      <div className="relative flex flex-col items-center shrink-0 hidden sm:flex">
        <div className="w-3 h-3 rounded-full bg-primary border-2 border-background z-10 mt-3" />
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Events */}
      <div className="flex-1 pb-8 min-w-0">
        {/* Mobile time label */}
        <div className="sm:hidden mb-2">
          <span className="text-xs font-mono font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            {formatTime(timeLabel)}
          </span>
        </div>
        {isParallel ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                papers={papersByEvent.get(event.id) || []}
              />
            ))}
          </div>
        ) : (
          <EventCard
            event={events[0]}
            papers={papersByEvent.get(events[0].id) || []}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Client Component ──
export default function ScheduleClient() {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [papers, setPapers] = useState<SchedulePaper[]>([]);
  const [activeDay, setActiveDay] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        const [daysRes, eventsRes, papersRes] = await Promise.all([
          supabase.from("schedule_days").select("*").order("sort_order"),
          supabase.from("schedule_events").select("*").order("sort_order"),
          supabase.from("schedule_papers").select("*").order("sort_order"),
        ]);

        if (daysRes.error) throw daysRes.error;
        if (eventsRes.error) throw eventsRes.error;
        if (papersRes.error) throw papersRes.error;

        const fetchedDays = (daysRes.data || []) as ScheduleDay[];
        const fetchedEvents = (eventsRes.data || []) as ScheduleEvent[];
        const fetchedPapers = (papersRes.data || []) as SchedulePaper[];

        setDays(fetchedDays);
        setEvents(fetchedEvents);
        setPapers(fetchedPapers);

        if (fetchedDays.length > 0) {
          setActiveDay(fetchedDays[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setError("Failed to load schedule. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter events for active day
  const dayEvents = useMemo(
    () => events.filter((e) => e.day_id === activeDay),
    [events, activeDay]
  );

  // Group events by time slot
  const timeSlots = useMemo((): TimeSlotGroup[] => {
    const grouped = new Map<string, TimeSlotGroup>();
    const papersByEvent = new Map<string, SchedulePaper[]>();

    // Build papers map
    for (const p of papers) {
      const existing = papersByEvent.get(p.event_id) || [];
      existing.push(p);
      papersByEvent.set(p.event_id, existing);
    }

    for (const event of dayEvents) {
      const timeKey = `${event.time_start}-${event.time_end}`;
      if (!grouped.has(timeKey)) {
        grouped.set(timeKey, {
          timeKey,
          timeLabel: event.time_start,
          events: [],
          papersByEvent,
        });
      }
      grouped.get(timeKey)!.events.push(event);
    }

    return Array.from(grouped.values());
  }, [dayEvents, papers]);

  const activeDayData = days.find((d) => d.id === activeDay);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageTitle title="Schedule" />
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <ScheduleSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PageTitle title="Schedule" />
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto text-center py-20">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Schedule" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Hero info */}
          <Reveal width="100%">
            <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
                <Calendar className="w-4 h-4" />
                Conference Agenda
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                August 7–8, 2026
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                CHRIST University, Kengeri Campus, Bengaluru · IST
              </p>
            </div>
          </Reveal>

          {/* Day tabs */}
          {days.length > 0 && (
            <Reveal width="100%">
              <div className="flex gap-3 justify-center">
                {days.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setActiveDay(day.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-semibold transition-all border",
                      activeDay === day.id
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Active day info */}
          {activeDayData && (
            <div className="text-center text-sm text-muted-foreground">
              {activeDayData.date}
            </div>
          )}

          {/* Timeline */}
          {timeSlots.length === 0 ? (
            <Reveal width="100%">
              <div className="text-center py-20 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Events Scheduled</h3>
                <p className="text-muted-foreground">
                  The schedule for this day has not been published yet.
                </p>
              </div>
            </Reveal>
          ) : (
            <div>
              {timeSlots.map((group) => (
                <TimeSlot key={group.timeKey} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
