import { PageTitle } from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Clock,
  MapPin,
  Video,
  Wifi,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";
import scheduleData from "@/data/schedule.json";

export default function Schedule() {
  useSEO({
    title: "Conference Schedule | IEEE InC4 2026",
    description:
      "View the complete schedule for IEEE InC4 2026. See keynote speeches, technical sessions, and timings for August 7-8, 2026 at CHRIST University, Bengaluru.",
    keywords:
      "InC4 schedule, conference agenda, keynote speakers, technical sessions, March 2026, Bengaluru",
    canonicalUrl: "https://ic4.co.in/schedule",
  });

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
                {/* Decorative Background */}
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

          {/* 
          <Tabs defaultValue="instructions" className="w-full">
            <Reveal width="100%">
                <div className="flex justify-center mb-8">
                <TabsList className="h-auto flex-wrap justify-center p-2 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-2xl gap-2">
                    <TabsTrigger
                    value="instructions"
                    className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 font-medium"
                    >
                    Instructions
                    </TabsTrigger>
                    <TabsTrigger
                    value="day1-offline"
                    className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 font-medium"
                    >
                    13 March (Offline)
                    </TabsTrigger>
                    <TabsTrigger
                    value="day1-online"
                    className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 font-medium"
                    >
                    13 March (Online)
                    </TabsTrigger>
                    <TabsTrigger
                    value="day2-online"
                    className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 font-medium"
                    >
                    14 March (Online)
                    </TabsTrigger>
                </TabsList>
                </div>
            </Reveal>

            {/* Instructions Tab * /}
            <TabsContent value="instructions" className="space-y-6">
              <Reveal width="100%">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
                  <div className="bg-primary/5 p-6 border-b border-primary/10">
                     <h2 className="flex items-center gap-3 text-2xl font-bold text-primary">
                       <AlertCircle className="w-6 h-6" />
                       Instructions for Presenters & Attendees
                     </h2>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div className="p-4 bg-secondary/10 rounded-lg text-sm text-foreground/80 font-medium border border-secondary/20 flex gap-3">
                         <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                         All participants and presenters are requested to follow these guidelines carefully for a smooth conference experience.
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">1</span>
                                <p className="text-muted-foreground">All participants are requested to keep their mic and video <span className="text-red-500 font-bold">OFF</span> unless asked to un-mute.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">2</span>
                                <p className="text-muted-foreground">Click <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold text-xs uppercase">Join</span> on the respective Date Tab to attend/present Keynotes or Sessions.</p>
                            </div>
                             <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">3</span>
                                <p className="text-muted-foreground">Join at least <span className="font-bold text-foreground">05 minutes</span> before schedule. All times are in <span className="font-bold text-primary">IST</span>.</p>
                            </div>
                        </div>
                         <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">4</span>
                                <p className="text-muted-foreground">Presentation time: <span className="font-bold text-foreground">12 Min</span> for presentation + <span className="font-bold text-foreground">3 Min</span> for Q&A.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">5</span>
                                <p className="text-muted-foreground">Presenters must test their slides, mic, and video settings in advance.</p>
                            </div>
                             <div className="flex gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">6</span>
                                <p className="text-muted-foreground">Session Chairs will call authors one-by-one in their respective Technical Sessions.</p>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            </TabsContent>

            {/* Day 1 Offline * /}
            <TabsContent value="day1-offline" className="space-y-6">
              <Reveal width="100%">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card p-6 rounded-2xl border border-border">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                         <MapPin className="w-6 h-6" />
                    </div>
                    Offline Schedule
                  </h2>
                   <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-sm font-medium">In-Person at CHRIST University</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                  {scheduleData.day1Offline.events.map((event, i) => (
                    <Reveal key={i} width="100%">
                         <div className="group bg-card hover:bg-muted/30 border border-border/50 hover:border-primary/20 p-6 rounded-xl transition-all duration-300 flex flex-col md:flex-row gap-6">
                            <div className="min-w-[180px] flex items-center gap-3 text-primary font-mono font-medium border-l-4 border-primary/20 pl-4 group-hover:border-primary transition-colors">
                            <Clock className="w-4 h-4" />
                            {event.time}
                            </div>
                            <div className="flex-1">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                            <p className="text-muted-foreground flex items-center gap-2 text-sm mt-2">
                                <MapPin className="w-3 h-3" /> {event.location}
                            </p>
                            </div>
                             <div className="hidden md:flex items-center justify-center text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                                 <ArrowRight className="w-6 h-6" />
                             </div>
                        </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </TabsContent>

            {/* Day 1 Online * /}
            <TabsContent value="day1-online" className="space-y-6">
              <Reveal width="100%">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card p-6 rounded-2xl border border-border">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                         <Wifi className="w-6 h-6" />
                    </div>
                    Online Schedule
                  </h2>
                   <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-sm font-medium">Virtual Track</span>
                   </div>
                </div>
                
                <div className="space-y-4 shadow-sm">
                  {scheduleData.day1Online.events.map((event, i) => (
                     <Reveal key={i} width="100%">
                         <div className="group bg-card hover:bg-muted/30 border border-border/50 hover:border-primary/20 p-6 rounded-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center">
                            <div className="min-w-[180px] flex items-center gap-3 text-primary font-mono font-medium border-l-4 border-primary/20 pl-4 group-hover:border-primary transition-colors w-full md:w-auto">
                            <Clock className="w-4 h-4" />
                            {event.time}
                            </div>
                            <div className="flex-1 w-full md:w-auto">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                            </div>
                            <Button size="sm" className="gap-2 shrink-0 w-full md:w-auto" variant="outline">
                            <Video className="w-4 h-4" />
                            Join Meeting
                            </Button>
                        </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </TabsContent>

            {/* Day 2 Online * /}
            <TabsContent value="day2-online" className="space-y-6">
              <Reveal width="100%">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card p-6 rounded-2xl border border-border">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                         <Wifi className="w-6 h-6" />
                    </div>
                    Online Schedule
                  </h2>
                   <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-sm font-medium">Virtual Track</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                  {scheduleData.day2Online.events.map((event, i) => (
                    <Reveal key={i} width="100%">
                         <div className="group bg-card hover:bg-muted/30 border border-border/50 hover:border-primary/20 p-6 rounded-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center">
                            <div className="min-w-[180px] flex items-center gap-3 text-primary font-mono font-medium border-l-4 border-primary/20 pl-4 group-hover:border-primary transition-colors w-full md:w-auto">
                            <Clock className="w-4 h-4" />
                            {event.time}
                            </div>
                            <div className="flex-1 w-full md:w-auto">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                            </div>
                            <Button size="sm" className="gap-2 shrink-0 w-full md:w-auto" variant="outline">
                            <Video className="w-4 h-4" />
                            Join Meeting
                            </Button>
                        </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </TabsContent>
          </Tabs>
          */}
        </div>
      </div>
    </div>
  );
}
