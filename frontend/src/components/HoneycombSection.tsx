"use client";

import React, { useEffect } from "react";
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
  ShieldCheck,
} from "lucide-react";
import { ChangeDivisionButton } from "./ChangeDivisionButton";

interface HoneycombItem {
  icon: React.ElementType;
  title: string;
}

const financeItems: HoneycombItem[] = [
  { icon: Briefcase, title: "Project Management" },
  { icon: Factory, title: "MSME Consultancy" },
  { icon: Banknote, title: "Subsidy Consultancy" },
  { icon: Building2, title: "Industrial Liaisoning" },
  { icon: BarChart3, title: "Credit Monitoring" },
  { icon: LineChart, title: "Financial Analysis" },
  { icon: Scale, title: "Legal Support" },
  { icon: ClipboardCheck, title: "Registration" },
  { icon: Building2, title: "Business Setup" },
  { icon: Cpu, title: "Digital Solutions" },
  { icon: FileSearch, title: "Valuation" },
];

const taxationItems: HoneycombItem[] = [
  { icon: Scale, title: "Income Tax filing" },
  { icon: FileSearch, title: "GST Compliance" },
  { icon: ClipboardCheck, title: "Audit & Assurance" },
  { icon: Building2, title: "Company Formation" },
  { icon: Banknote, title: "Tax Planning" },
  { icon: Gavel, title: "Legal Advisory" },
  { icon: FileSearch, title: "TDS Compliance" },
  { icon: ShieldCheck, title: "IPR Registration" },
  { icon: Building2, title: "NGO Registration" },
  { icon: Factory, title: "Import Export" },
  { icon: ClipboardCheck, title: "FSSAI License" },
];

export default function HoneycombSection() {
  const [items, setItems] = React.useState<HoneycombItem[]>(financeItems);
  const [division, setDivision] = React.useState<string>("finance");

  useEffect(() => {
    const handleSync = () => {
      const savedDivision = localStorage.getItem("user_division") || "finance";
      setDivision(savedDivision);
      setItems(savedDivision === "finance" ? financeItems : taxationItems);
    };

    handleSync();
    
    // Initial animation
    anime({
      targets: ".honeycomb-tile",
      scale: [0, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      easing: "easeOutElastic(1, .8)",
      duration: 1000,
      delay: anime.stagger(100),
    });

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#0074E4] relative overflow-hidden font-sans">
      {/* Structural Pattern Background - Dashboard Style */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 40 Q 50 30 100 40" stroke="white" fill="none" strokeWidth="0.1" className="animate-pulse" />
          <path d="M0 70 Q 50 60 100 70" stroke="white" fill="none" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '2s' }} />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <header className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <ChangeDivisionButton
            shouldAnimate={true}
            className="mb-10 bg-white/10 border-white/20 hover:bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-white flex flex-col items-center"
          >
            <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
              Comprehensive Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              {division === "finance" ? "Finance Ecosystem" : "Taxation Interface"}
            </h2>
            <div className="w-24 h-1.5 bg-white rounded-full shadow-lg" />
          </motion.div>
        </header>

        {/* 1-2-3-2-3 Dashboard Interlocking Grid matches reference image */}
        <div className="flex flex-col items-center justify-center space-y-[-24px] md:space-y-[-42px]">
          {/* Row 1 (Center Top) */}
          <div className="flex justify-center z-50">
            <HexTile item={items[0]} delay={0.1} />
          </div>

          {/* Row 2 (Sides) */}
          <div className="flex justify-center space-x-[8px] md:space-x-[15px] z-40">
            <HexTile item={items[1]} delay={0.2} />
            <HexTile item={items[2]} delay={0.2} />
          </div>

          {/* Row 3 (Main Row) */}
          <div className="flex justify-center space-x-[8px] md:space-x-[15px] z-30">
            <HexTile item={items[3]} delay={0.3} />
            <HexTile item={items[4]} delay={0.3} />
            <HexTile item={items[5]} delay={0.3} />
          </div>

          {/* Row 4 (Lower Sides) */}
          <div className="flex justify-center space-x-[8px] md:space-x-[15px] z-20">
            <HexTile item={items[6]} delay={0.4} />
            <HexTile item={items[7]} delay={0.4} />
          </div>

          {/* Row 5 (Base) */}
          <div className="flex justify-center space-x-[8px] md:space-x-[15px] z-10">
            <HexTile item={items[8]} delay={0.5} />
            <HexTile item={items[9]} delay={0.5} />
            <HexTile item={items[10]} delay={0.5} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HexTile({ item, delay }: { item: HoneycombItem; delay: number }) {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        zIndex: 100,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="honeycomb-tile relative w-[100px] h-[115px] md:w-[180px] md:h-[208px] flex items-center justify-center transition-all duration-300 opacity-0 group isolate"
    >
      {/* Precise White Dashboard Hexagon Shape */}
      <svg
        className="absolute inset-0 w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        viewBox="0 0 100 115"
      >
        {/* Shadow/Outline */}
        <polygon
          points="50,2 98,30 98,85 50,113 2,85 2,30"
          className="fill-white"
        />

        {/* Precise Blue Border - matches image blue */}
        <polygon
          points="50,2 98,30 98,85 50,113 2,85 2,30"
          className="fill-none stroke-[#0074E4] stroke-[1.2] opacity-80"
        />

        {/* Origami Focal Geometry Highlight (matches reference) */}
        <polygon
          points="50,2 98,30 50,57.5 2,30"
          className="fill-slate-100 opacity-20 pointer-events-none"
        />

        {/* Reflective Glossy Top Overlay */}
        <polygon
          points="50,2 98,30 80,45 50,57.5 20,45 2,30"
          className="fill-white opacity-40 pointer-events-none"
        />
      </svg>

      {/* Content Layout per Image style */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3 md:p-6 text-center w-full h-full group-hover:scale-105 transition-transform duration-500">
        <div className="mb-2 md:mb-5">
          <Icon className="w-7 h-7 md:w-12 md:h-12 text-[#0074E4]" strokeWidth={1.5} />
        </div>

        <h3 className="text-[7px] md:text-[12px] font-bold text-slate-800 leading-tight md:leading-snug max-w-[85%] mx-auto">
          {item.title}
        </h3>
      </div>

      {/* Shine Sweep animation on hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <motion.div
          animate={{ x: [-200, 200] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
          className="w-[200px] h-[300px] bg-white/20 blur-xl rotate-[45deg] origin-center"
        />
      </div>
    </motion.div>
  );
}
