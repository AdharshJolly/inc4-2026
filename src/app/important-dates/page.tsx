import { Metadata } from "next";
import ImportantDatesClient from "./ImportantDatesClient";

export const metadata: Metadata = {
  title: "Important Dates | InC4 2026",
  description: "Key dates and deadlines for InC4 2026. Paper submission deadlines, registration dates, and conference schedule for August 7-8, 2026.",
  keywords: "InC4 dates, submission deadline, registration deadline, important dates, conference schedule, 2026",
  openGraph: {
    title: "Important Dates | InC4 2026",
    description: "Key dates and deadlines for InC4 2026. Paper submission deadlines, registration dates, and conference schedule for August 7-8, 2026.",
    type: "website",
    url: "https://ic4.co.in/important-dates",
  },
  alternates: {
    canonical: "https://ic4.co.in/important-dates",
  },
};

export default function ImportantDatesPage() {
  return <ImportantDatesClient />;
}
