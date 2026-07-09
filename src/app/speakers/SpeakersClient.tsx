"use client";

import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/common/Reveal";
import { Badge } from "@/components/ui/badge";
import { getPhotoUrl, normalizePhotoFields } from "@/lib/photoMigration";
import type { SpeakersData } from "@/types/data";
import speakersData from "@/data/speakers.json";
import { getPreviewData } from "@/lib/previewMode";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function SpeakersClient() {
  const [speakers, setSpeakers] = useState(normalizePhotoFields((speakersData as SpeakersData).root));

  useEffect(() => {
    const previewData = getPreviewData("src/data/speakers.json");
    if (previewData) {
      try {
        const parsed = JSON.parse(previewData) as SpeakersData;
        setSpeakers(normalizePhotoFields(parsed.root));
      } catch (e) {
        console.error("Failed to parse preview data", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Keynote Speakers" />

      <div className="container mx-auto px-4 pb-20">
        {speakers.length === 0 ? (
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
        ) : (
          <div className="py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => {
              const photoUrl = getPhotoUrl(speaker.photo);

              return (
                <Reveal key={`${speaker.name}-${index}`} width="100%">
                  <div className="group relative">
                    <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                    <div className="relative bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
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
                        {speaker.topic && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                              {speaker.topic}
                            </span>
                          </div>
                        )}
                      </div>

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
        )}
      </div>
    </div>
  );
}
