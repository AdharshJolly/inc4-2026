"use client";

import { PageTitle } from "@/components/PageTitle";
import { Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import speakersData from "@/data/speakers.json";
import { normalizePhotoFields } from "@/lib/photoMigration";
import type { SpeakersData } from "@/types/data";
import { getPreviewData } from "@/lib/previewMode";
import { useEffect, useState } from "react";

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
      </div>
    </div>
  );
}
