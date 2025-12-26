import React from "react";
import CommitteeClient from "./CommitteeClient";

export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommitteeClient />
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
