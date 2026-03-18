"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

interface ScrollProgressProps {
  division?: string;
}

export default function ScrollProgress({ division: propDivision }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [currentDivision, setCurrentDivision] = useState<string | null>(propDivision || null);

  useEffect(() => {
    if (propDivision) {
      setCurrentDivision(propDivision);
      return;
    }

    const handleSync = () => {
      setCurrentDivision(localStorage.getItem("user_division"));
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, [propDivision]);

  // Only show green if we're in taxation AND not in admin
  const isTaxation = currentDivision === "taxation" && !pathname.startsWith("/admin");
  const barColor = isTaxation ? "bg-emerald-600" : "bg-[#0b4c80]";

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 origin-left z-[999] transition-colors duration-500 ${barColor}`}
      style={{ scaleX }}
    />
  );
}
