"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-7xl md:text-8xl font-bold text-primary/20 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full gap-2">
              <Home className="w-5 h-5" />
              Return to Home
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-3 text-sm pt-4">
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
            >
              About
            </Link>
            <Link
              href="/schedule"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
            >
              Schedule
            </Link>
            <Link
              href="/speakers"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
            >
              Speakers
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
