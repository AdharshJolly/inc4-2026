import { PageTitle } from "@/components/PageTitle";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MessageSquare,
  CreditCard,
  Upload,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import steps from "@/data/crc-steps.json";

export default function CRCSubmissions() {
  useSEO({
    title: "CRC Submissions | IEEE InC4 2026",
    description:
      "Submit your Camera Ready Copy (CRC) for IEEE InC4 2026. Guidelines for final paper submission, formatting requirements, and submission procedures.",
    keywords:
      "CRC submissions, camera ready, paper submission, IEEE InC4, final submission, formatting guidelines",
    canonicalUrl: "https://ic4.co.in/crc-submissions",
  });

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

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Steps Grid Section */}
          <section>
            <Reveal>
              <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  Process
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-6">
                  Steps to submit Camera Ready Copy (CRC) of Paper and
                  Registration
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = iconMap[step.icon as keyof typeof iconMap];

                return (
                  <Reveal key={index} width="100%">
                    <div className="h-full bg-card border border-border/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg group relative overflow-hidden flex flex-col">
                      <span className="absolute right-6 top-6 text-6xl font-bold text-primary/40 select-none font-display group-hover:text-primary/80 transition-colors">
                        0{index + 1}
                      </span>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="inline-flex p-3 rounded-xl bg-primary/5 text-primary mb-6 group-hover:scale-110 transition-transform duration-300 w-fit">
                          {Icon ? <Icon className="w-6 h-6" /> : null}
                        </div>

                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-grow">
                          {step.description}
                        </p>

                        {step.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 w-full mt-auto"
                            asChild
                          >
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {step.action} <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Detailed Instructions Grid */}
          <section className="space-y-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-center mb-12">
                Instructions
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 1. Paper Prep */}
              <div className="md:col-span-2">
                <Reveal width="100%">
                  <div className="h-full bg-card border border-border p-8 rounded-3xl hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        1
                      </span>
                      <h3 className="text-xl font-bold">
                        Instruction to prepare Camera Ready Paper
                      </h3>
                    </div>
                    <ul className="space-y-3 text-muted-foreground text-sm list-disc pl-5 columns-1 md:columns-2 gap-8">
                      <li>
                        Authors are advised to strictly follow an IEEE template
                        for the paper available on the conference website.{" "}
                        <a
                          href="https://drive.google.com/drive/folders/1DqCpJHxmPtFlfaajHuaXAy8pWm86iME5?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link to Download InC4 2026 template
                        </a>
                        .
                      </li>
                      <li>
                        For best results, please copy and paste your content
                        into IEEE template and apply the appropriate style.
                      </li>
                      <li>
                        Please do not change header, footer, and other
                        formatting of template.
                      </li>
                      <li>
                        Before formatting please carefully go through
                        instructions given in template, especially section III
                        "PREPARE YOUR PAPER BEFORE STYLING."
                      </li>
                      <li>
                        Paper length must be 4-6 pages in the IEEE template.
                        Above 6 pages in the given IEEE Conference Format, need
                        approval from TPC.
                      </li>
                      <li>
                        Cite all the references in text. It is mandatory to
                        discuss the referred literature in the text.
                      </li>
                      <li>
                        Provide high-resolution images. Text in the image must
                        be readable.
                      </li>
                      <li>
                        Screenshots are not acceptable in the paper. Use proper
                        images downloaded from simulators or use some tools to
                        draw images (like draw.io).
                      </li>
                      <li>
                        Each figure must be captioned and must be discussed in
                        the text.
                      </li>
                      <li>
                        The caption must be self-explanatory and relevant to
                        figure.
                      </li>
                      <li>
                        Tables must be typed and captioned and must be discussed
                        in the text. Table in image format not acceptable.
                      </li>
                      <li>
                        Equations must be typed in equation editor and numbered
                        sequentially.
                      </li>
                    </ul>
                  </div>
                </Reveal>
              </div>

              {/* 2. Reviewer Reply */}
              <Reveal width="100%">
                <div className="h-full bg-card border border-border p-8 rounded-3xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                      2
                    </span>
                    <h3 className="text-xl font-bold">
                      Instruction to prepare reply to reviewers
                    </h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground text-sm list-disc pl-5">
                    <li>
                      Use the{" "}
                      <a
                        href="https://drive.google.com/drive/folders/1DqCpJHxmPtFlfaajHuaXAy8pWm86iME5?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Reply to reviewer template
                      </a>{" "}
                      to prepare reply to reviewer's query.
                    </li>
                    <li>
                      Reply all the queries and highlight (in yellow color)
                      action in camera ready paper.
                    </li>
                  </ul>
                </div>
              </Reveal>

              {/* 3. Registration Info */}
              <Reveal width="100%">
                <div className="h-full bg-primary/5 border border-primary/10 p-8 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-background text-primary font-bold shadow-sm">
                        3
                      </span>
                      <h3 className="text-xl font-bold">
                        Instruction for registration(non-refundable)
                      </h3>
                    </div>
                    <ul className="space-y-3 text-muted-foreground text-sm">
                      <li className="flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{" "}
                        Registration link will be enabled on Registration tab.
                        Please register in appropriate category
                      </li>
                      <li className="flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{" "}
                        Please note that registration fee is non-refundable.
                      </li>
                      <li className="flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />{" "}
                        Fee must be deposited by Explara.{" "}
                        <a
                          href="https://www.explara.com/e/2025-inc4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Link
                        </a>
                        .
                      </li>
                    </ul>
                    {/* <Button className="w-full mt-8" size="lg" asChild>
                                <a href="https://cmt3.research.microsoft.com/InC42025" target="_blank" rel="noopener noreferrer">
                                   <Download className="w-4 h-4 mr-2" /> Submit via CMT
                                </a>
                            </Button> */}
                  </div>
                  {/* Decorative bg */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-0" />
                </div>
              </Reveal>

              {/* 4. Final Files */}
              <div className="md:col-span-2">
                <Reveal width="100%">
                  <div className="h-full bg-card border border-border p-8 rounded-3xl hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        4
                      </span>
                      <h3 className="text-xl font-bold">
                        Instruction to submit final files
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please submit following files to{" "}
                        <a
                          href="https://cmt3.research.microsoft.com/InC42025"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          CMT
                        </a>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-secondary/20 p-4 rounded-xl flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">
                            Source File (Word file) for camera ready paper
                          </span>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">
                            PDF file for reply to reviewers
                          </span>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">
                            Payment Proof
                          </span>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl flex items-center gap-3">
                          <UserPlus className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">
                            Student/IEEE Membership proof (if applicable)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* 5. Copyright Info */}
              <Reveal width="100%" className="md:col-span-2">
                <div className="bg-secondary/5 border border-secondary/10 p-6 rounded-2xl flex items-center justify-center text-center">
                  <p className="font-medium text-foreground">
                    5. Instruction to submit IEEE Copyright form will be shared
                    after Feb 25, 2025.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
