import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | InC4 2026",
  description: "Get in touch with the InC4 2026 organizing team. Contact information, venue details, and FAQ for the International Conference on Contemporary Computing and Communications.",
  keywords: "contact InC4, conference contact, IEEE, CHRIST University, venue, email, conference details",
  openGraph: {
    title: "Contact Us | InC4 2026",
    description: "Get in touch with the InC4 2026 organizing team. Contact information, venue details, and FAQ for the International Conference on Contemporary Computing and Communications.",
    type: "website",
    url: "https://ic4.co.in/contact",
  },
  alternates: {
    canonical: "https://ic4.co.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Contact Us" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Main Query Link */}
          <Reveal width="100%">
            <div className="text-center bg-primary/5 p-6 rounded-lg">
              <p className="text-lg">
                You can send your queries to the following email ID:{" "}
                <a
                  href="mailto:inc4.christ@conference.christuniversity.in"
                  className="text-primary font-bold hover:underline"
                >
                  inc4.christ@conference.christuniversity.in
                </a>
              </p>
            </div>
          </Reveal>

          {/* Contact Persons Grid */}
          <div className="gap-8">
            {/* Dr Sandeep Kumar */}
            <Reveal width="100%">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors h-full">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Dr Sandeep Kumar</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      Professor, Department of Aritificial Intelligence and Data
                      Science Engineering,
                      <br />
                      School of Engineering and Technology, CHRIST (Deemed to be
                      University),
                      <br />
                      Kengeri Campus, Bangalore - 560 074
                    </p>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                      <a
                        href="mailto:sandeepkumar@christuniversity.in"
                        className="text-primary hover:underline font-medium"
                      >
                        Email: sandeepkumar@christuniversity.in
                      </a>
                      <p className="text-muted-foreground">
                        Phone: +91 90247 06009
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          {/* Map Section */}
          <Reveal width="100%">
            <div className="">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Conference Location
              </h2>
              <div className="rounded-xl overflow-hidden border border-primary/20 bg-muted h-[500px] shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.693920558558!2d77.43321429678957!3d12.863035199999988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae472f365fe219%3A0xcae219b3b46324db!2sCHRIST%20(Deemed%20to%20be%20University)%20Bangaluru%20Kengeri%20Campus!5e0!3m2!1sen!2sin!4v1728245889176!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          {/* FAQ Section (Retained) */}
          <Reveal width="100%">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-8 text-center text-primary">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-4">
                {[
                  {
                    q: "How can I register for the conference?",
                    a: "Registration details will be available soon on our registration page. Early bird discounts will be offered for registrations received before the deadline.",
                  },
                  {
                    q: "What is the conference venue?",
                    a: "InC4 2026 will be held at CHRIST (Deemed to be University), Kengeri Campus, Bengaluru, India.",
                  },
                  {
                    q: "Can I present my research?",
                    a: "Yes! We invite researchers to submit their papers through our Call for Papers. Selected papers will be presented at the conference.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-primary/10 bg-card/30 p-6 hover:bg-card/50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
