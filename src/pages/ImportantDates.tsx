import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import dates from "@/data/important-dates.json";

export default function ImportantDates() {
  useSEO({
    title: "Important Dates | InC4 2026",
    description:
      "Key dates and deadlines for InC4 2026. Paper submission deadlines, registration dates, and conference schedule for August 7-8, 2026.",
    keywords:
      "InC4 dates, submission deadline, registration deadline, important dates, conference schedule, 2026",
    canonicalUrl: "https://ic4.co.in/important-dates",
  });

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
                    {item.date}
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
