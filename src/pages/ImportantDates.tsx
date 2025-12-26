import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarPlus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
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

export default function ImportantDates() {
  useSEO({
    title: "Important Dates | InC4 2026",
    description:
      "Key dates and deadlines for InC4 2026. Paper submission deadlines, registration dates, and conference schedule for August 7-8, 2026.",
    keywords:
      "InC4 dates, submission deadline, registration deadline, important dates, conference schedule, 2026",
    ogType: "website",
    canonicalUrl: "https://ic4.co.in/important-dates",
  });

  // Type-safe data normalization
  // Check for preview data first, fallback to imported data
  const previewData = getPreviewData("src/data/important-dates.json");
  const datesDataActual = previewData
    ? (JSON.parse(previewData) as ImportantDatesData)
    : (datesData as ImportantDatesData);
  const dates = datesDataActual.root;

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

              {dates.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 md:grid-cols-2 border-b last:border-0 border-primary/10 hover:bg-primary/5 transition-colors ${
                    item.status === "highlight" ? "bg-primary/5 font-bold" : ""
                  }`}
                >
                  <div
                    className={`p-6 text-center md:text-left md:pl-8 ${
                      item.status === "highlight"
                        ? "text-primary text-xl"
                        : "font-semibold"
                    }`}
                  >
                    {item.event}
                  </div>
                  <div
                    className={`p-6 text-center ${
                      item.status === "highlight"
                        ? "text-primary text-xl"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-center md:justify-end gap-3">
                      <span>{item.date}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            <CalendarPlus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            {/* Google Calendar link opens new tab */}
                            <a
                              href={
                                buildGoogleCalendarUrl(item.event, item.date, {
                                  details:
                                    item.description ||
                                    `InC4 2026: ${item.event}`,
                                  location:
                                    item.status === "highlight"
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
                                  item.status === "highlight"
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
              ))}
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
