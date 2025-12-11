import { CountdownTimer } from "./CountdownTimer";
import { Users, Globe, Award, BookOpen } from "lucide-react";
import { Reveal } from "./Reveal";

const stats = [
  { icon: Users, value: "500+", label: "Attendees" },
  { icon: Globe, value: "30+", label: "Countries" },
  { icon: Award, value: "100+", label: "Papers" },
  { icon: BookOpen, value: "15+", label: "Workshops" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Countdown */}
        <div className="text-center mb-20">
          <Reveal width="100%">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Conference Begins In
            </h2>
          </Reveal>
          <Reveal width="100%">
            <CountdownTimer />
          </Reveal>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <Reveal>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                About The Conference
              </span>
            </Reveal>
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
                Shaping the Future of
                <span className="text-gradient-primary"> Computing</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The fourth edition of IEEE International Conference on Contemporary
                Computing and Communications (InC4) is organized by IEEE Computer
                Society Bangalore Chapter and IEEE Computer Society Student Branch
                Chapter CHRIST University Bangalore.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                InC4 2026 will bring together researchers and practitioners from
                academia, industry, and government to deliberate upon contemporary
                computing and communication's algorithmic, systemic, applied, and
                educational aspects.
              </p>
            </Reveal>

            {/* Organizers */}
            <Reveal>
              <div className="flex flex-wrap gap-4">
                <div className="bg-muted rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">Organized by</p>
                  <p className="font-semibold text-foreground text-sm">IEEE Computer Society</p>
                </div>
                <div className="bg-muted rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground">In association with</p>
                  <p className="font-semibold text-foreground text-sm">CHRIST University</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} width="100%">
                <div
                  className="relative group overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <stat.icon className="w-10 h-10 text-primary mb-4" />
                  <p className="font-display text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="text-center">
          <h3 className="font-display text-2xl font-bold text-foreground mb-8">
            Conference Topics
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Artificial Intelligence",
              "Machine Learning",
              "Cloud Computing",
              "IoT & Edge Computing",
              "Cybersecurity",
              "Blockchain",
              "Data Science",
              "Computer Vision",
              "Natural Language Processing",
              "5G & Communications",
            ].map((topic) => (
              <span
                key={topic}
                className="bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-default"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
