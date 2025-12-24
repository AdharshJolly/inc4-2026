import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-08-07T09:00:00+05:30").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex justify-center gap-2 md:gap-6">
      {timeBlocks.map((block, index) => (
        <div
          key={block.label}
          className="relative group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 gradient-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-3 md:p-6 min-w-[70px] md:min-w-[100px] text-center hover:border-primary/40 transition-colors">
            <span className="font-display text-2xl md:text-5xl font-bold text-gradient-primary block">
              {String(block.value).padStart(2, "0")}
            </span>
            <p className="text-muted-foreground text-xs md:text-sm font-medium mt-1 md:mt-2">
              {block.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
