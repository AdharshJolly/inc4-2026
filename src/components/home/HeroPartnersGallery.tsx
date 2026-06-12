"use client";

import React from "react";
import Image from "next/image";
import { Building2, MapPin, Award } from "lucide-react";
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
    qs: "1201-1400",
    image: "/images/partners/wmu.png",
  },
  {
    name: "De La Salle University Manila",
    country: "Philippines",
    qs: "654",
    image: "/images/partners/dlsu.png",
  },
  {
    name: "Binghamton University",
    country: "USA",
    qs: "1001-1200",
    image: "/images/partners/Binghamton University.png",
  },
  {
    name: "James Cook University",
    country: "Australia",
    qs: "440",
    image: "/images/partners/cadsi.png",
    invert: true,
  },
  {
    name: "Universidade Federal de Santa Catarina",
    country: "Brazil",
    qs: "801-850",
    image: "/images/partners/labsec.png",
  },
  {
    name: "University of Applied Sciences Würzburg-Schweinfurt",
    country: "Germany",
    qs: "NA",
    image: "/images/partners/thws.png",
    invert: true,
  },
  {
    name: "Synabl Technologies Pvt Ltd",
    country: "Bangalore, India",
    qs: "Industry",
    image: "/images/partners/synabl.png",
  },
];

const PartnerCard = ({ partner }: { partner: any }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className="flex-shrink-0 snap-center relative h-16 sm:h-20 md:h-24 lg:h-28 w-auto flex items-center justify-center group cursor-pointer transition-all"
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
            {partner.qs !== "NA" && (
              <Badge
                variant={partner.qs === "Industry" ? "secondary" : "default"}
                className="text-[10px] px-2 py-0"
              >
                {partner.qs === "Industry"
                  ? "Industry Partner"
                  : `QS ${partner.qs}`}
              </Badge>
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
