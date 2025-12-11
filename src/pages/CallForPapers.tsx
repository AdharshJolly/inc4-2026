import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Globe, Cpu, Network, Database } from "lucide-react";

export default function CallForPapers() {
  const topics = [
    {
      title: "Intelligent System",
      icon: Cpu,
      description: "Decision trees, Support Vector Machine, Artificial Neural Networks, Deep Learning algorithms, Reinforcement Learning, Genetic algorithms, Data Mining and machine learning, Association rule mining, Novel feature selection algorithms, Statistical learning algorithms, Clustering, classification, and summarization of Web data, Data pre-processing and noise removal algorithms Swarm intelligence, Bio-inspired algorithms, Nature-inspired algorithms, Text mining, Intelligent algorithms of large spatial data, Information retrieval, Computer vision, Data Visualization."
    },
    {
      title: "Intelligent Data Analytics and Computing",
      icon: Database,
      description: "Big data analytics, Biomedical Computing, Bioinformatics, Green Computing, Computational Intelligence, Cognition computing, Data optimization, Graph and social mining, Nature Inspired Computing, High-performance computing, Signal and Image Processing, Reconfigurable Computing, Ubiquitous Computing, Autonomic and Trusted Computing, Evolutionary Computing, Web Intelligence and Computing, Cybersecurity, privacy and trust, Intelligent vehicles and autonomous cars, Fuzzy logic, and soft computing."
    },
    {
      title: "Informatics and Applications",
      icon: FileText,
      description: "Image processing and applications, Medical imaging, Natural language processing, recommender systems, Surveillance models, Time series analysis via deep learning or machine learning methods, Pattern recognition, Healthcare Informatics, Agricultural Informatics, and Communication, Information Systems, Brain-computer interface, Information sciences, Computational Economics, Sentiment analysis, and opinion mining, Question answering system, e-governance, e-commerce, e-business, e-Learning, Knowledge Management, Water management using machine learning, Internet of things (IoT), IoT for healthcare, IoT for agriculture, Novel machine learning models for Smart cities, Robotics."
    },
    {
      title: "Communication and Control Systems",
      icon: Network,
      description: "Wireless and Wired Networks, Multimedia Communications, Optical networks, Pervasive Computing, Next-Generation Networking and Internet, Optical Networks and Systems, Networking & Applications, Broadband Wireless Communication, Grid Computing, Cloud computing, Cognitive Radio and Networks, Resource Coordination and Management; Quality of Service; Queuing Network Models; Ad Hoc and Sensor Networks, Communication and Information Systems Security, Satellite and Space Communications."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Call for Papers" />
      
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Introduction */}
          <section className="prose prose-invert max-w-none animate-slide-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              IEEE Computer Society Bangalore Chapter and IEEE Computer Society Student Branch Chapter CHRIST University Bangalore are organizing the fourth edition of the 2026 IEEE International Conference on Contemporary Computing and Communications (InC4) on March 13-14, 2026, in association with the Department of Computer Science and Engineering, School of Engineering and Technology, CHRIST (Deemed to be University), Kengeri Campus, Bengaluru, India. The IEEE InC4-2026 aims to bring researchers, academicians, industry, and government personnel together to share and discuss the various aspects of Computing and Communications. The conference will witness multiple eminent keynote speakers from academia and industry worldwide and the presentation of accepted peer-reviewed articles. The IEEE InC4 2026 conference proceeding will be submitted for inclusion in IEEE XPLORE digital library.
            </p>
            <p className="text-muted-foreground mt-4">
              Original contributions based on the results of research and development are solicited. Prospective authors are requested to submit their papers in standard IEEE conference format in not more than 6 pages, in the following broad areas (but not limited to). Authors must ensure the relevance of their submissions to the scope, name, and theme of the conference.
            </p>
          </section>

          {/* Topics */}
          <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">Topics of Interest</h2>
            <div className="grid gap-6">
              {topics.map((topic, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <topic.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold mb-2">{topic.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Guidelines */}
          <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  Registered Paper Guidelines
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    The paper must strictly adhere to the standard IEEE two column format and must not be more than 6 pages.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    Typesetting instructions and sample templates: <a href="#" className="text-primary hover:underline font-medium">Click here</a>
                  </li>
                </ul>
                
                <div className="mt-8 flex justify-center">
                   <Button size="lg" className="w-full sm:w-auto font-semibold text-lg">
                    Submit Paper <ArrowRight className="ml-2 w-5 h-5" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
