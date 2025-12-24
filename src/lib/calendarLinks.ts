export function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function parseMonthDayYear(dateStr: string): Date | null {
  // Expected format like "November 30, 2025"
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}

export function getAllDayRange(
  dateStr: string
): { start: string; end: string } | null {
  // Support single day: "August 07, 2026" and range: "August 07 - 08, 2026"
  const rangeMatch = dateStr.match(
    /^(\w+)\s+(\d{1,2})\s*-\s*(\d{1,2}),\s*(\d{4})$/
  );
  if (rangeMatch) {
    const [, monthName, startDay, endDay, year] = rangeMatch;
    const start = new Date(`${monthName} ${startDay}, ${year}`);
    const endInclusive = new Date(`${monthName} ${endDay}, ${year}`);
    if (isNaN(start.getTime()) || isNaN(endInclusive.getTime())) return null;
    // All-day DTEND is exclusive; add one day beyond endInclusive
    const endExclusive = new Date(endInclusive);
    endExclusive.setDate(endExclusive.getDate() + 1);
    return { start: toYMD(start), end: toYMD(endExclusive) };
  }

  const date = parseMonthDayYear(dateStr);
  if (!date) return null;
  const start = toYMD(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1); // all-day end is next day
  const end = toYMD(endDate);
  return { start, end };
}

export function buildGoogleCalendarUrl(
  title: string,
  dateStr: string,
  options?: { details?: string; location?: string }
): string | null {
  const range = getAllDayRange(dateStr);
  if (!range) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `InC4 2026 - ${title}`,
    dates: `${range.start}/${range.end}`,
  });
  if (options?.details) params.set("details", options.details);
  if (options?.location) params.set("location", options.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildICS(
  title: string,
  dateStr: string,
  options?: { description?: string; url?: string; location?: string }
): string | null {
  const range = getAllDayRange(dateStr);
  if (!range) return null;
  const uid = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}@inc4-2026`;
  const now = new Date();
  const dtstamp = `${toYMD(now)}T${String(now.getHours()).padStart(
    2,
    "0"
  )}${String(now.getMinutes()).padStart(2, "0")}${String(
    now.getSeconds()
  ).padStart(2, "0")}Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InC4 2026//Important Dates//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${range.start}`,
    `DTEND;VALUE=DATE:${range.end}`,
    `SUMMARY:${escapeICS(`InC4 2026 - ${title}`)}`,
  ];
  if (options?.description)
    lines.push(`DESCRIPTION:${escapeICS(options.description)}`);
  if (options?.url) lines.push(`URL:${escapeICS(options.url)}`);
  if (options?.location) lines.push(`LOCATION:${escapeICS(options.location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICSFile(
  title: string,
  dateStr: string,
  options?: { description?: string; url?: string; location?: string }
): boolean {
  const ics = buildICS(title, dateStr, options);
  if (!ics) return false;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitizeFilename(title)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "event";
}
