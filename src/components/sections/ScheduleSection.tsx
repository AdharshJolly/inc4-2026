import { Calendar, Clock, FileText, Send } from "lucide-react";

const timeline = [
  {
    date: "December 15, 2025",
    title: "Paper Submission Deadline",
    description: "Last date to submit your research papers",
    icon: FileText,
    status: "upcoming",
  },
  {
    date: "January 20, 2026",
    title: "Notification of Acceptance",
    description: "Authors will be notified of paper acceptance",
    icon: Send,
    status: "upcoming",
  },
  {
    date: "February 10, 2026",
    title: "Camera Ready Submission",
    description: "Final version of accepted papers due",
    icon: FileText,
    status: "upcoming",
  },
  {
    date: "February 28, 2026",
    title: "Early Bird Registration",
    description: "Last date for early bird registration discount",
    icon: Calendar,
    status: "upcoming",
  },
  {
    date: "March 13-14, 2026",
    title: "Conference Days",
    description: "Main conference at CHRIST University, Bengaluru",
    icon: Clock,
    status: "highlight",
  },
];

export const ScheduleSection = () => {
  return (
    <section id="schedule" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Mark Your Calendar
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Important <span className="text-gradient-primary">Dates</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Stay updated with key deadlines and conference schedule
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div
              key={item.title}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {/* Line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-[calc(100%-3.5rem)] bg-border" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.status === "highlight"
                    ? "gradient-primary glow-primary"
                    : "bg-muted border border-border"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.status === "highlight"
                      ? "text-primary-foreground"
                      : "text-primary"
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 bg-card border rounded-2xl p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 ${
                  item.status === "highlight"
                    ? "border-primary/50 shadow-card"
                    : "border-border"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    item.status === "highlight"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.date}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
