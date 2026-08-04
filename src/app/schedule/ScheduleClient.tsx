"use client";

import { useState, useMemo } from "react";
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
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

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
    border: "border-primary/40",
    bg: "bg-primary/5 backdrop-blur-md",
    badge: "bg-primary/20 text-primary border-primary/30",
    icon: <Mic className="w-3.5 h-3.5" />,
  },
  inauguration: {
    border: "border-accent/40",
    bg: "bg-accent/5 backdrop-blur-md",
    badge: "bg-accent/20 text-accent border-accent/30",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  valedictory: {
    border: "border-secondary/40",
    bg: "bg-secondary/5 backdrop-blur-md",
    badge: "bg-secondary/20 text-secondary border-secondary/30",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  session: {
    border: "border-secondary/30",
    bg: "bg-secondary/5 backdrop-blur-md",
    badge: "bg-secondary/10 text-secondary border-secondary/20",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  lunch: {
    border: "border-border/50",
    bg: "bg-muted/40 backdrop-blur-sm",
    badge: "bg-muted/60 text-muted-foreground border-border",
    icon: <Coffee className="w-3.5 h-3.5" />,
    compact: true,
  },
  high_tea: {
    border: "border-border/50",
    bg: "bg-muted/40 backdrop-blur-sm",
    badge: "bg-muted/60 text-muted-foreground border-border",
    icon: <Coffee className="w-3.5 h-3.5" />,
    compact: true,
  },
  break: {
    border: "border-border/50",
    bg: "bg-muted/40 backdrop-blur-sm",
    badge: "bg-muted/60 text-muted-foreground border-border",
    icon: <Clock className="w-3.5 h-3.5" />,
    compact: true,
  },
  other: {
    border: "border-border/50",
    bg: "bg-card/60 backdrop-blur-md",
    badge: "bg-secondary/10 text-secondary border-secondary/20",
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

function parseTimeToMinutes(timeStr: string): number {
  if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    }
  }
  
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return h * 60 + (isNaN(m) ? 0 : m);
  }
  return 0;
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

// ── Event Card ──
function EventCard({ event, papers, defaultExpanded = false }: { event: ScheduleEvent; papers: SchedulePaper[], defaultExpanded?: boolean }) {
  const style = EVENT_STYLES[event.event_type] || EVENT_STYLES.other;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasDetails = papers.length > 0 || !!event.session_chair || !!event.invited_speakers;

  return (
    <div
      onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        hasDetails ? "cursor-pointer hover:shadow-sm hover:border-primary/40 hover:-translate-y-0.5" : "",
        style.border,
        style.bg
      )}
    >
      {/* Subtle glow effect behind card on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 p-4 md:px-5">
        {/* Collapsed State: Single Horizontal Strip */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          {/* Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={cn("shrink-0 gap-1.5 shadow-sm whitespace-nowrap", style.badge)} variant="outline">
              {style.icon}
              {EVENT_TYPE_LABELS[event.event_type]}
            </Badge>
            {event.location && (
              <Badge variant="secondary" className="gap-1.5 shrink-0 bg-background/60 backdrop-blur-md text-foreground/80 border-border/50 shadow-sm whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5" />
                {event.location}
              </Badge>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors flex-1 min-w-0 md:truncate">
            {event.title}
          </h3>

          {/* Time & Expand Icon */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center ml-auto">
             <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-background/50 px-2 py-1 rounded-md border border-border/30">
               {formatTime(event.time_start)} – {formatTime(event.time_end)}
             </span>
            {hasDetails && (
              <div className="text-muted-foreground p-1 rounded-full bg-background/50 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            )}
          </div>
        </div>

        {/* Collapsable Details */}
        {hasDetails && (
          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-border/50" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Chairs & Speakers */}
              {((event.session_chair && event.session_chair.length > 0) || (event.invited_speakers && event.invited_speakers.length > 0)) && (
                <div className="flex flex-col gap-3 text-sm text-muted-foreground mb-4">
                  {event.invited_speakers && event.invited_speakers.length > 0 && (
                    <span className="flex items-center gap-2">
                      <div className="p-1 rounded bg-background/50 border border-border/50"><Mic className="w-3.5 h-3.5" /></div>
                      <span><strong>Speaker(s):</strong> {event.invited_speakers.join(", ")}</span>
                    </span>
                  )}
                  {event.session_chair && event.session_chair.length > 0 && (
                    <span className="flex items-center gap-2">
                      <div className="p-1 rounded bg-background/50 border border-border/50"><User className="w-3.5 h-3.5" /></div>
                      <span><strong>Chair(s):</strong> {event.session_chair.join(", ")}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Papers */}
              {papers.length > 0 && (
                <div className="space-y-2">
                  {papers.map((paper, idx) => (
                    <div 
                      key={paper.id} 
                      className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-background/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/40 hover:border-primary/30 transition-all animate-in fade-in"
                      style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                    >
                      <span className="text-sm font-medium">
                        {paper.title}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <User className="w-3 h-3" />
                        {paper.presenter}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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

function TimeSlot({ group, searchQuery, index }: { group: TimeSlotGroup, searchQuery: string, index: number }) {
  const { timeLabel, events, papersByEvent } = group;
  const isSearching = searchQuery.length > 0;

  return (
    <div className="mb-10 relative animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
      {/* Full-width time header */}
      <div className="flex items-center gap-4 mb-5">
        <span className="text-sm font-bold tracking-tight text-foreground bg-muted/40 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-sm inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {formatTime(timeLabel)}
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-border/80 via-border/40 to-transparent" />
      </div>

      {/* Events stacked as full rows */}
      <div className="flex flex-col gap-5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            papers={papersByEvent.get(event.id) || []}
            defaultExpanded={isSearching}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Client Component ──
interface ScheduleClientProps {
  initialDays: ScheduleDay[];
  initialEvents: ScheduleEvent[];
  initialPapers: SchedulePaper[];
}

export default function ScheduleClient({
  initialDays,
  initialEvents,
  initialPapers,
}: ScheduleClientProps) {
  const [days] = useState<ScheduleDay[]>(initialDays);
  const [events] = useState<ScheduleEvent[]>(initialEvents);
  const [papers] = useState<SchedulePaper[]>(initialPapers);
  const [activeDay, setActiveDay] = useState<string>(
    initialDays.length > 0 ? initialDays[0].id : ""
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Filter events and papers based on active day and search query
  const { filteredEvents, filteredPapers } = useMemo(() => {
    let currentEvents = events.filter((e) => e.day_id === activeDay);
    let currentPapers = papers.filter((p) => 
      currentEvents.some(e => e.id === p.event_id)
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      
      // Filter papers that match search
      const matchingPapers = currentPapers.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.presenter.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        ((p as any).paper_id && (p as any).paper_id.toLowerCase().includes(q))
      );

      // Filter events that match search or have matching papers
      currentEvents = currentEvents.filter(e => 
        e.title.toLowerCase().includes(q) ||
        (e.session_chair && e.session_chair.some(c => c.toLowerCase().includes(q))) ||
        (e.invited_speakers && e.invited_speakers.some(s => s.toLowerCase().includes(q))) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        matchingPapers.some(p => p.event_id === e.id)
      );

      currentPapers = matchingPapers;
    }

    return { filteredEvents: currentEvents, filteredPapers: currentPapers };
  }, [events, papers, activeDay, searchQuery]);

  // Group events by time slot
  const timeSlots = useMemo((): TimeSlotGroup[] => {
    const grouped = new Map<string, TimeSlotGroup>();
    const papersByEvent = new Map<string, SchedulePaper[]>();

    // Build papers map based on search filter
    for (const p of (searchQuery.trim() ? filteredPapers : papers)) {
      const existing = papersByEvent.get(p.event_id) || [];
      existing.push(p);
      papersByEvent.set(p.event_id, existing);
    }

    for (const event of filteredEvents) {
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

    return Array.from(grouped.values()).sort((a, b) => {
      // Sort chronologically by time start
      return parseTimeToMinutes(a.timeLabel) - parseTimeToMinutes(b.timeLabel);
    });
  }, [filteredEvents, filteredPapers, papers, searchQuery]);

  const activeDayData = days.find((d) => d.id === activeDay);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50 mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl opacity-50 mix-blend-screen animate-float" />
      </div>

      <PageTitle title="Schedule" />

      <div className="container mx-auto px-4 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero info */}
          <Reveal width="100%">
            <div className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 md:p-12 text-center shadow-card hover:shadow-card-hover transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-6 shadow-sm">
                  <Calendar className="w-4 h-4" />
                  Conference Agenda
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  August 7–8, 2026
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  CHRIST University, Kengeri Campus, Bengaluru · IST
                </p>
              </div>
            </div>
          </Reveal>

          {/* Day tabs and Search */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-40 bg-background/80 backdrop-blur-xl p-4 -mx-4 md:mx-0 md:rounded-2xl border-y md:border border-border/50 shadow-sm">
            {days.length > 0 && (
              <Reveal>
                <div className="p-1.5 bg-muted/40 backdrop-blur-md border border-border/50 rounded-full inline-flex flex-wrap gap-1 shadow-inner">
                  {days.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setActiveDay(day.id)}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                        activeDay === day.id
                          ? "bg-background text-foreground shadow-sm border border-border/50"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal>
              <div className="relative w-full md:w-80 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by name, paper title, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-full pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60 shadow-sm"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Active day info */}
          {activeDayData && (
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold border border-secondary/20">
                {activeDayData.date}
              </span>
            </div>
          )}

          {/* Timeline */}
          {timeSlots.length === 0 ? (
            <Reveal width="100%">
              <div className="text-center py-24 space-y-5 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/50">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted shadow-inner mb-2">
                  <Clock className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-bold">No Events Found</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  {searchQuery 
                    ? "We couldn't find anything matching your search criteria."
                    : "The schedule for this day has not been published yet."}
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="relative">
              {timeSlots.map((group, index) => (
                <TimeSlot key={group.timeKey} group={group} searchQuery={searchQuery} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
