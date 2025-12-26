"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={cn(!isLanding && !isAdmin ? "pt-[110px]" : "")}>
      {children}
    </div>
  );
}
