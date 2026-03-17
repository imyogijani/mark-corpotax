"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [currentDivision, setCurrentDivision] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 origin-left z-[999] transition-colors duration-500 ${
        currentDivision === "taxation" ? "bg-emerald-600" : "bg-[#0b4c80]"
      }`}
      style={{ scaleX }}
    />
  );
}
