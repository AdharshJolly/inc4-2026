import { Metadata } from "next";
import { PageTitle } from "@/components/common/PageTitle";
import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  MessageSquare,
  CreditCard,
  Upload,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import steps from "@/data/crc-steps.json";

export const metadata: Metadata = {
  title: "CRC Submissions | InC4 2026",
  description:
    "Submit your Camera Ready Copy (CRC) for InC4 2026. Guidelines for final paper submission, formatting requirements, and submission procedures.",
  keywords:
    "CRC submissions, camera ready, paper submission, InC4, final submission, formatting guidelines",
  alternates: {
    canonical: "https://ic4.co.in/crc-submissions",
  },
};

export default function CRCSubmissions() {
  const iconMap = {
    FileText,
    MessageSquare,
    CreditCard,
    UserPlus,
    Upload,
    CheckCircle2,
  } as const;

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="CRC Submissions" />

      <div className="container mx-auto px-4 pb-20 mt-12">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* STEPS TIMELINE */}
          <section>
            <Reveal width="100%">
              <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  The Process
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-6">
                  Steps to Submit Your Camera Ready Copy
                </h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                  Follow these 6 sequential steps to ensure your paper is
                  properly formatted, registered, and submitted for publication.
                </p>
              </div>
            </Reveal>

            <div className="relative">
              {/* Vertical Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2 rounded-full" />

              <div className="space-y-12 md:space-y-0">
                {steps.map((step, index) => {
                  const Icon =
                    iconMap[step.icon as keyof typeof iconMap] || BookOpen;
                  const isEven = index % 2 === 0;

                  return (
                    <Reveal key={index} width="100%">
                      <div
                        className={`relative flex flex-col md:flex-row items-center md:justify-between ${isEven ? "md:flex-row-reverse" : ""}`}
                      >
                        {/* Timeline Node */}
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-4 border-primary items-center justify-center z-10 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                          <span className="font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>

                        {/* Content Card */}
                        <div
                          className={`w-full md:w-[45%] ${isEven ? "md:text-left" : "md:text-right"} group`}
                        >
                          <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
                            <div
                              className={`flex flex-col ${isEven ? "md:items-start" : "md:items-end"} items-start`}
                            >
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                <Icon className="w-7 h-7" />
                              </div>
                              <h3 className="text-2xl font-bold mb-3">
                                {step.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed mb-6">
                                {step.description}
                              </p>
                              {step.action && (
                                <Button
                                  variant="outline"
                                  className="gap-2 group-hover:bg-primary/5"
                                  asChild
                                >
                                  <a
                                    href={step.link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {step.action}{" "}
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* DETAILED INSTRUCTIONS TABS */}
          <section>
            <Reveal width="100%">
              <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-6 md:p-12 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">
                    Detailed Instructions
                  </h2>
                  <p className="text-muted-foreground">
                    Select a category below to view specific requirements and
                    guidelines.
                  </p>
                </div>

                <Tabs defaultValue="formatting" className="w-full">
                  <TabsList className="flex flex-wrap h-auto w-full justify-center gap-2 bg-transparent p-0 mb-12">
                    <TabsTrigger
                      value="formatting"
                      className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background/50 data-[state=inactive]:hover:bg-background"
                    >
                      1. Paper Formatting
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviewers"
                      className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background/50 data-[state=inactive]:hover:bg-background"
                    >
                      2. Reviewer Reply
                    </TabsTrigger>
                    <TabsTrigger
                      value="registration"
                      className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background/50 data-[state=inactive]:hover:bg-background"
                    >
                      3. Registration
                    </TabsTrigger>
                    <TabsTrigger
                      value="final"
                      className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background/50 data-[state=inactive]:hover:bg-background"
                    >
                      4. Final Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="copyright"
                      className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg border border-transparent data-[state=inactive]:border-border data-[state=inactive]:bg-background/50 data-[state=inactive]:hover:bg-background"
                    >
                      5. Copyright
                    </TabsTrigger>
                  </TabsList>

                  <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl min-h-[450px]">
                    <TabsContent
                      value="formatting"
                      className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            Camera Ready Paper Preparation
                          </h3>
                          <p className="text-muted-foreground">
                            Guidelines for formatting your final manuscript.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-4 text-muted-foreground list-none pl-0">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          <span>
                            Authors must strictly follow the IEEE template
                            available on the website.{" "}
                            <a
                              href="https://drive.google.com/drive/folders/14PVMRN_naVkUe3-Zq0OiyZatdusGK_Lj?usp=sharing"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Link to Download InC4 2026 template
                            </a>
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Do not change headers, footers, or any template
                          formatting. Read section III "PREPARE YOUR PAPER
                          BEFORE STYLING".
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Paper length must be 4-6 pages. Exceeding 6 pages
                          requires TPC approval.
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Cite all references in the text and discuss referred
                          literature.
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Provide high-resolution, readable images. Screenshots
                          are not acceptable (use tools like draw.io).
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Figures and tables must be captioned and discussed in
                          the text. Tables must be typed, not images.
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          Equations must be typed in the equation editor and
                          numbered sequentially.
                        </li>
                      </ul>
                    </TabsContent>

                    <TabsContent
                      value="reviewers"
                      className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            Reply to Reviewers
                          </h3>
                          <p className="text-muted-foreground">
                            Addressing feedback from the peer review process.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-4 text-muted-foreground list-none pl-0">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>
                            Use the official{" "}
                            <a
                              href="https://drive.google.com/drive/folders/14PVMRN_naVkUe3-Zq0OiyZatdusGK_Lj?usp=sharing"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Reply to reviewer template
                            </a>{" "}
                            to prepare your responses to queries.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          Reply to all queries comprehensively and highlight (in
                          yellow) the resulting actions or changes directly in
                          the camera-ready paper.
                        </li>
                      </ul>
                    </TabsContent>

                    <TabsContent
                      value="registration"
                      className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            Registration Details
                          </h3>
                          <p className="text-muted-foreground">
                            Important policies regarding conference
                            registration.
                          </p>
                        </div>
                      </div>
                      <div className="bg-secondary/10 border border-secondary/20 p-6 rounded-2xl mb-6">
                        <div className="flex gap-3">
                          <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                          <p className="text-foreground font-medium">
                            Registration fee is completely non-refundable under
                            all circumstances.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-4 text-muted-foreground list-none pl-0">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          <span>
                            Registration links will be enabled on the
                            Registration tab. Visit{" "}
                            <a
                              href="/registration"
                              className="text-primary hover:underline font-medium"
                            >
                              Registration Link
                            </a>{" "}
                            to ensure you register in the appropriate category.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                          <span>
                            Fee must be deposited securely via Explara.{" "}
                            <a
                              href="https://www.explara.com/e/2026-ieee-international-conference-on-contemporary-computing-and-communications-inc4"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Pay via Explara
                            </a>
                            .
                          </span>
                        </li>
                      </ul>
                    </TabsContent>

                    <TabsContent
                      value="final"
                      className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            Final Files Submission
                          </h3>
                          <p className="text-muted-foreground">
                            Files required for the final{" "}
                            <a
                              href="https://cmt3.research.microsoft.com/InC2026"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Microsoft CMT
                            </a>{" "}
                            upload.
                          </p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-background border border-border p-5 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors">
                          <FileText className="w-6 h-6 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-foreground">
                              Source File
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Word (.docx) format of the camera ready paper
                            </p>
                          </div>
                        </div>
                        <div className="bg-background border border-border p-5 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors">
                          <MessageSquare className="w-6 h-6 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-foreground">
                              Reviewer Replies
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              PDF file containing replies to reviewers
                            </p>
                          </div>
                        </div>
                        <div className="bg-background border border-border p-5 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors">
                          <CreditCard className="w-6 h-6 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-foreground">
                              Payment Proof
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Receipt or confirmation of registration fee
                            </p>
                          </div>
                        </div>
                        <div className="bg-background border border-border p-5 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors">
                          <UserPlus className="w-6 h-6 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-foreground">
                              Membership Proof
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Student or IEEE Membership proof (if applicable)
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="copyright"
                      className="mt-0 outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">
                            IEEE Copyright Form
                          </h3>
                          <p className="text-muted-foreground">
                            Information regarding copyright transfer.
                          </p>
                        </div>
                      </div>
                      <div className="h-40 flex flex-col items-center justify-center text-center bg-background rounded-2xl border border-dashed border-border">
                        <BookOpen className="w-8 h-8 text-muted-foreground/50 mb-3" />
                        <p className="text-foreground font-medium">
                          Instructions to submit the IEEE Copyright form
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          will be shared soon.
                        </p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
