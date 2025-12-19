import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found | InC4 2026",
    description: "The page you're looking for doesn't exist. Return to the InC4 2026 conference website.",
    keywords: "404, page not found, error",
    canonicalUrl: "https://ic4.co.in/404",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-7xl md:text-8xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <a href="/" className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Return to Home
            </a>
          </Button>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <a href="/about" className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground">
              About
            </a>
            <a href="/schedule" className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground">
              Schedule
            </a>
            <a href="/speakers" className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground">
              Speakers
            </a>
            <a href="/contact" className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
