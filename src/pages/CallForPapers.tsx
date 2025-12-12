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
  Download
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function CallForPapers() {
  useSEO({
    title: "Call for Papers | IEEE InC4 2026",
    description:
      "Submit your research papers to IEEE InC4 2026. Guidelines for paper submission, research topics, and important deadlines for the International Conference on Contemporary Computing and Communications.",
    keywords:
      "call for papers, paper submission, IEEE InC4, research papers, conference guidelines, submission deadline",
    canonicalUrl: "https://ic4.co.in/call-for-papers",
  });

  const topics = [
    {
      title: "Intelligent System",
      icon: Cpu,
      description:
        "Algorithms and Applications: Decision trees, Support Vector Machine, Artificial Neural Networks, Deep Learning algorithms, Reinforcement Learning, Genetic algorithms, Data Mining and machine learning, Association rule mining, Novel feature selection algorithms, Statistical learning algorithms, Clustering, classification, and summarization of Web data, Data pre-processing and noise removal algorithms Swarm intelligence, Bio-inspired algorithms, Nature-inspired algorithms, Text mining, Intelligent algorithms of large spatial data, Information retrieval, Computer vision, Data Visualization.",
    },
    {
      title: "Intelligent Data Analytics and Computing",
      icon: Database,
      description:
        "Big data analytics, Biomedical Computing, Bioinformatics, Green Computing, Computational Intelligence, Cognition computing, Data optimization, Graph and social mining, Nature Inspired Computing, High-performance computing, Signal and Image Processing, Reconfigurable Computing, Ubiquitous Computing, Autonomic and Trusted Computing, Evolutionary Computing, Web Intelligence and Computing, Cybersecurity, privacy and trust, Intelligent vehicles and autonomous cars, Fuzzy logic, and soft computing.",
    },
    {
      title: "Informatics and Applications",
      icon: FileText,
      description:
        "Image processing and applications, Medical imaging, Natural language processing, recommender systems, Surveillance models, Time series analysis via deep learning or machine learning methods, Pattern recognition, Healthcare Informatics, Agricultural Informatics, and Communication, Information Systems, Brain-computer interface, Information sciences, Computational Economics, Sentiment analysis, and opinion mining, Question answering system, e-governance, e-commerce, e-business, e-Learning, Knowledge Management, Water management using machine learning, Internet of things (IoT), IoT for healthcare, IoT for agriculture, Novel machine learning models for Smart cities, Robotics.",
    },
    {
      title: "Communication and Control Systems",
      icon: Network,
      description:
        "Wireless and Wired Networks, Multimedia Communications, Optical networks, Pervasive Computing, Next-Generation Networking and Internet, Optical Networks and Systems, Networking & Applications, Broadband Wireless Communication, Grid Computing, Cloud computing, Cognitive Radio and Networks, Resource Coordination and Management; Quality of Service; Queuing Network Models; Ad Hoc and Sensor Networks, Communication and Information Systems Security, Satellite and Space Communications.",
    },
  ];

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
                            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 w-fit">InC4 2026</span>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                IEEE Computer Society Bangalore Chapter & Christ University
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                              Organizing the fourth edition of the 2026 IEEE International Conference on Contemporary Computing and Communications (InC4) on <span className="text-foreground font-semibold">March 13-14, 2026</span>.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Bringing researchers, academicians, industry, and government personnel together to share and discuss various aspects of Computing and Communications. Accepted peer-reviewed articles will be submitted for inclusion in <span className="text-primary font-semibold">IEEE XPLORE</span> digital library.
                            </p>

                             <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 text-sm font-medium bg-secondary/30 px-3 py-2 rounded-lg">
                                    <Calendar className="w-4 h-4 text-primary" /> March 13-14, 2026
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium bg-secondary/30 px-3 py-2 rounded-lg">
                                    <MapPin className="w-4 h-4 text-primary" /> Bengaluru, India
                                </div>
                             </div>
                        </div>

                        {/* Right side decoration/info */}
                        <div className="bg-secondary/10 rounded-2xl p-8 border border-secondary/20 h-full flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-4">Submission Scope</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Original contributions based on the results of research and development are solicited. Prospective authors are requested to submit their papers in standard IEEE conference format in not more than 6 pages.
                            </p>
                             <Button size="lg" className="w-full gap-2" asChild>
                                <a href="https://cmt3.research.microsoft.com/InC42025" target="_blank" rel="noopener noreferrer">
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

          {/* Topics Grid */}
          <section>
            <Reveal>
               <h2 className="text-3xl font-bold mb-12 text-center">Topics of Interest  ( Not Limited To )</h2>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <Reveal key={index} width="100%">
                    <div className="group h-full bg-card border border-border p-8 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                          <topic.icon className="w-8 h-8" />
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
              ))}
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
                      
                      <h2 className="text-3xl md:text-4xl font-bold">Registered Paper Guidelines</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8 text-left">
                          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                              <p className="font-bold text-lg mb-2 text-primary">Formatting Rules</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                  The paper must strictly adhere to the standard IEEE two column format and must not be more than 6 pages.
                              </p>
                          </div>
                           <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center">
                              <p className="font-bold text-lg mb-4 text-primary">Need Help?</p>
                              <Button className="w-full gap-2" asChild>
                                  <a href="https://drive.google.com/drive/folders/1DqCpJHxmPtFlfaajHuaXAy8pWm86iME5?usp=sharing" target="_blank" rel="noopener noreferrer">
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
