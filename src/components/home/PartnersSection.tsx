import { Reveal } from "@/components/common/Reveal";
import Image from "next/image";
import { Award, Globe, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  {
    name: "James Cook University, Australia",
    country: "Australia",
    qsRanking: "440",
    image: "/images/partners/cadsi.png",
    type: "Academic",
  },
  {
    name: "De La Salle University Manila",
    country: "Philippines",
    qsRanking: "654",
    image: "/images/partners/dlsu.png",
    type: "Academic",
  },
  {
    name: "Binghamton University, USA",
    country: "USA",
    qsRanking: "1001-1200",
    image: "/images/partners/Binghamton University.png",
    type: "Academic",
  },
  {
    name: "Western Michigan University, USA",
    country: "USA",
    qsRanking: "1201-1400",
    image: "/images/partners/wmu.png",
    type: "Academic",
  },
  {
    name: "Universidade Federal de Santa Catarina, Brazil",
    country: "Brazil",
    qsRanking: "801-850",
    image: "/images/partners/labsec.png",
    type: "Academic",
  },
  {
    name: "University of Applied Sciences, Würzburg Schweinfurt, Germany",
    country: "Germany",
    qsRanking: "NA",
    image: "/images/partners/thws.png",
    type: "Academic",
  },
  {
    name: "Synabl Technologies Private Limited",
    country: "Bangalore India",
    qsRanking: "NA",
    image: "/images/partners/synabl.png",
    type: "Industry",
  },
];

export const PartnersSection = () => {
  return (
    <section id="partners" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Reveal width="100%">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Our Network
            </span>
          </Reveal>
          <Reveal width="100%">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-6 mb-4">
              Industry and Academic <span className="text-gradient-primary">Partners</span>
            </h2>
          </Reveal>
          <Reveal width="100%">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Collaborating with leading institutions and industry pioneers worldwide to foster innovation and excellence in computing.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <Reveal key={index} width="100%">
              <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 hover:bg-muted/50 transition-all duration-300 group">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-full h-32 relative mb-6 rounded-lg bg-white/5 p-4 flex items-center justify-center border border-white/5 group-hover:border-primary/10 transition-colors">
                    {partner.image ? (
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex-grow">
                    {partner.name}
                  </h3>
                  
                  <div className="w-full space-y-2 mt-auto">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 text-primary/80" />
                      <span>{partner.country}</span>
                    </div>
                    
                    {partner.type === "Academic" ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4 text-primary/80" />
                        <span>QS Ranking: <strong className="text-foreground">{partner.qsRanking !== "NA" ? partner.qsRanking : "N/A"}</strong></span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 text-primary/80" />
                        <span>Industry Partner</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
