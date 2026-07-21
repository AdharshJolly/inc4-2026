"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useAnimation,
  useReducedMotion,
} from "framer-motion";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
}

export const Reveal = ({
  children,
  width = "fit-content",
  className = "",
}: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "50px" });
  const shouldReduceMotion = useReducedMotion();

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width, overflow: "hidden" }}
      className={className}
    >
      <motion.div
        className="h-full"
        variants={{
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="visible"
        animate={mainControls}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.4,
          delay: shouldReduceMotion ? 0 : 0.1,
          ease: "easeOut",
        }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
