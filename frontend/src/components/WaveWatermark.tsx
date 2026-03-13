"use client";

import { motion } from "framer-motion";

export function WaveWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none">
      {/* Grid Pattern Removed */}
      
      {/* Animated Flowing Line Removed */}

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
