import { Reveal } from "@/components/common/Reveal";
import Image from "next/image";
import { isExternalUrl } from "@/lib/utils";

const partners = [
  {
    name: "IEEE Computer Society",
    logo: "/images/ieee_cs_bc.png",
    type: "Organizer",
  },
  {
    name: "CHRIST University",
    logo: "/images/cu_color.png",
    type: "Organizer",
  },
  {
    name: "Springer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Springer_logo.svg/2560px-Springer_logo.svg.png",
    type: "Technical Partner",
  },
];

export const SponsorsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Reveal>
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Our Partners
            </span>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-6">
              Supported By
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80">
          {partners.map((partner, index) => (
            <Reveal key={index} width="fit-content">
              <div className="group relative grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105">
                <div className="relative h-16 md:h-20 w-32 md:w-48 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 128px, 192px"
                    unoptimized={isExternalUrl(partner.logo)}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
