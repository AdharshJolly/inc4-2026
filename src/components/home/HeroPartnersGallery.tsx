"use client";

import React from "react";
import Image from "next/image";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const partners = [
  {
    name: "Western Michigan University",
    country: "USA",
    link: "https://wmich.edu/",
    image: "/images/partners/wmu.png",
  },
  {
    name: "De La Salle University Manila",
    country: "Philippines",
    link: "https://www.dlsu.edu.ph/",
    image: "/images/partners/dlsu.png",
  },
  {
    name: "Binghamton University",
    country: "USA",
    link: "https://www.binghamton.edu/",
    image: "/images/partners/Binghamton University.png",
  },
  {
    name: "James Cook University",
    country: "Australia",
    link: "https://www.jcu.edu.au/cadsi",
    image: "/images/partners/cadsi.png",
    invert: true,
  },
  {
    name: "Universidade Federal de Santa Catarina",
    country: "Brazil",
    link: "https://labsec.ufsc.br/",
    image: "/images/partners/labsec.png",
  },
  {
    name: "University of Applied Sciences Würzburg-Schweinfurt",
    country: "Germany",
    link: "https://www.thws.de/en/",
    image: "/images/partners/thws.png",
    invert: true,
  },
  {
    name: "Synabl Technologies Pvt Ltd",
    country: "Bangalore, India",
    link: "https://synabl.ai/",
    image: "/images/partners/synabl.png",
  },
];

const PartnerCard = ({ partner }: { partner: any }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className="flex-shrink-0 snap-center relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto flex items-center justify-center group cursor-pointer transition-all bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 shadow-[0_4px_20px_-4px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_24px_-4px_rgba(255,255,255,0.1)]"
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
              className={`h-full w-auto object-contain py-2 md:py-4 transition-all duration-300 group-hover:scale-110 brightness-[1.3] contrast-125 group-hover:brightness-[1.5] ${partner.invert ? 'invert' : ''}`}
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

export const HeroPartnersGallery = () => {
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
