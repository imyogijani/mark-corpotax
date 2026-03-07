"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animate, stagger } from "animejs";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";

interface LandingChoiceProps {
  onChoice: (choice: "finance" | "taxation") => void;
}

export default function LandingChoice({ onChoice }: LandingChoiceProps) {
  const [hovered, setHovered] = useState<"finance" | "taxation" | null>(null);

  // Anime.js for entry animation
  useEffect(() => {
    animate(".choice-panel", {
      scaleX: [0, 1],
      opacity: [0, 1],
      easing: "easeInOutQuart",
      duration: 1200,
      delay: stagger(200),
    });

    animate(".choice-content", {
      translateY: [50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1500,
      delay: 800,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Finance Side */}
      <motion.div
        className="choice-panel relative flex-1 cursor-pointer group origin-left"
        onMouseEnter={() => setHovered("finance")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onChoice("finance")}
      >
        <div
          className="absolute inset-0 bg-slate-900 transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(11, 76, 128, 0.4) 0%, transparent 70%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundBlendMode: "overlay",
          }}
        />

        {/* Abstract Background for Finance */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <motion.path
              d="M0 70 Q 25 60 50 70 T 100 65"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </svg>
        </div>

        <div className="choice-content relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Finance
          </h2>
          <p className="text-blue-100/70 text-lg max-w-sm mb-8">
            Strategic wealth management and corporate funding solutions for your
            growth.
          </p>
          <div className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 text-white font-semibold">
            Explore Solutions <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Overlay for inactive state */}
        <motion.div
          className="absolute inset-0 bg-black/40 pointer-events-none"
          animate={{ opacity: hovered === "taxation" ? 0.6 : 0 }}
        />
      </motion.div>

      {/* Taxation Side */}
      <motion.div
        className="choice-panel relative flex-1 cursor-pointer group origin-right"
        onMouseEnter={() => setHovered("taxation")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onChoice("taxation")}
      >
        <div
          className="absolute inset-0 bg-slate-950 transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 70%, rgba(6, 95, 70, 0.4) 0%, transparent 70%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundBlendMode: "overlay",
          }}
        />

        {/* Abstract Background for Taxation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-6 gap-2 rotate-12 scale-150">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="h-20 border border-emerald-400/30 rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="choice-content relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <ShieldCheck className="w-12 h-12 text-emerald-200" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Taxation
          </h2>
          <p className="text-emerald-100/70 text-lg max-w-sm mb-8">
            Expert compliance, auditing, and tax planning to secure your
            business future.
          </p>
          <div className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 text-white font-semibold">
            Talk to Experts <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Overlay for inactive state */}
        <motion.div
          className="absolute inset-0 bg-black/40 pointer-events-none"
          animate={{ opacity: hovered === "finance" ? 0.6 : 0 }}
        />
      </motion.div>

      {/* Logo Badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-slate-900 p-4 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-slate-950 flex items-center justify-center w-24 h-24">
          <span className="text-white font-black text-2xl tracking-tighter">
            MG
          </span>
        </div>
      </div>
    </div>
  );
}
