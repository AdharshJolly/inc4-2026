import { Metadata } from "next";
import ImportantDatesClient from "./ImportantDatesClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function ImportantDatesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: dates } = await supabase
    .from('important_dates')
    .select()
    .order('order_index');

  return <ImportantDatesClient initialDates={dates || []} />;
}
