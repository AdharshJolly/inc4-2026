import { PageTitle } from "@/components/PageTitle";
import { Linkedin, Twitter, Users } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";
import { Link } from "react-router-dom";
import speakers from "@/data/speakers.json";

export default function Speakers() {
  useSEO({
    title: "Keynote Speakers | IEEE InC4 2026",
    description:
      "Meet the distinguished keynote speakers at IEEE InC4 2026. Renowned researchers and industry experts sharing insights on computing and communications.",
    keywords:
      "keynote speakers, InC4, conference speakers, IEEE, research experts, industry leaders, computing",
    canonicalUrl: "https://ic4.co.in/speakers",
  });

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Keynote Speakers" />

      <div className="container mx-auto px-4 pb-20">
        {/* Speakers To Be Announced Placeholder */}
        <div className="py-20 text-center space-y-8">
          <Reveal width="100%">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-primary/5 rounded-full border border-primary/10">
                <Users className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              Keynote Speakers Coming Soon
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are currently inviting distinguished speakers for InC4 2026.
              Please check back later to see the lineup of experts who will be
              sharing their insights.
            </p>
          </Reveal>
        </div>

        {/* 
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <Reveal key={speaker.name} width="100%">
              <div className="group relative">
                <div className="relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-500">
                  {/* Image * /}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                    {/* Topic Badge * /}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        {speaker.topic}
                      </span>
                    </div>

                    {/* Social Links * /}
                    {speaker.linkedin && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          to={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Content * /}
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
        */}
      </div>
    </div>
  );
}
