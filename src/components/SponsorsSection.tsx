import { Reveal } from "./Reveal";

const partners = [
  { name: "IEEE Computer Society", logo: "/images/ieee_cs_logo.png", type: "Organizer" },
  { name: "CHRIST University", logo: "/images/cu_logo.png", type: "Organizer" },
  { name: "Springer", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Springer_logo.svg/2560px-Springer_logo.svg.png", type: "Technical Partner" },
  { name: "Scopus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scopus_logo.svg/2560px-Scopus_logo.svg.png", type: "Technical Partner" },
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
                <div className="h-16 md:h-20 flex items-center justify-center">
                  {/* Placeholder for logos if images fail, but ideally should rely on alt text or actual images */}
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="h-full w-auto object-contain max-w-[200px]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerText = partner.name; 
                    }}
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
