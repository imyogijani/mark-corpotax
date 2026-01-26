"use client";

import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef } from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  viewport?: UseInViewOptions;
  trigger?: boolean;
}

export function MotionWrapper({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  viewport = { once: true, margin: "-100px" },
  trigger = true,
}: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const getVariants = () => {
    const distance = 20;

    const variants = {
      hidden: {
        opacity: 0,
        y: direction === "up" ? distance : direction === "down" ? -distance : 0,
        x:
          direction === "left"
            ? distance
            : direction === "right"
              ? -distance
              : 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: duration,
          delay: delay,
          ease: "easeOut" as const,
        },
      },
    };

    if (direction === "none") {
      variants.hidden.y = 0;
      variants.hidden.x = 0;
    }

    return variants;
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView && trigger ? "visible" : "hidden"}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerContainer = ({
  children,
  className = "",
  delay = 0,
  viewport = { once: true, margin: "-100px" },
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  viewport?: UseInViewOptions;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = "",
  hoverEffect = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 },
        },
      }}
      whileHover={hoverEffect ? { scale: 1.05, y: -5 } : {}}
    >
      {children}
    </motion.div>
  );
};
