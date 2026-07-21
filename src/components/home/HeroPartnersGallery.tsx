"use client";

import React, { useState } from "react";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
const PartnerCard = ({ partner }: { partner: any }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className="flex-shrink-0 snap-center relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto flex items-center justify-center group cursor-pointer transition-all bg-white/[0.07] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15] rounded-xl sm:rounded-2xl px-4 sm:px-6 shadow-[0_4px_20px_-4px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_24px_-4px_rgba(255,255,255,0.1)]"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setOpen(false);
          }}
          onClick={() => setOpen(!open)}
        >
          {partner.image ? (
            <img
              src={partner.image}
              alt={partner.name}
              draggable={false}
              className={`h-full w-auto object-contain py-2 md:py-4 transition-all duration-300 group-hover:scale-110 ${partner.whiteLogo ? 'brightness-0 invert' : 'brightness-[1.6] contrast-125 group-hover:brightness-[1.8]'}`}
            />
          ) : (
            <Building2 className="w-8 h-8 text-white/50 group-hover:text-white transition-colors duration-300" />
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        side="bottom"
        className="w-72 bg-background/95 backdrop-blur-xl border-white/20 p-4 shadow-2xl z-[100]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground text-sm leading-tight">
            {partner.name}
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1 opacity-70" />
              {partner.country}
            </div>
            {partner.link && (
              <a href={partner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium">
                Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const HeroPartnersGallery = ({ initialPartners = [] }: { initialPartners?: any[] }) => {
  const [partners] = useState(() => {
    return initialPartners.map(p => ({
      name: p.name,
      country: p.country,
      link: p.link,
      image: p.image_url,
      whiteLogo: p.white_logo,
    }));
  });

  if (!partners || partners.length === 0) return null;

  return (
    <div className="mt-12 mb-10 w-full flex flex-col items-center justify-center opacity-95">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-primary-foreground/90 mb-4 md:mb-6 text-center tracking-wide">
          Industry and Academic Partners
        </h3>
        <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden py-3 px-2 sm:px-4 md:py-4 md:px-6">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
            }
            .animate-marquee:hover, .animate-marquee:active, .animate-marquee:focus-within {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex items-center gap-5 sm:gap-8 md:gap-12 w-max px-4 animate-marquee py-4">
            {[...partners, ...partners, ...partners, ...partners].map(
              (partner, i) => (
                <PartnerCard key={i} partner={partner} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
