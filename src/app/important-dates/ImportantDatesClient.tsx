"use client";

import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";
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
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 animate-slide-up">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 border-b border-primary/20 bg-primary/10">
                <div className="p-4 font-bold text-center md:text-left md:pl-8 text-primary uppercase tracking-wider">
                  Event
                </div>
                <div className="p-4 font-bold text-center text-primary uppercase tracking-wider">
                  Time
                </div>
              </div>

              {dates.map((item, index) => {
                const completed = isCompleted(item.date);
                return (
                <div
                  key={index}
                  className={`grid grid-cols-1 md:grid-cols-2 border-b last:border-0 border-primary/10 hover:bg-primary/5 transition-colors ${
                    item.isHighlight ? "bg-primary/5 font-bold" : ""
                  } ${completed && !item.isHighlight ? "opacity-60" : ""}`}
                >
                  <div
                    className={`p-6 text-center md:text-left md:pl-8 flex flex-col md:flex-row items-center md:justify-start gap-2 ${
                      item.isHighlight
                        ? "text-primary text-xl"
                        : "font-semibold"
                    }`}
                  >
                    <span>{item.event}</span>
                    {completed && <span className="text-xs font-normal bg-secondary/50 px-2 py-1 rounded text-muted-foreground">Completed</span>}
                  </div>
                  <div
                    className={`p-6 text-center ${
                      item.isHighlight
                        ? "text-primary text-xl"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-center md:justify-end gap-3">
                      <span className={completed ? "line-through opacity-75" : ""}>{item.date}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            disabled={completed}
                          >
                            <CalendarPlus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a
                              href={
                                buildGoogleCalendarUrl(item.event, item.date, {
                                  details:
                                    item.description ||
                                    `InC4 2026: ${item.event}`,
                                  location:
                                    item.isHighlight
                                      ? "CHRIST University, Kengeri Campus, Bangalore, India"
                                      : "Online",
                                }) || "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Add to Google Calendar
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              downloadICSFile(item.event, item.date, {
                                description:
                                  item.description ||
                                  `InC4 2026: ${item.event}`,
                                url: "https://ic4.co.in/important-dates",
                                location:
                                  item.isHighlight
                                    ? "CHRIST University, Kengeri Campus, Bangalore, India"
                                    : "Online",
                              })
                            }
                          >
                            Download .ics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )})}
            </CardContent>
          </Card>

          <div
            className="mt-12 text-center text-muted-foreground animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <p>Mark your calendar. Late submissions will not be considered.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
