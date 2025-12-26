import { PageTitle } from "@/components/common/PageTitle";
import { Reveal } from "@/components/common/Reveal";
import { FileText, Globe, Users, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InC4 2026 | International Conference on Contemporary Computing and Communications",
  description: "Learn about InC4 2026, the fourth edition of the International Conference on Contemporary Computing and Communications at CHRIST University, Bengaluru. Key insights on the conference mission and previous editions.",
  keywords: "InC4, conference about, IEEE, computing, communications, CHRIST University, academic conference, research",
  openGraph: {
    title: "About InC4 2026 | International Conference on Contemporary Computing and Communications",
    description: "Learn about InC4 2026, the fourth edition of the International Conference on Contemporary Computing and Communications at CHRIST University, Bengaluru. Key insights on the conference mission and previous editions.",
    type: "website",
    url: "https://ic4.co.in/about",
  },
  alternates: {
    canonical: "https://ic4.co.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="About Us" />

      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col gap-24 lg:gap-32">
          {/* Mission / Intro Section (Zig: Text Left, Content Right) */}
          <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Reveal>
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  Our Mission
                </span>
              </Reveal>
              <Reveal>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Fostering Innovation in{" "}
                  <span className="text-gradient-primary">Computing</span>
                </h2>
              </Reveal>
              <Reveal>
                <div className="prose prose-lg prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    The fourth edition of International Conference on
                    Contemporary Computing and Communications (InC4) is
                    organized by IEEE Computer Society Bangalore Chapter and
                    IEEE Computer Society Student Branch Chapter CHRIST
                    University Bangalore in association with Department of
                    Computer Science and Engineering, School of Engineering and
                    Technology, CHRIST (Deemed to be University), Kengeri
                    Campus, Bengaluru, India and IEEE Student Branch, CHRIST
                    University, Bangalore.
                  </p>
                  <br />
                  <p>
                    InC4 2026 brings together researchers and practitioners from
                    academia, industry, and government to deliberate upon
                    contemporary computing and communication's algorithmic,
                    systemic, applied, and educational aspects. The conference
                    will witness multiple eminent keynote speakers from academia
                    and industry worldwide and the presentation of accepted
                    peer-reviewed articles.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="relative">
              <Reveal width="100%">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 bg-primary/5 border border-primary/10 rounded-2xl p-6 backdrop-blur-sm">
                    <Globe className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">
                      InC4 2025
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      1300+ Articles
                      <br />
                      16 Countries
                      <br />
                      197 Presented
                      <br />
                      191 Published and Indexed with Scopus
                    </p>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 backdrop-blur-sm">
                    <Users className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">
                      InC4 2024
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      780+ Articles
                      <br />
                      18 Countries
                      <br />
                      162 Presented
                      <br />
                      154 Published and Indexed with Scopus
                    </p>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 backdrop-blur-sm sm:mt-8">
                    <Award className="w-10 h-10 text-secondary mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">
                      InC4 2023
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      680+ Articles
                      <br />
                      500+ Reviewers
                      <br />
                      170 Presented
                      <br />
                      157 Published and Indexed with Scopus
                    </p>
                  </div>
                </div>
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              </Reveal>
            </div>
          </section>

          {/* CHRIST University Section (Zag: Image Left, Text Right) */}
          <section className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="order-2 lg:order-1 relative top-4">
              <Reveal width="100%">
                <div className="relative rounded-3xl overflow-hidden border border-border mt-2 shadow-md bg-white">
                  <img
                    src="/images/cu_color.png"
                    alt="CHRIST University"
                    className="w-full h-auto object-contain p-6"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
              </Reveal>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
              <Reveal>
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  Host Institution
                </span>
              </Reveal>
              <Reveal>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  CHRIST{" "}
                  <span className="text-muted-foreground text-2xl block mt-1">
                    (Deemed to be University)
                  </span>
                </h2>
              </Reveal>
              <Reveal>
                <div className="prose prose-lg prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    CHRIST (Deemed to be University) was born out of the
                    educational vision of St Kuriakose Elias Chavara, an
                    educationalist and social reformer of the nineteenth century
                    in South India. He founded the first Catholic indigenous
                    congregation, Carmelites of Mary Immaculate (CMI), in 1831,
                    which administers CHRIST (Deemed to be University).
                    Established in 1969 as Christ College, it undertook
                    path-breaking initiatives in Indian higher education with
                    the introduction of innovative and modern curricula,
                    insistence on academic discipline, imparting of Holistic
                    Education, and adoption of global higher education practices
                    with the support of creative and dedicated staff.
                  </p>
                  <br />
                  <p>
                    The University Grants Commission (UGC) of India conferred
                    Autonomy to Christ College in 2004 and identified it as an
                    Institution with Potential for Excellence in 2006. In 2008
                    under Section 3 of the UGC Act, 1956, the Ministry of Human
                    Resource Development of the Government of India declared the
                    institution a Deemed to be University, in the name and style
                    of Christ University. One of the first institutions in India
                    to be accredited in 1998 by the NAAC, and subsequently in
                    2004 and 2016, CHRIST (Deemed to be University) has the top
                    grade 'A' in the 4-point scale.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href="https://christuniversity.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </Reveal>
            </div>
          </section>

          {/* IEEE Section (Zig: Text Left, Logo Right) */}
          <section className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-6 lg:col-span-2">
              <Reveal>
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  Organizer
                </span>
              </Reveal>
              <Reveal>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  IEEE Computer Society{" "}
                  <span className="text-primary block mt-1">
                    Bangalore Chapter
                  </span>
                </h2>
              </Reveal>
              <Reveal>
                <div className="prose prose-lg prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    IEEE Computer Society Bangalore Chapter is a professional
                    chapter of the IEEE Computer Society, which is a growing and
                    diverse community of computing professionals and the most
                    trusted source for information, inspiration, and
                    collaboration in computer science and engineering, focusing
                    on the regions of the state of Karnataka, India.
                  </p>
                  <p>
                    IEEE Computer Society Bangalore Chapter, founded in the year
                    1982, is one of the largest technical societies of IEEE
                    Bangalore. This is the 44th year of its establishment.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href="https://cs.ieeebangalore.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Chapter <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </Reveal>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <Reveal width="100%">
                <div className="relative rounded-3xl overflow-hidden border border-border bg-white px-8 py-6 shadow-md hover:border-primary/50 transition-colors duration-500">
                  <img
                    src="/images/ieee_cs_bc.png"
                    alt="IEEE Computer Society Bangalore Chapter"
                    className="w-full max-w-sm h-auto object-contain"
                  />
                </div>
              </Reveal>
            </div>
          </section>

          {/* IEEE CS Student Branch Section (Zag: Image Left, Text Right) */}
          <section className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="order-2 lg:order-1 relative top-4">
              <Reveal width="100%">
                <div className="relative rounded-3xl overflow-hidden border border-border mt-2 shadow-md bg-white">
                  <img
                    src="/images/ieee_cs_cu.png"
                    alt="IEEE Computer Society Student Branch Chapter CHRIST University"
                    className="w-full h-auto object-contain p-6"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-10" />
              </Reveal>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
              <Reveal>
                <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  Student Chapter
                </span>
              </Reveal>
              <Reveal>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  IEEE Computer Society{" "}
                  <span className="text-primary block mt-1">
                    Student Branch Chapter CHRIST University Bangalore
                  </span>
                </h2>
              </Reveal>
              <Reveal>
                <div className="prose prose-lg prose-invert text-muted-foreground leading-relaxed">
                  <p>
                    The IEEE Computer Society Student Branch Chapter at CHRIST
                    University Bangalore is a vibrant community of students
                    passionate about computing, technology, and innovation. As
                    part of the larger IEEE Computer Society, the student
                    chapter provides a platform for students to engage with
                    cutting-edge research, industry trends, and professional
                    development opportunities.
                  </p>
                  <p>
                    The chapter actively organizes technical workshops,
                    seminars, hackathons, and guest lectures featuring industry
                    experts and renowned academicians. Through these
                    initiatives, students gain hands-on experience, enhance
                    their technical skills, and build valuable networks that
                    prepare them for successful careers in technology and
                    research.
                  </p>
                  <p>
                    By collaborating with IEEE Computer Society Bangalore
                    Chapter, the student branch plays a crucial role in
                    organizing flagship events like InC4, providing students
                    with unique opportunities to interact with the global
                    computing community and contribute to advancing the field of
                    contemporary computing and communications.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href="https://edu.ieee.org/in-cucs/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Chapter <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </Reveal>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
