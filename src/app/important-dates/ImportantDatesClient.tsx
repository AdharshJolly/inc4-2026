"use client";

import { PageTitle } from "@/components/common/PageTitle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, CheckCircle2, Clock, Star, ChevronRight, ExternalLink } from "lucide-react";
import datesData from "@/data/important-dates.json";
import type { ImportantDatesData } from "@/types/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { buildGoogleCalendarUrl, downloadICSFile } from "@/lib/calendarLinks";
import { getPreviewData } from "@/lib/previewMode";
import { useEffect, useState } from "react";

export default function ImportantDatesClient() {
  const [dates, setDates] = useState((datesData as ImportantDatesData).root);

  const isCompleted = (dateStr: string) => {
    const now = new Date();
    let dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      dateObj.setHours(23, 59, 59, 999);
      return dateObj < now;
    }
    const match = dateStr.match(/([a-zA-Z]+)\s+\d+(?:\s*-\s*(\d+))?,?\s*(\d{4})/);
    if (match) {
      const month = match[1];
      const day = match[2] || dateStr.match(/\d+/)?.[0];
      const year = match[3];
      if (day) {
        dateObj = new Date(`${month} ${day}, ${year}`);
        if (!isNaN(dateObj.getTime())) {
          dateObj.setHours(23, 59, 59, 999);
          return dateObj < now;
        }
      }
    }
    return false;
  };

  const parseDateParts = (dateStr: string) => {
    const match = dateStr.match(/^([A-Za-z]+)\s+([\d\s\-]+),?\s*(\d{4})$/);
    if (match) {
      return {
        month: match[1],
        day: match[2].trim(),
        year: match[3]
      };
    }
    return { month: "", day: dateStr, year: "" };
  };

  useEffect(() => {
    const previewData = getPreviewData("src/data/important-dates.json");
    if (previewData) {
      try {
        const parsed = JSON.parse(previewData) as ImportantDatesData;
        setDates(parsed.root);
      } catch (e) {
        console.error("Failed to parse preview data", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Important Dates" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6 pt-10">
          
          {dates.map((item, index) => {
            const completed = isCompleted(item.date);
            const highlight = item.isHighlight;
            const parts = parseDateParts(item.date);
            
            return (
              <Card 
                key={index} 
                className={`group overflow-hidden transition-all duration-500 animate-slide-up hover:-translate-y-1 ${
                  highlight 
                    ? "border-orange-500/50 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)] bg-gradient-to-r from-orange-500/10 via-background to-background z-20 scale-[1.02]" 
                    : completed 
                    ? "border-primary/5 bg-card/20 opacity-80 hover:opacity-100" 
                    : "border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Left Date Block - Calendar Leaf Style */}
                  <div className={`sm:w-56 p-6 sm:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden transition-colors duration-500 ${
                    highlight ? "bg-orange-500 text-white" :
                    completed ? "bg-muted text-muted-foreground" :
                    "bg-primary/10 text-primary border-b sm:border-b-0 sm:border-r border-primary/20 group-hover:bg-primary/20"
                  }`}>
                    {/* Background decoration for highlight */}
                    {highlight && <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 transform -translate-y-1/2 pointer-events-none"></div>}
                    
                    <div className="relative z-10 flex flex-col items-center justify-center w-full">
                      {parts.month ? (
                        <>
                          <span className={`text-sm font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-orange-100' : 'opacity-80'}`}>
                            {parts.month}
                          </span>
                          <span className="text-4xl sm:text-5xl font-black tracking-tighter my-1 whitespace-nowrap">
                            {parts.day}
                          </span>
                          <span className={`text-sm font-medium mt-1 ${highlight ? 'text-orange-100' : 'opacity-70'}`}>
                            {parts.year}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl sm:text-2xl font-bold">{item.date}</span>
                      )}
                    </div>
                  </div>

                  {/* Right Content Block */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between relative">
                    {/* Subtle completed pattern background */}
                    {completed && !highlight && (
                       <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none"></div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex gap-2 items-center flex-wrap">
                          {highlight && <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none shadow-md shadow-orange-500/20 px-3"><Star className="w-3.5 h-3.5 mr-1.5" /> Spotlight Event</Badge>}
                          {completed && <Badge variant="secondary" className="bg-secondary text-muted-foreground border-none px-3"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Completed</Badge>}
                          {!completed && !highlight && <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3"><Clock className="w-3.5 h-3.5 mr-1.5" /> Upcoming</Badge>}
                        </div>
                      </div>
                      
                      <h3 className={`text-2xl sm:text-3xl font-bold mb-3 ${
                        highlight ? 'text-orange-500 tracking-tight' : 
                        completed ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 
                        'text-foreground tracking-tight'
                      }`}>
                        {item.event}
                      </h3>
                      
                      {item.description && (
                        <p className={`text-[15px] leading-relaxed mb-6 ${
                          highlight ? 'text-foreground/90 font-medium' : 
                          completed ? 'text-muted-foreground/80' : 
                          'text-muted-foreground'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-start gap-3 relative z-10 mt-auto pt-2 flex-wrap">
                      {item.actionUrl && item.actionText && (
                        <Button 
                          asChild 
                          variant={highlight ? "default" : completed ? "secondary" : "default"} 
                          className={`rounded-full px-6 transition-all ${
                            highlight ? "bg-white text-orange-600 hover:bg-orange-50 shadow-lg" : 
                            completed ? "opacity-90" : 
                            "shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          }`}
                        >
                          <a href={item.actionUrl} target={item.actionUrl.startsWith('http') ? '_blank' : undefined} rel={item.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                            {item.actionText} <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                          </a>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant={highlight && !item.actionUrl ? "default" : "outline"} 
                            className={`rounded-full px-6 transition-all ${
                              highlight && !item.actionUrl ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40" : 
                              highlight ? "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20" :
                              completed ? "opacity-70 cursor-not-allowed" : 
                              "hover:bg-primary/10 border-primary/30"
                            }`} 
                            disabled={completed}
                          >
                            <CalendarPlus className="w-4 h-4 mr-2" /> 
                            {completed ? "Passed" : "Add to Calendar"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-xl shadow-xl border-primary/20">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <a
                              href={buildGoogleCalendarUrl(item.event, item.date, {
                                details: item.description || `InC4 2026: ${item.event}`,
                                location: highlight ? "CHRIST University, Kengeri Campus, Bangalore, India" : "Online",
                              }) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Add to Google Calendar
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => downloadICSFile(item.event, item.date, {
                            description: item.description || `InC4 2026: ${item.event}`,
                            url: "https://ic4.co.in/important-dates",
                            location: highlight ? "CHRIST University, Kengeri Campus, Bangalore, India" : "Online",
                          })}>
                            Download .ics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          
          <div className="mt-16 text-center text-muted-foreground animate-slide-up p-8 rounded-2xl bg-secondary/10 border border-border/50" style={{ animationDelay: `${dates.length * 0.1}s` }}>
            <p className="font-semibold text-foreground text-lg">Mark your calendar.</p>
            <p className="text-sm mt-2">Late submissions will not be considered under any circumstances.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
