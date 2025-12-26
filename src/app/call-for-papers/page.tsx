import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import {
  ArrowRight,
  FileText,
  Cpu,
  Network,
  Database,
  Calendar,
  MapPin,
  Download,
} from "lucide-react";
import { Metadata } from "next";
import topics from "@/data/call-for-papers-topics.json";

export const metadata: Metadata = {
  title: "Call for Papers | InC4 2026",
  description: "Submit your research papers to InC4 2026. Guidelines for paper submission, research topics, and important deadlines for the International Conference on Contemporary Computing and Communications.",
  keywords: "call for papers, paper submission, IEEE, InC4, research papers, conference guidelines, submission deadline",
  openGraph: {
    title: "Call for Papers | InC4 2026",
    description: "Submit your research papers to InC4 2026. Guidelines for paper submission, research topics, and important deadlines for the International Conference on Contemporary Computing and Communications.",
    type: "article",
    url: "https://ic4.co.in/call-for-papers",
  },
  alternates: {
    canonical: "https://ic4.co.in/call-for-papers",
  },
};

export default function CallForPapersPage() {
  const iconMap = { Cpu, Database, FileText, Network } as const;

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Call for Papers" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Introduction Hero */}
          <section className="relative">
            <Reveal width="100%">
              <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 w-fit">
                      InC4 2026
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                      IEEE Computer Society Bangalore Chapter & Christ
                      University
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Organizing the fourth edition of the 2026 International
                      Conference on Contemporary Computing and Communications
                      (InC4) on{" "}
                      <span className="text-foreground font-semibold">
                        August 7-8, 2026
                      </span>
                      .
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Bringing researchers, academicians, industry, and
                      government personnel together to share and discuss various
                      aspects of Computing and Communications.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <div className="flex items-center gap-2 text-sm font-medium bg-secondary/30 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary" /> August
                        7-8, 2026
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium bg-secondary/30 px-3 py-2 rounded-lg">
                        <MapPin className="w-4 h-4 text-primary" /> Bengaluru,
                        India
                      </div>
                    </div>
                  </div>

                  {/* Right side decoration/info */}
                  <div className="bg-secondary/10 rounded-2xl p-8 border border-secondary/20 h-full flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-4">Submission Scope</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Original contributions based on the results of research
                      and development are solicited. Prospective authors are
                      requested to submit their papers in standard IEEE
                      conference format in not more than 6 pages.
                    </p>
                    <Button size="lg" className="w-full gap-2" asChild>
                      <a
                        href="https://cmt3.research.microsoft.com/InC42026"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Submit Paper <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                {/* Decorative Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </Reveal>
          </section>

          {/* Plain Text CMT Acknowledgment - Required by Microsoft CMT */}
          <section>
            <p>
              CMT Acknowledgment: The Microsoft CMT service was used
              for managing the peer-reviewing process for this conference. This
              service was provided for free by Microsoft and they bore all
              expenses, including costs for Azure cloud services as well as for
              software development and support.
            </p>
          </section>

          {/* Topics Grid */}
          <section>
            <Reveal>
              <h2 className="text-3xl font-bold mb-12 text-center">
                Topics of Interest ( Not Limited To )
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, index) => {
                const Icon = iconMap[topic.icon as keyof typeof iconMap];

                return (
                  <Reveal key={index} width="100%">
                    <div className="group h-full bg-card border border-border p-8 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                          {Icon ? <Icon className="w-8 h-8" /> : null}
                        </div>
                        <span className="text-6xl font-bold text-secondary/30 font-display select-none -mt-4">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Guidelines Section */}
          <section>
            <Reveal width="100%">
              <div className="bg-primary/5 border border-primary/10 rounded-3xl py-6 px-8 md:p-16 relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                  <div className="inline-flex items-center justify-center p-3 bg-background rounded-xl mb-4 shadow-sm">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold">
                    Registered Paper Guidelines
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                      <p className="font-bold text-lg mb-2 text-primary">
                        Formatting Rules
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The paper must strictly adhere to the standard IEEE two
                        column format and must not be more than 6 pages.
                      </p>
                    </div>
                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center">
                      <p className="font-bold text-lg mb-4 text-primary">
                        Need Help?
                      </p>
                      <Button className="w-full gap-2" asChild>
                        <a href="" target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" /> Download Templates
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2" />
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
