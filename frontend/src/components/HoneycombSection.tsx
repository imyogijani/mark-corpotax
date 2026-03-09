"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import anime from "animejs";
import {
  ClipboardCheck,
  Briefcase,
  Factory,
  Banknote,
  Building2,
  Scale,
  BarChart3,
  FileSearch,
  Cpu,
  Gavel,
  LineChart,
} from "lucide-react";

interface HoneycombItem {
  icon: React.ElementType;
  title: string;
}

const defaultItems: HoneycombItem[] = [
  { icon: ClipboardCheck, title: "Registration & Licensing" },
  { icon: Briefcase, title: "Project Management" },
  { icon: Factory, title: "MSME Consultancy" },
  { icon: Banknote, title: "Subsidy Consultancy" },
  { icon: Building2, title: "Industrial Liaisoning" },
  { icon: Scale, title: "Taxation Services" },
  { icon: BarChart3, title: "Credit Monitoring" },
  { icon: FileSearch, title: "Valuation Services" },
  { icon: Cpu, title: "Digital Solutions" },
  { icon: Gavel, title: "Legal Support" },
  { icon: LineChart, title: "Financial Analysis" },
];

export default function HoneycombSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anime({
      targets: ".honeycomb-tile",
      scale: [0, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutElastic(1, .8)",
      duration: 1000,
      delay: anime.stagger(100),
    });
  }, []);

  return (
    <section className="py-24 bg-[#0b4c80] relative overflow-hidden text-white">
      {/* Background Honeycomb Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hexagons"
              width="100"
              height="173.2"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.5)"
            >
              <polygon
                points="50,0 100,25 100,75 50,100 0,75 0,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <polygon
                points="50,86.6 100,111.6 100,161.6 50,186.6 0,161.6 0,111.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The Mark Edge</h2>
          <p className="text-blue-100/70 max-w-2xl mx-auto">
            Comprehensive solutions tailored for your business excellence.
          </p>
        </div>

        {/* Honeycomb Grid Container */}
        <div className="flex flex-col items-center justify-center space-y-[-20px] md:space-y-[-40px]">
          {/* Row 1: 1 hex */}
          <div className="flex justify-center">
            <HexTile item={defaultItems[0]} />
          </div>

          {/* Row 2: 2 hexes */}
          <div className="flex justify-center space-x-[-15px] md:space-x-[-30px]">
            <HexTile item={defaultItems[1]} />
            <HexTile item={defaultItems[2]} />
          </div>

          {/* Row 3: 3 hexes */}
          <div className="flex justify-center space-x-[-15px] md:space-x-[-30px]">
            <HexTile item={defaultItems[3]} />
            <HexTile item={defaultItems[4]} />
            <HexTile item={defaultItems[5]} />
          </div>

          {/* Row 4: 2 hexes */}
          <div className="flex justify-center space-x-[-15px] md:space-x-[-30px]">
            <HexTile item={defaultItems[6]} />
            <HexTile item={defaultItems[7]} />
          </div>

          {/* Row 5: 2 hexes */}
          <div className="flex justify-center space-x-[-15px] md:space-x-[-30px]">
            <HexTile item={defaultItems[8]} />
            <HexTile item={defaultItems[9]} />
          </div>

          {/* Row 6: 1 hex */}
          <div className="flex justify-center">
            <HexTile item={defaultItems[10]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HexTile({ item }: { item: HoneycombItem }) {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.1, zIndex: 20 }}
      className="honeycomb-tile relative w-[140px] h-[160px] md:w-[180px] md:h-[200px] flex items-center justify-center transition-all duration-300 opacity-0 group"
    >
      {/* SVG Hexagon Shape */}
      <svg
        className="absolute inset-0 w-full h-full drop-shadow-xl"
        viewBox="0 0 100 115"
      >
        <polygon
          points="50,5 95,30 95,85 50,110 5,85 5,30"
          className="fill-white group-hover:fill-blue-50 transition-colors duration-300 pointer-events-auto"
        />
        <polygon
          points="50,5 95,30 95,85 50,110 5,85 5,30"
          className="fill-none stroke-blue-200 group-hover:stroke-blue-400 stroke-[2] transition-colors duration-300"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#0b4c80] mb-2 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-[10px] md:text-sm font-bold text-slate-800 leading-tight">
          {item.title}
        </span>
      </div>
    </motion.div>
  );
}
