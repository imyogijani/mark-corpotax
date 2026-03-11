"use client";

import { motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.25, // Very quick for high-speed feel
        ease: "linear",  // Linear fade is the most seamless for "invisible" transitions
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
