import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="About Us" />
      
      <div className="container mx-auto px-4 pb-20">
        <div className="grid gap-12 max-w-4xl mx-auto">
          {/* InC4 Section */}
          <section className="space-y-6 animate-slide-up">
            <h2 className="text-3xl font-bold text-primary">InC4</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                The fourth edition of IEEE International Conference on Contemporary Computing and 
                Communications (InC4) organized by IEEE Computer Society Bangalore Chapter and 
                IEEE Computer Society Student Branch Chapter CHRIST University Bangalore in association 
                with Department of Computer Science and Engineering, School of Engineering and Technology, 
                CHRIST (Deemed to be University), Kengeri Campus, Bengaluru, India and IEEE Student Branch, 
                CHRIST University, Bangalore.
              </p>
              <p>
                Recent advancements in computing and communication attract people from academia and industry. 
                It focuses on topics of contemporary interest to computer and computational scientists and 
                engineers. The InC4 - 2026 will bring together researchers and practitioners from academia, 
                industry, and government to deliberate upon contemporary computing and communication's 
                algorithmic, systemic, applied, and educational aspects. The conference will witness multiple 
                eminent keynote speakers from academia and industry worldwide and the presentation of 
                accepted peer-reviewed articles.
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-primary mb-2">InC4 2024</h3>
                  <p className="text-sm text-foreground/80">
                    Received 780 research articles from 18 countries. A total of 162 papers were presented 
                    during the conference.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-primary mb-2">InC4 2023</h3>
                  <p className="text-sm text-foreground/80">
                    Received 680 research articles from 16 countries. After a rigorous review process 
                    with the help of program committee members and more than 500 reviewers, 170 papers 
                    were approved for the conference.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CHRIST Section */}
          <section className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-primary">CHRIST (Deemed to be University)</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                CHRIST (Deemed to be University) was born out of the educational vision of St Kuriakose 
                Elias Chavara, an educationalist and social reformer of the nineteenth century in South India. 
                He founded the first Catholic indigenous congregation, Carmelites of Mary Immaculate (CMI), 
                in 1831, which administers CHRIST (Deemed to be University).
              </p>
              <p>
                Established in 1969 as Christ College, it undertook path-breaking initiatives in Indian 
                higher education with the introduction of innovative and modern curricula, insistence on 
                academic discipline, imparting of Holistic Education, and adoption of global higher education 
                practices with the support of creative and dedicated staff.
              </p>
              <p>
                 The University Grants Commission (UGC) of India conferred Autonomy to Christ College in 2004 
                 and identified it as an Institution with Potential for Excellence in 2006. In 2008 under 
                 Section 3 of the UGC Act, 1956, the Ministry of Human Resource Development of the Government 
                 of India declared the institution a Deemed to be University, in the name and style of 
                 Christ University. One of the first institutions in India to be accredited in 1998 by the NAAC, 
                 and subsequently in 2004 and 2016, CHRIST (Deemed to be University) has the top grade 'A' 
                 in the 4-point scale.
              </p>
            </div>
          </section>

          {/* IEEE Section */}
          <section className="space-y-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-3xl font-bold text-primary">IEEE Computer Society Bangalore Chapter</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                IEEE Computer Society Bangalore Chapter is a professional chapter of the IEEE Computer Society, 
                which is a growing and diverse community of computing professionals and the most trusted source 
                for information, inspiration, and collaboration in computer science and engineering, focusing 
                on the regions of the state of Karnataka, India. IEEE Computer Society Bangalore Chapter, 
                founded in the year 1982, is one of the largest technical societies of IEEE Bangalore.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


