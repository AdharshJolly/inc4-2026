import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Reveal width="100%">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium text-sm">
                Early Bird Registration will be opened soon!
              </span>
            </div>
          </Reveal>

          <Reveal width="100%">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ready to Be Part of
              <span className="text-gradient-primary"> InC4 2026</span>?
            </h2>
          </Reveal>

          <Reveal width="100%">
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join leading researchers, industry experts, and innovators at the
              premier conference on contemporary computing and communications.
            </p>
          </Reveal>

          <Reveal width="100%">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="https://cmt3.research.microsoft.com/InC42026"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="xl">
                  Submit Paper
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              {/* <Link to="/call-for-papers">
                <Button variant="outline" size="xl">
                  Submit Paper
                </Button>
              </Link> */}
            </div>
          </Reveal>

          {/* Stats Row */}
          {/* <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-border">
            <Reveal>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-foreground">
                  IEEE
                </p>
                <p className="text-muted-foreground text-sm">Indexed</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-foreground">
                  Hybrid
                </p>
                <p className="text-muted-foreground text-sm">Mode Available</p>
              </div>
            </Reveal>
          </div> */}
        </div>
      </div>
    </section>
  );
};
