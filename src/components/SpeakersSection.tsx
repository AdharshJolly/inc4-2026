import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

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

export const SpeakersSection = () => {
  return (
    <section
      id="speakers"
      className="py-20 md:py-32 gradient-dark relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pattern-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Learn From The Best
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
            Keynote <span className="text-gradient-primary">Speakers</span>
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto text-lg">
            World-renowned experts sharing their insights on the latest
            developments in computing and communications.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.name}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

              <div className="relative bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />

                  {/* Topic Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                      {speaker.topic}
                    </span>
                  </div>

                  {/* Social Links */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-dark-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                      <Linkedin className="w-4 h-4 text-primary-foreground" />
                    </button>
                    <button className="w-8 h-8 bg-dark-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                      <Twitter className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                    {speaker.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">
                    {speaker.role}
                  </p>
                  <p className="text-primary-foreground/60 text-sm">
                    {speaker.affiliation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/speakers">
            <Button variant="heroOutline" size="lg">
              View All Speakers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
