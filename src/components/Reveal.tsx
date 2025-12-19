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
  const isInView = useInView(ref, { once: true });
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
        variants={{
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.5,
          delay: shouldReduceMotion ? 0 : 0.25,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
