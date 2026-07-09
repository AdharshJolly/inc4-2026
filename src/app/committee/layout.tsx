import React from "react";
import CommitteeClient from "./CommitteeClient";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  
  const { data: members } = await supabase
    .from('committee_members')
    .select()
    .order('order_index');

  return (
    <>
      <CommitteeClient initialMembers={members || []} />
      {/* 
        Note: The committee pages use a unique pattern where `CommitteeClient` handles all rendering logic 
        based on URL parameters. The individual page components (children) return `null` but are required 
        for Next.js routing and metadata. We render `children` here to ensure the router segments are 
        properly mounted, even though they render nothing.
      */}
      {children}
    </>
  );
}
