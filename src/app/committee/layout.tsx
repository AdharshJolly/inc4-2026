import React from "react";
import CommitteeClient from "./CommitteeClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export default async function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let members: any[] = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("committee_members")
        .select()
        .order("order_index");

      if (error) {
        console.error("Failed to fetch committee members:", error.message);
      } else {
        members = data || [];
      }
    }
  } catch (err) {
    console.error("Committee layout error:", err);
  }

  return (
    <>
      <CommitteeClient initialMembers={members} />
      {children}
    </>
  );
}
