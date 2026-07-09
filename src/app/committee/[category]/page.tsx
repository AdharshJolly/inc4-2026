import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  
  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from('committee_members').select('category_id');
  const uniqueCategories = Array.from(new Set(data?.map(m => m.category_id) || []));
  return uniqueCategories.map((category) => ({
    category,
  }));
}

export const metadata: Metadata = {
  title: "Conference Committee | 2026 IEEE International Conference on Contemporary Computing and Communications (InC4)",
  description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the 2026 IEEE International Conference on Contemporary Computing and Communications - Conference#70839.",
  keywords: "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
  openGraph: {
    title: "Conference Committee | 2026 IEEE International Conference on Contemporary Computing and Communications (InC4)",
    description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the 2026 IEEE International Conference on Contemporary Computing and Communications - Conference#70839.",
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
