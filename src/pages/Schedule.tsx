import { PageTitle } from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, MapPin, Video, Wifi } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Schedule() {
  useSEO({
    title: "Conference Schedule | IEEE InC4 2026",
    description: "View the complete schedule for IEEE InC4 2026. See keynote speeches, technical sessions, and timings for March 13-14, 2026 at CHRIST University, Bengaluru.",
    keywords: "InC4 schedule, conference agenda, keynote speakers, technical sessions, March 2026, Bengaluru",
    canonicalUrl: "https://ic4.co.in/schedule",
  });

  // Template data structure for easier future editing
  const scheduleData = {
    day1Offline: {
      title: "March 13, 2026 (Offline)",
      events: [
        { time: "09:00 AM - 10:00 AM", title: "Inauguration Ceremony", location: "Main Auditorium" },
        { time: "10:30 AM - 11:30 AM", title: "Keynote Address I", location: "Main Auditorium" },
        { time: "11:30 AM - 01:00 PM", title: "Technical Session I", location: "Hall A" },
        { time: "01:00 PM - 02:00 PM", title: "Lunch Break", location: "Cafeteria" },
        { time: "02:00 PM - 04:00 PM", title: "Technical Session II", location: "Hall A" },
    ]
  },
  day1Online: {
    title: "March 13, 2026 (Online)",
    events: [
      { time: "10:30 AM - 11:30 AM", title: "Keynote Address I (Stream)", link: "#" },
      { time: "11:30 AM - 01:00 PM", title: "Online Technical Session I", link: "#" },
      { time: "02:00 PM - 04:00 PM", title: "Online Technical Session II", link: "#" },
    ]
  },
  day2Online: {
    title: "March 14, 2026 (Online)",
    events: [
      { time: "09:30 AM - 10:30 AM", title: "Keynote Address II (Stream)", link: "#" },
      { time: "10:45 AM - 01:00 PM", title: "Online Technical Session III", link: "#" },
      { time: "02:00 PM - 03:30 PM", title: "Online Technical Session IV", link: "#" },
      { time: "04:00 PM - 05:00 PM", title: "Valedictory Function", link: "#" },
    ]
  }
};

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Schedule" />
      
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          
          <Tabs defaultValue="instructions" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="h-auto flex-wrap justify-center p-2 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-2xl gap-2">
                <TabsTrigger 
                  value="instructions"
                  className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Instructions
                </TabsTrigger>
                <TabsTrigger 
                  value="day1-offline"
                  className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  13 March (Offline)
                </TabsTrigger>
                <TabsTrigger 
                  value="day1-online"
                  className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  13 March (Online)
                </TabsTrigger>
                <TabsTrigger 
                  value="day2-online"
                  className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  14 March (Online)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Instructions Tab */}
            <TabsContent value="instructions" className="space-y-6 animate-slide-up">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                    <AlertCircle className="w-6 h-6" />
                    Instructions for Presenters & Attendees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/10 rounded-lg text-sm text-muted-foreground italic">
                    All participants and presenters are requested to follow these guidelines carefully for a smooth conference experience.
                  </div>
                  <ol className="list-decimal list-outside ml-6 space-y-4 text-muted-foreground text-lg">
                    <li className="pl-2">
                      All the participants and presenters are requested to keep their mic and video <span className="text-red-500 font-semibold">OFF</span> until and unless it is asked to un-mute.
                    </li>
                    <li className="pl-2">
                      Click <span className="bg-primary px-2 py-0.5 rounded text-primary-foreground text-sm font-bold">Join</span> on the respective Date Tab to attend/present the respective Keynotes/Technical Sessions for online attendees.
                    </li>
                    <li className="pl-2">
                      Join the Keynotes/Technical Sessions at least <span className="font-bold text-foreground">05 minutes</span> before the scheduled time. All the times are in <span className="font-bold text-primary">Indian Standard Time (IST)</span>.
                    </li>
                    <li className="pl-2">
                      Paper presentation time for each paper is <span className="font-bold text-foreground">12 Min</span> and <span className="font-bold text-foreground">3 minutes</span> for Q & A.
                    </li>
                    <li className="pl-2">
                      The presenters are requested to be ready with their presentation slides and check their mic and video settings in advance.
                    </li>
                    <li className="pl-2">
                      The authors (presenters) will be called one-by-one in their respective Technical Sessions by Session Chairs.
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Day 1 Offline */}
            <TabsContent value="day1-offline" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="text-primary w-6 h-6" />
                    Offline Schedule (CHRIST University)
                 </h2>
                 <span className="px-4 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium">In-Person</span>
              </div>
              <div className="grid gap-4">
                {scheduleData.day1Offline.events.map((event, i) => (
                  <Card key={i} className="hover:border-primary/40 transition-all cursor-default">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="min-w-[160px] flex items-center gap-2 text-primary font-mono font-semibold">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Day 1 Online */}
            <TabsContent value="day1-online" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Wifi className="text-primary w-6 h-6" />
                    Online Schedule
                 </h2>
                 <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">Virtual</span>
              </div>
              <div className="grid gap-4">
                {scheduleData.day1Online.events.map((event, i) => (
                  <Card key={i} className="hover:border-primary/40 transition-all">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="min-w-[160px] flex items-center gap-2 text-primary font-mono font-semibold">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                      </div>
                      <Button size="sm" className="gap-2 shrink-0">
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

             {/* Day 2 Online */}
             <TabsContent value="day2-online" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Wifi className="text-primary w-6 h-6" />
                    Online Schedule
                 </h2>
                 <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">Virtual</span>
              </div>
              <div className="grid gap-4">
                {scheduleData.day2Online.events.map((event, i) => (
                  <Card key={i} className="hover:border-primary/40 transition-all">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="min-w-[160px] flex items-center gap-2 text-primary font-mono font-semibold">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                       <div className="flex-1">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                      </div>
                      <Button size="sm" className="gap-2 shrink-0">
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </div>
  );
}
