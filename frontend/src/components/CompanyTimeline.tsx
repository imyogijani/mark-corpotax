"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Building2,
  Globe,
  Network,
  Shield,
  TrendingUp,
  Zap,
  Trophy,
} from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const CompanyTimeline = () => {
  const timelineItems: TimelineItem[] = [
    {
      year: "1991",
      title: "STARTED OPERATIONS",
      description: "Inception of our journey with a vision to revolutionize Surat's financial landscape.",
      icon: Rocket,
    },
    {
      year: "2006-07",
      title: "MULTI-BANK INTEGRATION",
      description: "Moved to a comprehensive multi-bank platform, expanding choice for our clients.",
      icon: Building2,
    },
    {
      year: "2010-11",
      title: "REGIONAL EXPANSION",
      description: "Successfully began our strategic expansion beyond Mumbai and South Gujarat.",
      icon: Globe,
    },
    {
      year: "2012",
      title: "NETWORK SCALING",
      description: "Launched nationwide loan distribution by leveraging advanced agent networks.",
      icon: Network,
    },
    {
      year: "2015",
      title: "INSURANCE VENTURE",
      description: "Diversified our portfolio by launching comprehensive corporate insurance solutions.",
      icon: Shield,
    },
    {
      year: "2023",
      title: "WEALTH MANAGEMENT",
      description: "Inaugurated our dedicated Wealth Business division for strategic capital asset management.",
      icon: TrendingUp,
    },
    {
      year: "2024",
      title: "DIGITAL & REAL ESTATE",
      description: "Launched our proprietary digital platform and expanded into premium real estate consulting.",
      icon: Zap,
    },
    {
      year: "2025",
      title: "SCALE MILESTONE",
      description: "Disbursed a record ₹1.0B+ Cr. of loans, marking our dominance in corporate finance.",
      icon: Trophy,
    },
  ];

  return (
    <section className="py-40 bg-white relative overflow-hidden italic-none">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50/50 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Our Corporate Journey</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-4"
          >
            Moments to <br />
            Remember
          </motion.h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Vertical Center Line with reveal animation */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[4px] bg-blue-500 rounded-full hidden md:block origin-top"
          />

          {/* Timeline Items */}
          <div className="relative space-y-12 md:space-y-0">
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 1;
              const Icon = item.icon;

              return (
                <div key={index} className="relative md:min-h-[260px] flex items-center overflow-visible">
                  <div className={`flex w-full items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col md:flex-row gap-8 md:gap-0`}>

                    {/* Content Card Side */}
                    <motion.div
                      className="w-full md:w-1/2 px-4 md:px-12 z-20"
                      initial={{
                        opacity: 0,
                        x: isEven ? -100 : 100, // Slide from the center line
                        scale: 0.9
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        scale: 1
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        type: "spring",
                        stiffness: 70,
                        damping: 15,
                        delay: 0.1
                      }}
                    >
                      <div className={`p-10 md:p-14 bg-white rounded-[2.5rem] md:rounded-[3.2rem] border border-slate-100 shadow-[0_30px_70px_rgba(0,0,0,0.04)] relative group hover:shadow-2xl transition-all duration-500 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'} items-center text-center md:text-left`}>

                        {/* Connecting horizontal line animation */}
                        <motion.div
                          className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-blue-500 ${isEven ? 'left-[-48px]' : 'right-[-48px]'} origin-right`}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 }}
                        />

                        <div className={`flex items-center gap-4 mb-5 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          <div className="h-[2px] w-12 bg-blue-500 hidden md:block" />
                          <span className="text-4xl font-black text-blue-600 tracking-tighter">
                            {item.year}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-tight">
                          {item.title}
                        </h3>

                        <p className={`text-sm md:text-base font-medium text-slate-500 leading-relaxed max-w-xs ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                          {item.description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Middle Diamond side with pop animation */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        whileInView={{ scale: 1, rotate: 45 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.3
                        }}
                        className="w-14 h-14 bg-[#f8faff] border-[3px] border-blue-500 rounded-xl flex items-center justify-center shadow-[0_10px_40px_rgba(37,99,235,0.2)]"
                      >
                        <motion.div
                          initial={{ opacity: 0, rotate: -45 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                          className="-rotate-45 text-blue-600"
                        >
                          <Icon className="w-5 h-5 stroke-[2.5px]" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Empty side for layout balance */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative gradient reveal background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute top-[45%] left-0 right-0 h-[300px] border-y border-blue-100/30 -z-10 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent pointer-events-none"
      />
    </section>
  );
};

export default CompanyTimeline;
