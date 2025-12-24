import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import speakersData from "@/data/speakers.json";
import { getPhotoUrl, normalizePhotoFields } from "@/lib/photoMigration";
import type { SpeakersData } from "@/types/data";

// Get first 3 speakers from JSON data
const allSpeakers = normalizePhotoFields((speakersData as SpeakersData).root);
const speakers = allSpeakers.slice(0, 3);

export const SpeakersSection = () => {
  return (
    <section
      id="speakers"
      className="py-24 md:py-40 gradient-dark relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pattern-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal width="100%">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Learn From The Best
            </span>
          </Reveal>
          <Reveal width="100%">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
              Keynote <span className="text-gradient-primary">Speakers</span>
            </h2>
          </Reveal>
          <Reveal width="100%">
            <p className="text-primary-foreground/60 max-w-2xl mx-auto text-lg">
              World-renowned experts sharing their insights on the latest
              developments in computing and communications.
            </p>
          </Reveal>
        </div>

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {speakers.map((speaker) => {
            const photoUrl = getPhotoUrl(speaker.photo);

            return (
              <Reveal key={speaker.name} width="100%">
                <div className="group relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={speaker.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-card/80">
                          <span className="text-5xl font-bold text-primary-foreground/60">
                            {speaker.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
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
              </Reveal>
            );
          })}
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
