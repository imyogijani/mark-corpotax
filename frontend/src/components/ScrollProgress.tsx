"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  division?: string;
}

export default function ScrollProgress({ division }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const barColor = division === 'taxation' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-[#0b4c80] shadow-[0_0_15px_rgba(11,76,128,0.3)]';

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${barColor} origin-left z-[100]`}
      style={{ scaleX }}
    />
  );
}
