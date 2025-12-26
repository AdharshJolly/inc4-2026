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
      <div className="hidden">{children}</div>
    </>
  );
}
