"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useInView,
} from "framer-motion";
import anime from "animejs";
import { contentService } from "@/lib/content-service";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, Phone, TrendingUp, PieChart, ShieldCheck, ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/MotionWrapper";
import Counter from "@/components/Counter";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import HeroClipart from "./HeroClipart";

interface HeroMainData {
  tagline?: string;
  title?: string;
  description?: string;
  cta_primary?: { text?: string; link?: string };
  phone?: { number?: string; help_text?: string };
  hero_images?: { image_1?: string; image_2?: string };
  experience_badge?: { years?: string; text?: string };
}

const FALLBACK_HERO: HeroMainData = {
  tagline: "MARK GROUP",
  title: "Shaping Financial Success in the AI Era",
  description:
    "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012 with expert guidance and transparent communication.",
  cta_primary: { text: "Get Started", link: "/appointment" },
  phone: { number: "+91 97120 67891", help_text: "Need help?" },
  experience_badge: { years: "12", text: "Years Of experience" },
};

const HeroTitle = ({ text, trigger = true }: { text: string; trigger?: boolean }) => {
  useEffect(() => {
    if (!trigger) return;
    anime({
      targets: ".hero-char",
      opacity: [0, 1],
      translateY: [20, 0],
      rotateZ: [10, 0],
      scale: [0.5, 1],
      easing: "easeOutElastic(1, .8)",
      duration: 800,
      delay: anime.stagger(40),
    });
  }, [text, trigger]);

  const characters = text.split("");

  return (
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight overflow-hidden">
      {characters.map((char, i) =>
        char === "\n" ? (
          <br key={i} />
        ) : (
          <span key={i} className="hero-char inline-block whitespace-pre opacity-0">
            {char}
          </span>
        )
      )}
    </h1>
  );
};

const StaticHeroImage = ({ heroMain, y3 }: { heroMain: HeroMainData; y3: any }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-10">
      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex items-center justify-center min-h-[400px] w-full"
        >
          {/* Main Illustration Glow */}
          <div className="absolute inset-0 bg-blue-400/10 blur-[100px] rounded-full -z-10 animate-pulse" />

          <HeroClipart />

          {/* Experience Badge - Premium Light Theme */}
          <motion.div
            style={{ y: y3 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, type: "spring", damping: 15 }}
            className="absolute bottom-4 right-0 md:-right-8 bg-white/90 backdrop-blur-xl px-6 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(37,99,235,0.1)] border border-blue-100 flex items-center gap-4 group hover:bg-white transition-all duration-500 z-50 text-slate-900 overflow-hidden"
          >
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex flex-col relative z-10">
              <span className="text-4xl font-black text-blue-600 tracking-tighter">
                <Counter to={parseInt(heroMain.experience_badge?.years || "12")} />+
              </span>
            </div>
            <div className="h-12 w-[1px] bg-slate-200 relative z-10" />
            <div className="flex flex-col justify-center relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                Since 2012
              </span>
              <span className="text-sm font-bold text-slate-700 leading-tight">
                {heroMain.experience_badge?.text || "Years Of Experience"}
              </span>
            </div>
          </motion.div>

          {/* Floating Element 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 bg-white p-3 rounded-2xl border border-blue-100 shadow-xl hidden md:block"
          >
            <PieChart className="w-6 h-6 text-blue-600" />
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 -left-20 bg-white p-3 rounded-2xl border border-emerald-100 shadow-xl hidden lg:block"
          >
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-blue-200 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-emerald-200 rounded-full"
        />
      </div>
    </div>
  );
};

export const DynamicHeroSection = () => {
  const { isLoading } = useLoading();
  const [heroMain, setHeroMain] = useState<HeroMainData>(FALLBACK_HERO);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const fetchHeroContent = useCallback(async () => {
    try {
      const data = await contentService.getContent("home", "hero_main");
      if (data) setHeroMain(data);
      else setHeroMain(FALLBACK_HERO);
    } catch {
      setHeroMain(FALLBACK_HERO);
    }
  }, []);

  useEffect(() => {
    fetchHeroContent();
  }, [fetchHeroContent]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -120]);
  const y3 = useTransform(scrollY, [0, 500], [0, 80]);

  const [division, setDivision] = useState<string>("finance");
  useEffect(() => {
    const saved = localStorage.getItem("user_division");
    if (saved) setDivision(saved);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 pt-20 md:pt-16"
      id="home"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Spotlight */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
        style={{ background: "radial-gradient(800px circle at center, rgba(37,99,235,0.08), transparent 80%)" }}
        animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] bg-blue-100 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-emerald-100/60 blur-[150px] rounded-full -z-10" />

      {/* Background Watermarks */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-10 -left-10 text-[18vw] font-black text-slate-200 select-none leading-none tracking-tighter opacity-70"
        >
          {division?.toUpperCase() || "FINANCE"}
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 -right-20 text-[14vw] font-black text-slate-200 select-none leading-none tracking-tighter opacity-50"
        >
          GROWTH
        </motion.div>
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-[-5%] -left-10 text-[20vw] font-black text-slate-100 select-none leading-none uppercase tracking-tighter opacity-80"
        >
          {division === "finance" ? "Capital" : "Legal"}
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
          {/* Left Content */}
          <div className="flex flex-col space-y-10">
            <MotionWrapper direction="left">
              <div className="inline-flex items-center gap-2 px-1 py-1 pr-4 bg-white border border-blue-100 rounded-full text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider shadow-sm group">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <span>{heroMain.tagline || "MARK GROUP"}</span>
              </div>
            </MotionWrapper>

            <HeroTitle
              text={
                division === "taxation"
                  ? "Expert Taxation &\nLegal Compliance"
                  : (heroMain.title?.replace("Financial Solutions", "Financial\nSolutions").replace("Business Growth", "\nBusiness Growth") || FALLBACK_HERO.title!)
              }
            />

            <MotionWrapper direction="left" delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
                {division === "taxation"
                  ? "Strategic legal advisory and comprehensive tax solutions designed for sustainable business growth and compliance in a changing landscape."
                  : (heroMain.description || FALLBACK_HERO.description)}
              </p>
            </MotionWrapper>

            <MotionWrapper direction="left" delay={0.4} className="flex flex-wrap gap-8 items-center pt-4">
              <Link href={heroMain.cta_primary?.link || "/appointment"}>
                <button className="group relative h-16 px-10 rounded-2xl bg-blue-600 font-bold text-white text-base overflow-hidden shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    {heroMain.cta_primary?.text || "Get Started"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 skew-x-12 transition-transform duration-500" />
                </button>
              </Link>

              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center border border-blue-50 text-blue-600 cursor-pointer"
                >
                  <Phone className="w-6 h-6" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {heroMain.phone?.help_text || "Need help?"}
                  </span>
                  <Link
                    href={`tel:${division === "taxation" ? "9773822604" : "9712067891"}`}
                    className="text-lg font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tight"
                  >
                    {division === "taxation" 
                      ? "+91 97738 22604" 
                      : (heroMain.phone?.number === "+91 97120 67891" ? "+91 97120 67891/92" : (heroMain.phone?.number || "+91 97120 67891/92"))}
                  </Link>
                </div>
              </div>
            </MotionWrapper>

            {/* Trusted By */}
            <MotionWrapper direction="up" delay={0.6} className="pt-8 border-t border-slate-100 max-w-md">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden ring-1 ring-slate-200">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`}
                        alt="Avatar"
                        width={40}
                        height={40}
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-slate-200">
                    2.5k+
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold text-sm">Trusted by MSMEs</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Across Gujarat</span>
                </div>
              </div>
            </MotionWrapper>
          </div>

          {/* Right Image */}
          <MotionWrapper direction="right" delay={0.3}>
            <StaticHeroImage heroMain={heroMain} y3={y3} />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
};
