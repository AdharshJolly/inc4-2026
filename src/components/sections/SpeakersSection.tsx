import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/common/Reveal";
import speakersData from "@/data/speakers.json";
import { getPhotoUrl, normalizePhotoFields } from "@/lib/photoMigration";
import { isExternalUrl } from "@/lib/utils";
import type { SpeakersData } from "@/types/data";

// Get first 3 speakers from JSON data
const allSpeakers = normalizePhotoFields((speakersData as SpeakersData).root);
const speakers = allSpeakers.slice(0, 3);

export const SpeakersSection = () => {
  return (
    <section
      id="speakers"
      className="py-24 md:py-40 bg-muted/30 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pattern-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <Reveal width="100%">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Learn From The Best
            </span>
          </Reveal>
          <Reveal width="100%">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Keynote <span className="text-gradient-primary">Speakers</span>
            </h2>
          </Reveal>
          <Reveal width="100%">
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              World-renowned experts sharing their insights on the latest
              developments in computing and communications.
            </p>
          </Reveal>
        </div>

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 mb-12 mt-16">
          {speakers.map((speaker) => {
            const photoUrl = getPhotoUrl(speaker.photo);

            return (
              <Reveal key={speaker.name} width="100%">
                <div className="pt-20">
                  <div className="group relative">
                    {/* Glow Effect properly matching card height */}
                    <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative bg-card border border-border rounded-3xl p-6 pt-24 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 text-center">
                      {/* Floating Avatar */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-4 border-card overflow-hidden bg-muted shadow-xl group-hover:scale-105 transition-transform duration-500">
                        {photoUrl ? (
                          <Image
                            src={photoUrl}
                            alt={speaker.name}
                            fill
                            className="object-cover"
                            sizes="160px"
                            unoptimized={isExternalUrl(photoUrl)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-4xl font-bold text-muted-foreground">
                              {speaker.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Topic Badge */}
                      {speaker.topic && (
                        <div className="mb-4">
                          <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 inline-block">
                            {speaker.topic}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mb-2">
                        {speaker.role}
                      </p>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                        {speaker.affiliation}
                      </p>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3">
                        {speaker.linkedin && (
                          <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${speaker.name} on LinkedIn`}
                            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group/social text-muted-foreground"
                          >
                            <Linkedin className="w-4 h-4 group-hover/social:scale-110 transition-transform" />
                          </a>
                        )}
                        {speaker.twitter && (
                          <a
                            href={speaker.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${speaker.name} on Twitter`}
                            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group/social text-muted-foreground"
                          >
                            <Twitter className="w-4 h-4 group-hover/social:scale-110 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/speakers">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Speakers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
