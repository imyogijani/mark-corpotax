"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export default function Counter({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const count = useSpring(from, {
    duration: duration * 1000,
    bounce: 0,
    stiffness: 50,
  });

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, to, count]);

  return (
    <span className={`inline-flex items-center ${className}`} ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
