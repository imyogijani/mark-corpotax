"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Coins,
  Wallet,
} from "lucide-react";

const icons = [DollarSign, TrendingUp, PieChart, BarChart3, Coins, Wallet];

export default function FloatingGraffiti() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-slate-900/5 dark:text-white/5"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random(),
          }}
          animate={{
            y: [null, Math.random() * -100],
            rotate: [null, Math.random() * 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <Icon size={40 + Math.random() * 60} />
        </motion.div>
      ))}
    </div>
  );
}
