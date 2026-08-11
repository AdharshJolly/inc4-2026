import { Metadata } from "next";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/common/Reveal";
import { Trophy, Medal, Award, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Papers | InC4 2026",
  description: "Explore the best papers of the 2026 IEEE International Conference on Contemporary Computing and Communications.",
  keywords: "best papers, award winning papers, InC4 2026, research, IEEE",
  openGraph: {
    title: "Best Papers | InC4 2026",
    description: "Explore the best papers of the 2026 IEEE International Conference on Contemporary Computing and Communications.",
    type: "website",
    url: "https://ic4.co.in/best-papers",
  },
  alternates: {
    canonical: "https://ic4.co.in/best-papers",
  },
};

const bestPapers = [
  {
    id: "2344",
    position: "First",
    title: "VeloGuard: Adaptive AI-Driven API Rate Limiting Using Bidirectional LSTM with Temporal Attention",
    authors: "Yuvaraj Natarajan and Hardik Ahuja",
    icon: <Trophy className="w-12 h-12 text-yellow-500" />,
    colorClass: "border-yellow-500/50 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.3)] bg-gradient-to-r from-yellow-500/10 via-background to-background scale-[1.02]",
    badgeClass: "bg-yellow-500 text-white"
  },
  {
    id: "2545",
    position: "Second",
    title: "Towards Generalizable Deepfake Image Detection with Vision Transformers",
    authors: "Srinanda V Kaliki, M Manvith Prabhu, Hemanth Kumar Mogilipalem, Abhinai S Jayavarapu, Vaibhav Santhosh, Aryan N Herur and Deepu Vijayasenan",
    icon: <Medal className="w-12 h-12 text-slate-400" />,
    colorClass: "border-slate-400/50 shadow-[0_10px_40px_-10px_rgba(148,163,184,0.3)] bg-gradient-to-r from-slate-400/10 via-background to-background",
    badgeClass: "bg-slate-400 text-white"
  },
  {
    id: "3010",
    position: "Third",
    title: "Miniaturized Hexagonal Novel Slot Antenna Using Substrate Integrated Waveguide Technology for 5 GHz Applications",
    authors: "Ashutosh Srivastava and Venkateswaran K",
    icon: <Award className="w-12 h-12 text-amber-700" />,
    colorClass: "border-amber-700/50 shadow-[0_10px_40px_-10px_rgba(180,83,9,0.3)] bg-gradient-to-r from-amber-700/10 via-background to-background",
    badgeClass: "bg-amber-700 text-white"
  }
];

export default function BestPapersPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Best Papers" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 pt-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">InC4 2026 Best Paper Awards</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We proudly present the outstanding research contributions recognized at the 2026 IEEE International Conference on Contemporary Computing and Communications.
            </p>
          </div>

          <div className="space-y-6">
            {bestPapers.map((paper, index) => (
              <Reveal key={paper.id} width="100%">
                <Card 
                  className={`group overflow-hidden transition-all duration-500 animate-slide-up hover:-translate-y-1 ${paper.colorClass}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Left Rank Block */}
                    <div className={`sm:w-48 p-6 sm:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden transition-colors duration-500 ${paper.badgeClass}`}>
                      <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 transform -translate-y-1/2 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col items-center justify-center w-full space-y-3">
                        {paper.icon}
                        <div className="flex flex-col">
                          <span className="text-2xl font-black uppercase tracking-widest leading-none">
                            {paper.position}
                          </span>
                          <span className="text-sm font-bold opacity-90 mt-1 uppercase tracking-wider">
                            Place
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content Block */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center relative">
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          Paper ID: {paper.id}
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                        {paper.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-start gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg border border-border/50">
                          <User className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-medium">{paper.authors}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
