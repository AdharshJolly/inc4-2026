"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  MapPin,
  User,
  FileText,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  AlertTriangle,
  Mic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActivityLogger } from "@/lib/activityLogger";
import { SkeletonCard } from "./Skeleton";
import { adminDbInsert, adminDbUpdate, adminDbDelete } from "@/app/actions/db";
import { createClient } from "@/utils/supabase/client";
import type {
  ScheduleDay,
  ScheduleEvent,
  SchedulePaper,
} from "@/types/data";

type EventType = ScheduleEvent["event_type"];

const EVENT_TYPES: { value: EventType; label: string; color: string }[] = [
  { value: "keynote", label: "Keynote", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  { value: "inauguration", label: "Inauguration", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  { value: "valedictory", label: "Valedictory", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { value: "session", label: "Session", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "lunch", label: "Lunch", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "high_tea", label: "High Tea", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  { value: "break", label: "Break", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
  { value: "other", label: "Other", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
];

function getEventTypeInfo(type: EventType) {
  return EVENT_TYPES.find((et) => et.value === type) || EVENT_TYPES[7];
}

function formatTime(time: string): string {
  if (!time) return time;
  if (time.includes("AM") || time.includes("PM")) return time;
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

type EventFormData = {
  time_start: string;
  time_end: string;
  title: string;
  event_type: EventType;
  location: string;
  session_chair: string[];
  invited_speakers: string[];
  keynote_speakers: { name: string; topic: string }[];
};

type PaperFormData = {
  title: string;
  presenter: string;
};

const EMPTY_EVENT_FORM: EventFormData = {
  time_start: "",
  time_end: "",
  title: "",
  event_type: "session",
  location: "",
  session_chair: [""],
  invited_speakers: [""],
  keynote_speakers: [{ name: "", topic: "" }],
};

const EMPTY_PAPER_FORM: PaperFormData = {
  title: "",
  presenter: "",
};

export const ScheduleManager = () => {
  const { toast } = useToast();
  const supabase = createClient();

  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [activeDay, setActiveDay] = useState<string>("");
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [papers, setPapers] = useState<Record<string, SchedulePaper[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Event dialog
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>(EMPTY_EVENT_FORM);

  // Paper dialog
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<SchedulePaper | null>(null);
  const [paperForm, setPaperForm] = useState<PaperFormData>(EMPTY_PAPER_FORM);
  const [paperEventId, setPaperEventId] = useState<string>("");

  // Delete confirmations
  const [deleteEventTarget, setDeleteEventTarget] = useState<ScheduleEvent | null>(null);
  const [deletePaperTarget, setDeletePaperTarget] = useState<SchedulePaper | null>(null);

  // Expand state
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  // ── Data fetching ──

  const fetchDays = useCallback(async () => {
    const { data, error } = await supabase
      .from("schedule_days")
      .select("*")
      .order("sort_order", { ascending: true });

    setIsLoading(false);

    if (error) {
      console.error("ScheduleManager: Failed to load days", error);
      toast({ title: "Error", description: "Failed to load schedule days.", variant: "destructive" });
      return;
    }

    if (data) {
      setDays(data as ScheduleDay[]);
      setActiveDay((prev) => prev || (data.length > 0 ? data[0].id : ""));
    }
  }, [supabase, toast]);

  const fetchEvents = useCallback(async (dayId: string) => {
    setEventsLoading(true);
    const { data, error } = await supabase
      .from("schedule_events")
      .select("*")
      .eq("day_id", dayId)
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load events.", variant: "destructive" });
      setEventsLoading(false);
      return;
    }

    setEvents((data as ScheduleEvent[]) || []);

    // Fetch papers for session events
    if (data && data.length > 0) {
      const sessionIds = data
        .filter((e: ScheduleEvent) => e.event_type === "session")
        .map((e: ScheduleEvent) => e.id);

      if (sessionIds.length > 0) {
        const { data: paperData } = await supabase
          .from("schedule_papers")
          .select("*")
          .in("event_id", sessionIds)
          .order("sort_order", { ascending: true });

        const paperMap: Record<string, SchedulePaper[]> = {};
        for (const id of sessionIds) {
          paperMap[id] = [];
        }
        if (paperData) {
          for (const p of paperData as SchedulePaper[]) {
            if (!paperMap[p.event_id]) paperMap[p.event_id] = [];
            paperMap[p.event_id].push(p);
          }
        }
        setPapers(paperMap);
      } else {
        setPapers({});
      }
    } else {
      setPapers({});
    }

    setEventsLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  useEffect(() => {
    if (activeDay) {
      fetchEvents(activeDay);
    }
  }, [activeDay, fetchEvents]);

  // ── Event CRUD ──

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm(EMPTY_EVENT_FORM);
    setEventDialogOpen(true);
  };

  const openEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setEventForm({
      time_start: event.time_start.slice(0, 5),
      time_end: event.time_end.slice(0, 5),
      title: event.title,
      event_type: event.event_type,
      location: event.location || "",
      session_chair: event.session_chair && event.session_chair.length > 0 ? event.session_chair : [""],
      invited_speakers: event.invited_speakers && event.invited_speakers.length > 0 ? event.invited_speakers : [""],
      keynote_speakers: event.keynote_speakers && event.keynote_speakers.length > 0 ? event.keynote_speakers : [{ name: "", topic: "" }],
    });
    setEventDialogOpen(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title.trim()) {
      toast({ title: "Validation Error", description: "Event title is required.", variant: "destructive" });
      return;
    }
    if (!eventForm.time_start || !eventForm.time_end) {
      toast({ title: "Validation Error", description: "Start and end times are required.", variant: "destructive" });
      return;
    }

    const processNames = (names: string[]) => {
      return names
        .map(n => n.trim())
        .filter(n => n);
    };

    if (editingEvent) {
      try {
        await adminDbUpdate("schedule_events", editingEvent.id, {
          time_start: eventForm.time_start,
          time_end: eventForm.time_end,
          title: eventForm.title.trim(),
          event_type: eventForm.event_type,
          location: eventForm.location.trim() || null,
          session_chair: eventForm.event_type === "session" ? (processNames(eventForm.session_chair).length ? processNames(eventForm.session_chair) : null) : null,
          invited_speakers: eventForm.event_type === "session" ? (processNames(eventForm.invited_speakers).length ? processNames(eventForm.invited_speakers) : null) : null,
          keynote_speakers: eventForm.event_type === "keynote" ? (eventForm.keynote_speakers.filter(k => k.name.trim() || k.topic.trim()).length ? eventForm.keynote_speakers.filter(k => k.name.trim() || k.topic.trim()) : null) : null,
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update event.", variant: "destructive" });
        return;
      }

      ActivityLogger.log({ action: "Updated schedule event", type: "date", targetName: eventForm.title, status: "success" });
      toast({ title: "Saved", description: `Event "${eventForm.title}" updated.` });
    } else {
      const nextOrder = events.length > 0 ? Math.max(...events.map((e) => e.sort_order)) + 1 : 0;
      try {
        await adminDbInsert("schedule_events", {
          day_id: activeDay,
          time_start: eventForm.time_start,
          time_end: eventForm.time_end,
          title: eventForm.title.trim(),
          event_type: eventForm.event_type,
          location: eventForm.location.trim() || null,
          session_chair: eventForm.event_type === "session" ? (processNames(eventForm.session_chair).length ? processNames(eventForm.session_chair) : null) : null,
          invited_speakers: eventForm.event_type === "session" ? (processNames(eventForm.invited_speakers).length ? processNames(eventForm.invited_speakers) : null) : null,
          keynote_speakers: eventForm.event_type === "keynote" ? (eventForm.keynote_speakers.filter(k => k.name.trim() || k.topic.trim()).length ? eventForm.keynote_speakers.filter(k => k.name.trim() || k.topic.trim()) : null) : null,
          sort_order: nextOrder,
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add event.", variant: "destructive" });
        return;
      }

      ActivityLogger.log({ action: "Added schedule event", type: "date", targetName: eventForm.title, status: "success" });
      toast({ title: "Added", description: `Event "${eventForm.title}" added.` });
    }

    setEventDialogOpen(false);
    fetchEvents(activeDay);
  };

  const performDeleteEvent = async () => {
    if (!deleteEventTarget) return;

    try {
      if (deleteEventTarget.event_type === "session") {
        const { data: papersToDelete } = await supabase.from("schedule_papers").select("id").eq("event_id", deleteEventTarget.id);
        if (papersToDelete) {
          for (const p of papersToDelete) {
            await adminDbDelete("schedule_papers", p.id);
          }
        }
      }
      await adminDbDelete("schedule_events", deleteEventTarget.id);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" });
      return;
    }

    ActivityLogger.log({ action: "Deleted schedule event", type: "date", targetName: deleteEventTarget.title, status: "warning" });
    toast({ title: "Deleted", description: `Event "${deleteEventTarget.title}" removed.` });
    setDeleteEventTarget(null);
    fetchEvents(activeDay);
  };

  // ── Paper CRUD ──

  const openAddPaper = (eventId: string) => {
    setEditingPaper(null);
    setPaperForm(EMPTY_PAPER_FORM);
    setPaperEventId(eventId);
    setPaperDialogOpen(true);
  };

  const openEditPaper = (paper: SchedulePaper) => {
    setEditingPaper(paper);
    setPaperForm({ title: paper.title, presenter: paper.presenter });
    setPaperEventId(paper.event_id);
    setPaperDialogOpen(true);
  };

  const savePaper = async () => {
    if (!paperForm.title.trim()) {
      toast({ title: "Validation Error", description: "Paper title is required.", variant: "destructive" });
      return;
    }
    if (!paperForm.presenter.trim()) {
      toast({ title: "Validation Error", description: "Presenter name is required.", variant: "destructive" });
      return;
    }

    const eventPapers = papers[paperEventId] || [];

    if (editingPaper) {
      try {
        await adminDbUpdate("schedule_papers", editingPaper.id, {
          title: paperForm.title.trim(),
          presenter: paperForm.presenter.trim(),
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update paper.", variant: "destructive" });
        return;
      }

      ActivityLogger.log({ action: "Updated schedule paper", type: "date", targetName: paperForm.title, status: "success" });
      toast({ title: "Saved", description: `Paper "${paperForm.title}" updated.` });
    } else {
      const nextOrder = eventPapers.length > 0 ? Math.max(...eventPapers.map((p) => p.sort_order)) + 1 : 0;
      try {
        await adminDbInsert("schedule_papers", {
          event_id: paperEventId,
          title: paperForm.title.trim(),
          presenter: paperForm.presenter.trim(),
          sort_order: nextOrder,
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add paper.", variant: "destructive" });
        return;
      }

      ActivityLogger.log({ action: "Added schedule paper", type: "date", targetName: paperForm.title, status: "success" });
      toast({ title: "Added", description: `Paper "${paperForm.title}" added.` });
    }

    setPaperDialogOpen(false);
    fetchEvents(activeDay);
  };

  const performDeletePaper = async () => {
    if (!deletePaperTarget) return;

    try {
      await adminDbDelete("schedule_papers", deletePaperTarget.id);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete paper.", variant: "destructive" });
      return;
    }

    ActivityLogger.log({ action: "Deleted schedule paper", type: "date", targetName: deletePaperTarget.title, status: "warning" });
    toast({ title: "Deleted", description: `Paper "${deletePaperTarget.title}" removed.` });
    setDeletePaperTarget(null);
    fetchEvents(activeDay);
  };

  // ── Reordering ──

  const moveEvent = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === events.length - 1)
    )
      return;

    const newEvents = [...events];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newEvents[index];
    newEvents[index] = newEvents[swapIndex];
    newEvents[swapIndex] = temp;

    setEvents(newEvents);

    const updates = newEvents.map((ev, idx) => ({
      id: ev.id,
      sort_order: idx,
    }));

    await Promise.all(
      updates.map((u) =>
        adminDbUpdate("schedule_events", u.id, { sort_order: u.sort_order })
      )
    );

    toast({ title: "Reordered", description: "Event order updated." });
  };

  const movePaper = async (eventId: string, index: number, direction: "up" | "down") => {
    const eventPapers = [...(papers[eventId] || [])];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === eventPapers.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const temp = eventPapers[index];
    eventPapers[index] = eventPapers[swapIndex];
    eventPapers[swapIndex] = temp;

    setPapers((prev) => ({ ...prev, [eventId]: eventPapers }));

    const updates = eventPapers.map((p, idx) => ({
      id: p.id,
      sort_order: idx,
    }));

    await Promise.all(
      updates.map((u) =>
        adminDbUpdate("schedule_papers", u.id, { sort_order: u.sort_order })
      )
    );

    toast({ title: "Reordered", description: "Paper order updated." });
  };

  // ── Render ──

  const activeDayObj = days.find((d) => d.id === activeDay);

  return (
    <div className="space-y-6">
      {/* Day Tabs */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            {days.map((day) => (
              <Button
                key={day.id}
                variant={activeDay === day.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDay(day.id)}
                className={activeDay === day.id ? "bg-primary hover:bg-primary/90" : ""}
              >
                {day.label}
                <span className="ml-1.5 text-xs opacity-60">{day.date}</span>
              </Button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {activeDayObj?.label} — {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
            <Button size="sm" onClick={openAddEvent} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Button>
          </div>

          {/* Events list */}
          {eventsLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No events yet</p>
              <p className="text-xs text-muted-foreground">Add the first event for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, index) => {
                const typeInfo = getEventTypeInfo(event.event_type);
                const eventPapers = papers[event.id] || [];
                const isExpanded = expandedEvents.has(event.id);

                return (
                  <div
                    key={event.id}
                    className="rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Event card */}
                    <div 
                      className={`flex items-start gap-4 p-4 ${event.event_type === "session" ? "cursor-pointer" : ""}`}
                      onClick={() => event.event_type === "session" && toggleEvent(event.id)}
                    >
                      <div className="flex flex-col gap-1 pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => moveEvent(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => moveEvent(index, "down")}
                          disabled={index === events.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {event.title}
                                {event.event_type === "session" && (
                                  <span className="ml-2 text-muted-foreground font-normal text-sm">
                                    ({eventPapers.length} paper{eventPapers.length !== 1 ? 's' : ''})
                                  </span>
                                )}
                              </h3>
                              <Badge className={typeInfo.color + " text-xs"}>
                                {typeInfo.label}
                              </Badge>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-1.5 text-sm text-muted-foreground">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formatTime(event.time_start)} — {formatTime(event.time_end)}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                              
                              {event.keynote_speakers && event.keynote_speakers.length > 0 && (
                                <div className="flex items-start gap-1.5 mt-1">
                                  <Mic className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">Keynote(s):</span>
                                    {event.keynote_speakers.map((ks, i) => (
                                      <div key={i} className="flex flex-col mb-1">
                                        <span className="text-foreground/90 font-medium">{ks.name}</span>
                                        {ks.topic && <span className="text-foreground/70 text-xs italic">Topic: {ks.topic}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {event.invited_speakers && event.invited_speakers.length > 0 && (
                                <div className="flex items-start gap-1.5 mt-1">
                                  <Mic className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">Speaker(s):</span>
                                    {event.invited_speakers.map((s, i) => (
                                      <span key={i} className="text-foreground/90">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {event.session_chair && event.session_chair.length > 0 && (
                                <div className="flex items-start gap-1.5 mt-1">
                                  <User className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">Chair(s):</span>
                                    {event.session_chair.map((c, i) => (
                                      <span key={i} className="text-foreground/90">{c}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {event.event_type === "session" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleEvent(event.id)}
                                className="mr-1 h-8 px-2"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => openEditEvent(event)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setDeleteEventTarget(event)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Papers section for session events */}
                    {event.event_type === "session" && isExpanded && (
                      <div className="border-t border-border bg-muted/30 px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            Papers ({eventPapers.length})
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => openAddPaper(event.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Paper
                          </Button>
                        </div>

                        {eventPapers.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic py-2">No papers added yet.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {eventPapers.map((paper, pIdx) => (
                              <div
                                key={paper.id}
                                className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm"
                              >
                                <div className="flex flex-col">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0"
                                    onClick={() => movePaper(event.id, pIdx, "up")}
                                    disabled={pIdx === 0}
                                  >
                                    <ArrowUp className="w-2.5 h-2.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0"
                                    onClick={() => movePaper(event.id, pIdx, "down")}
                                    disabled={pIdx === eventPapers.length - 1}
                                  >
                                    <ArrowDown className="w-2.5 h-2.5" />
                                  </Button>
                                </div>
                                <GripVertical className="w-3 h-3 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{paper.title}</p>
                                  <p className="text-xs text-muted-foreground">{paper.presenter}</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEditPaper(paper)}>
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-red-500 hover:text-red-600"
                                    onClick={() => setDeletePaperTarget(paper)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Event Dialog */}
          <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ev-title">Title *</Label>
                  <Input
                    id="ev-title"
                    placeholder="e.g., Keynote Address"
                    value={eventForm.title}
                    onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ev-start">Start Time *</Label>
                    <Input
                      id="ev-start"
                      type="time"
                      value={eventForm.time_start}
                      onChange={(e) => setEventForm((p) => ({ ...p, time_start: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ev-end">End Time *</Label>
                    <Input
                      id="ev-end"
                      type="time"
                      value={eventForm.time_end}
                      onChange={(e) => setEventForm((p) => ({ ...p, time_end: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Event Type *</Label>
                  <Select
                    value={eventForm.event_type}
                    onValueChange={(val) =>
                      setEventForm((p) => ({ ...p, event_type: val as EventType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((et) => (
                        <SelectItem key={et.value} value={et.value}>
                          {et.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ev-location">Location</Label>
                  <Input
                    id="ev-location"
                    placeholder="e.g., Hall A"
                    value={eventForm.location}
                    onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))}
                  />
                </div>

                {eventForm.event_type === "session" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Invited Speaker(s)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setEventForm(p => ({ ...p, invited_speakers: [...p.invited_speakers, ""] }))}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                      </div>
                      {eventForm.invited_speakers.map((speaker, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            placeholder="e.g., Dr. Jane Doe"
                            value={speaker}
                            onChange={(e) => {
                              const newSpeakers = [...eventForm.invited_speakers];
                              newSpeakers[idx] = e.target.value;
                              setEventForm(p => ({ ...p, invited_speakers: newSpeakers }));
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 hover:text-red-600 shrink-0"
                            onClick={() => {
                              const newSpeakers = eventForm.invited_speakers.filter((_, i) => i !== idx);
                              setEventForm(p => ({ ...p, invited_speakers: newSpeakers.length ? newSpeakers : [""] }));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                )}

                {eventForm.event_type === "session" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Session Chair(s)</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setEventForm(p => ({ ...p, session_chair: [...p.session_chair, ""] }))}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      {eventForm.session_chair.map((chair, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            placeholder="e.g., Dr. John Smith"
                            value={chair}
                            onChange={(e) => {
                              const newChairs = [...eventForm.session_chair];
                              newChairs[idx] = e.target.value;
                              setEventForm(p => ({ ...p, session_chair: newChairs }));
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 hover:text-red-600 shrink-0"
                            onClick={() => {
                              const newChairs = eventForm.session_chair.filter((_, i) => i !== idx);
                              setEventForm(p => ({ ...p, session_chair: newChairs.length ? newChairs : [""] }));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                )}
                
                {eventForm.event_type === "keynote" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Keynote Speaker(s) & Topic(s)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setEventForm(p => ({ ...p, keynote_speakers: [...p.keynote_speakers, { name: "", topic: "" }] }))}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    {eventForm.keynote_speakers.map((ks, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          placeholder="Name (e.g. Dr. Jane Doe)"
                          value={ks.name}
                          onChange={(e) => {
                            const newKS = [...eventForm.keynote_speakers];
                            newKS[idx] = { ...newKS[idx], name: e.target.value };
                            setEventForm(p => ({ ...p, keynote_speakers: newKS }));
                          }}
                        />
                        <Input
                          placeholder="Topic"
                          value={ks.topic}
                          onChange={(e) => {
                            const newKS = [...eventForm.keynote_speakers];
                            newKS[idx] = { ...newKS[idx], topic: e.target.value };
                            setEventForm(p => ({ ...p, keynote_speakers: newKS }));
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-600 shrink-0"
                          onClick={() => {
                            const newKS = eventForm.keynote_speakers.filter((_, i) => i !== idx);
                            setEventForm(p => ({ ...p, keynote_speakers: newKS.length ? newKS : [{ name: "", topic: "" }] }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEvent} className="bg-primary hover:bg-primary/90">
                  {editingEvent ? "Save Changes" : "Add Event"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Paper Dialog */}
          <Dialog open={paperDialogOpen} onOpenChange={setPaperDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPaper ? "Edit Paper" : "Add Paper"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paper-title">Paper Title *</Label>
                  <Input
                    id="paper-title"
                    placeholder="e.g., A Novel Approach to..."
                    value={paperForm.title}
                    onChange={(e) => setPaperForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paper-presenter">Presenter *</Label>
                  <Input
                    id="paper-presenter"
                    placeholder="e.g., Dr. Jane Doe"
                    value={paperForm.presenter}
                    onChange={(e) => setPaperForm((p) => ({ ...p, presenter: e.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPaperDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={savePaper} className="bg-primary hover:bg-primary/90">
                  {editingPaper ? "Save Changes" : "Add Paper"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Event Confirmation */}
          <AlertDialog
            open={deleteEventTarget !== null}
            onOpenChange={(open) => !open && setDeleteEventTarget(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Delete event?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove &quot;{deleteEventTarget?.title}&quot; and all its papers. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={performDeleteEvent}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Paper Confirmation */}
          <AlertDialog
            open={deletePaperTarget !== null}
            onOpenChange={(open) => !open && setDeletePaperTarget(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Delete paper?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove &quot;{deletePaperTarget?.title}&quot; from the schedule. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={performDeletePaper}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};
