import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 },
  },
};

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero pt-40 md:pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pattern-grid opacity-30" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* Geometric Shapes */}
      <div className="absolute top-32 right-20 w-20 h-20 border-2 border-primary/30 rotate-45 animate-spin-slow" />
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-secondary/30 rounded-full animate-float" />
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/40 rotate-45" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary font-medium text-sm">
              Fourth Edition • IEEE International Conference
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6"
          >
            <span className="text-gradient-primary">InC4</span>{" "}
            <span className="text-primary-foreground">2026</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-primary-foreground/80 font-display mb-4"
          >
            <br />
            Computing and Communications
          </motion.p>

          {/* Event Details */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">March 13-14, 2026</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-medium">CHRIST University, Bengaluru</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={item}
            className="text-primary-foreground/60 max-w-2xl mx-auto mb-10 text-lg"
          >
            Join researchers and practitioners from academia, industry, and
            government to explore the cutting-edge of computing and
            communication technologies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/">
              <Button variant="hero" size="xl">
                Submit Paper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/schedule">
              <Button variant="heroOutline" size="xl">
                View Schedule
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};
