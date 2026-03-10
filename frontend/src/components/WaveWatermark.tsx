"use client";

import { motion } from "framer-motion";

export function WaveWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none">
      {/* Blueprint Grid Pattern - White/Soft Grey version */}
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_60%,transparent_100%)]" />
      
      {/* Animated Flowing Line - Soft White */}
      <div className="absolute top-0 left-0 w-full h-[700px] opacity-[0.2]">
        <motion.div
          animate={{
            x: ["-25%", "0%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 w-[200%] h-full"
        >
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <path 
              d="M0,200 C300,100 900,300 1200,200" 
              fill="none" 
              stroke="url(#whiteGrad)" 
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Subtle White Glows for Depth */}
      <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-white/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-white/[0.015] rounded-full blur-[150px] pointer-events-none" />

      {/* Minimalist Watermark Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01]">
        <span className="text-[12vw] font-black uppercase tracking-[0.8em] text-white">
          MARK
        </span>
      </div>
    </div>
  );
}
