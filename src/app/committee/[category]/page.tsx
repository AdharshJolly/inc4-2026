import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("committee_members")
      .select("category_id");

    if (error || !data) {
      return [];
    }

    const uniqueCategories = Array.from(
      new Set(data.map((m: any) => m.category_id))
    );
    return uniqueCategories.map((category) => ({ category }));
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Conference Committee | InC4 2026",
  description:
    "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee.",
  keywords:
    "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
  openGraph: {
    title: "Conference Committee | InC4 2026",
    description:
      "Meet the organizing committee members of InC4 2026.",
    type: "website",
    url: "https://ic4.co.in/committee",
  },
  alternates: {
    canonical: "https://ic4.co.in/committee",
  },
};

export default function CommitteeCategoryPage() {
  return null;
}
