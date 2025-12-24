import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import datesData from "@/data/important-dates.json";
import type { ImportantDatesData } from "@/types/data";
import { AddDatesDialog } from "./AddDatesDialog";

export const DatesManager = () => {
  const dates = (datesData as ImportantDatesData).root || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "highlight":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2">
        <AddDatesDialog />
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {dates.map((date, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <div
              className={`p-3 rounded-full ${
                date.status === "highlight"
                  ? "bg-orange-500/10"
                  : date.status === "upcoming"
                  ? "bg-blue-500/10"
                  : "bg-green-500/10"
              }`}
            >
              <Calendar
                className={`w-5 h-5 ${
                  date.status === "highlight"
                    ? "text-orange-500"
                    : date.status === "upcoming"
                    ? "text-blue-500"
                    : "text-green-500"
                }`}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{date.event}</h3>
                  <p className="text-sm text-muted-foreground">{date.date}</p>
                </div>
                <Badge className={getStatusColor(date.status)}>
                  {date.status}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
