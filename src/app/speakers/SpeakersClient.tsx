"use client";

import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/badge";
import { getPhotoUrl } from "@/lib/photoMigration";
import { useState } from "react";
import { Users, Linkedin } from "lucide-react";

export default function SpeakersClient({ initialSpeakers = [] }: { initialSpeakers?: any[] }) {
  const [speakers, setSpeakers] = useState(() => {
    return initialSpeakers.map(s => ({
      name: s.name,
      role: s.role,
      affiliation: s.affiliation,
      topic: s.topic,
      linkedin: s.linkedin,
      photo: { url: s.photo_url }
    }));
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <Reveal width="100%">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-gradient-primary">Speakers</span>
            </h1>
          </Reveal>
          <Reveal width="100%">
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Learn from industry leaders, renowned academics, and visionary
              thinkers shaping the future of computing.
            </p>
          </Reveal>
        </div>

        {speakers.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-20">
            <Reveal width="100%">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 border border-primary/20">
                <Users className="w-10 h-10 text-primary" />
              </div>
            </Reveal>
            <Reveal width="100%">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Speakers to be Announced
              </h2>
            </Reveal>
            <Reveal width="100%">
              <p className="text-muted-foreground text-lg">
                We are currently curating an exceptional lineup of speakers for
                InC4 2026. Please check back later for updates.
              </p>
            </Reveal>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 mb-12 mt-16 max-w-7xl mx-auto">
            {speakers.map((speaker, index) => {
              const photoUrl = getPhotoUrl(speaker.photo);

              return (
                <Reveal key={speaker.name} width="100%" className="h-full">
                  <div className="pt-20 h-full">
                    <div className="relative h-full flex flex-col bg-card border border-border rounded-3xl p-6 pt-24 text-center">
                      {/* Floating Avatar */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-4 border-card overflow-hidden bg-muted shadow-xl">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={speaker.name}
                            className="w-full h-full object-cover"
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
                      <p className="text-muted-foreground text-sm mb-6">
                        {speaker.affiliation}
                      </p>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mt-auto">
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
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Internal Links */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-card/50 p-8">
          <h3 className="text-xl font-bold mb-4">Explore InC4 2026</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/schedule" className="text-sm text-primary hover:underline">Schedule</a>
            <a href="/committee" className="text-sm text-primary hover:underline">Committee</a>
            <a href="/call-for-papers" className="text-sm text-primary hover:underline">Call for Papers</a>
            <a href="/important-dates" className="text-sm text-primary hover:underline">Important Dates</a>
            <a href="/registration" className="text-sm text-primary hover:underline">Registration</a>
            <a href="/about" className="text-sm text-primary hover:underline">About</a>
            <a href="/contact" className="text-sm text-primary hover:underline">Contact</a>
            <a href="/crc-submissions" className="text-sm text-primary hover:underline">CRC Submissions</a>
          </div>
        </div>
      </div>
    </div>
  );
}
