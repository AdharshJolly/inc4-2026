import { PageTitle } from "@/components/PageTitle";
import { Linkedin, Twitter } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";

export default function Speakers() {
  useSEO({
    title: "Keynote Speakers | IEEE InC4 2026",
    description:
      "Meet the distinguished keynote speakers at IEEE InC4 2026. Renowned researchers and industry experts sharing insights on computing and communications.",
    keywords:
      "keynote speakers, InC4, conference speakers, IEEE, research experts, industry leaders, computing",
    canonicalUrl: "https://ic4.co.in/speakers",
  });

  const speakers = [
    {
      name: "Prof. Dr. S.S. Iyengar",
      role: "Distinguished University Professor",
      affiliation: "Florida International University, Miami",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRazweYMznr6twfdAzQef0XBTGHFv3t7BJfXA&s",
      topic: "AI & Autonomous Systems",
    },
    {
      name: "Damodaran Subramanian",
      role: "Chief Executive Officer",
      affiliation: "ChipEdge Technologies Pvt Ltd",
      image:
        "https://d1hbpr09pwz0sk.cloudfront.net/profile_pic/damodaran-subramanian-e6d5db9b",
      topic: "Semiconductor Innovation",
    },
    {
      name: "Dr. Sourav Kanti Addya",
      role: "Assistant Professor",
      affiliation: "NITK Surathkal",
      image:
        "https://i0.wp.com/ieeecsbangalore.org/wp-content/uploads/2024/06/sourav-500x500-1-e1717351315834.jpg?resize=300%2C300&ssl=1",
      topic: "Cloud & Edge Computing",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Keynote Speakers" />

      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <Reveal key={speaker.name} width="100%">
              <div className="group relative">
                <div className="relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-card-hover transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                    {/* Topic Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        {speaker.topic}
                      </span>
                    </div>

                    {/* Social Links */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-secondary font-medium text-sm mb-2">
                      {speaker.role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {speaker.affiliation}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
