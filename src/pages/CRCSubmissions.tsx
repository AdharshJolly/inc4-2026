import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Upload, Globe } from "lucide-react";

export default function CRCSubmissions() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="CRC Submissions" />
      
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Steps to submit Camera Ready Copy (CRC) of Paper and Registration
            </h2>
          </div>

          {/* Steps List */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside marker:text-primary marker:font-bold">
                <li>Prepare your Camera-Ready Paper as per the "Instruction to prepare Camera Ready Paper."</li>
                <li>Prepare reply to reviewers as per the instructions (Instruction to prepare reply to reviewers).</li>
                <li>Deposit Registration fee. Visit <a href="/registration" className="text-primary hover:underline">Registration Link</a></li>
                <li>Update detail of all co-authors on Microsoft CMT</li>
                <li>Upload all the documents (carefully go through Instruction to submit final files) through Microsoft CMT under Author Console using link <span className="font-semibold text-foreground">"Create Camera Ready Submission"</span>.</li>
                <li>After Registration, please submit your information through <a href="#" className="text-primary hover:underline">Google Form</a></li>
              </ol>
            </CardContent>
          </Card>

          {/* Instructions Sections */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-center mb-8">Instructions</h2>
            
            {/* 1. Camera Ready Paper */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                Instruction to prepare Camera Ready Paper
              </h3>
              <ul className="space-y-2 text-muted-foreground pl-10 list-disc">
                <li>Authors are advised to strictly follow an IEEE template for the paper available on the conference website. <a href="#" className="text-primary hover:underline">Link to Download InC4 2026 template</a>.</li>
                <li>For best results, please copy and paste your content into IEEE template and apply the appropriate style.</li>
                <li>Please do not change header, footer, and other formatting of template.</li>
                <li>Before formatting please carefully go through instructions given in template, especially section III "PREPARE YOUR PAPER BEFORE STYLING."</li>
                <li>Paper length must be 4-6 pages in the IEEE template. Above 6 pages in the given IEEE Conference Format, need approval from TPC.</li>
                <li>Cite all the references in text. It is mandatory to discuss the referred literature in the text.</li>
                <li>Provide high-resolution images. Text in the image must be readable.</li>
                <li>Screenshots are not acceptable in the paper. Use proper images downloaded from simulators or use some tools to draw images (like draw.io).</li>
                <li>Each figure must be captioned and must be discussed in the text.</li>
                <li>The caption must be self-explanatory and relevant to figure.</li>
                <li>Tables must be typed and captioned and must be discussed in the text. Table in image format not acceptable.</li>
                <li>Equations must be typed in equation editor and numbered sequentially.</li>
              </ul>
            </div>

            {/* 2. Reply to Reviewers */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                Instruction to prepare reply to reviewers
              </h3>
              <ul className="space-y-2 text-muted-foreground pl-10 list-disc">
                <li>Use the <a href="#" className="text-primary hover:underline">Reply to reviewer template</a> to prepare reply to reviewer's query.</li>
                <li>Reply all the queries and highlight (in yellow color) action in camera ready paper.</li>
              </ul>
            </div>

            {/* 3. Registration */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
                Instruction for registration
              </h3>
              <ul className="space-y-2 text-muted-foreground pl-10 list-disc">
                <li>Registration link will be enabled on Registration tab. Please register in appropriate category</li>
                <li>Please note that registration fee is non-refundable.</li>
                <li>Fee must be deposited by Explara. Link will be provided soon.</li>
              </ul>
            </div>

            {/* 4. Submit Final Files */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
                Instruction to submit final files
              </h3>
              <ul className="space-y-2 text-muted-foreground pl-10 list-disc">
                <li>Please submit following files to <a href="#" className="text-primary hover:underline">CMT</a>
                  <ul className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>Source File (Word file) for camera ready paper</li>
                    <li>PDF file for reply to reviewers</li>
                    <li>Payment Proof</li>
                    <li>Student proof (if registering in student category)</li>
                    <li>IEEE Membership proof (if registering in IEEE Member category)</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 5. Copyright */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <p className="font-medium text-foreground">
                5. Instruction to submit IEEE Copyright form will be shared after acceptance.
              </p>
            </div>
            
             <div className="flex justify-center pt-8">
              <Button size="lg" className="h-12 px-8 text-lg">
                <Upload className="w-5 h-5 mr-2" />
                Submit Camera Ready Paper
              </Button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
