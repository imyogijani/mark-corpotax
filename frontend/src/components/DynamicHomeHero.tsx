"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
} from "framer-motion";
import anime from "animejs";
import { contentService } from "@/lib/content-service";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, Phone, TrendingUp, PieChart, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/MotionWrapper";
import Counter from "@/components/Counter";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import HeroClipart from "./HeroClipart";

interface HeroMainData {
  tagline?: string;
  title?: string;
  description?: string;
  cta_primary?: {
    text?: string;
    link?: string;
  };
  phone?: {
    number?: string;
    help_text?: string;
  };
  hero_images?: {
    image_1?: string;
    image_2?: string;
  };
  experience_badge?: {
    years?: string;
    text?: string;
  };
}

// Static fallback content - renders immediately without loading
const FALLBACK_HERO: HeroMainData = {
  tagline: "MARK GROUP",
  title: "Shaping Financial Success in the AI Era",
  description:
    "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012 with expert guidance and transparent communication.",
  cta_primary: { text: "Get Started", link: "/appointment" },
  phone: { number: "+91 97120 67891", help_text: "Need help?" },
  experience_badge: { years: "12", text: "Years Of experience" },
};

const HeroTitle = ({
  text,
  trigger = true,
}: {
  text: string;
  trigger?: boolean;
}) => {
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

  // Split text into characters including spaces
  const characters = text.split("");

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 overflow-hidden">
      {characters.map((char, i) => (
        <span
          key={i}
          className="hero-char inline-block whitespace-pre opacity-0"
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

const StaticHeroImage = ({
  heroMain,
  y3,
}: {
  heroMain: HeroMainData;
  y3: any;
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-10">
      <div className="relative z-10 w-full max-w-lg">
        <div className="relative flex items-center justify-center min-h-[350px] w-full">
          <HeroClipart />

          {/* Experience Badge */}
          <motion.div
            style={{ y: y3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 group hover:bg-white transition-colors duration-500 z-50 text-slate-900"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-black text-blue-400 tracking-tighter">
                <Counter
                  to={parseInt(heroMain.experience_badge?.years || "12")}
                />
                +
              </span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                Since 2012
              </span>
              <span className="text-sm font-bold text-slate-700 leading-tight">
                {heroMain.experience_badge?.text || "Years Of Experience"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-blue-100 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-dashed border-slate-200 rounded-full"
        />
      </div>
    </div>
  );
};

export const DynamicHeroSection = () => {
  const { isLoading } = useLoading();
  const [heroMain, setHeroMain] = useState<HeroMainData>(FALLBACK_HERO);

  const fetchHeroContent = useCallback(async () => {
    try {
      const data = await contentService.getContent("home", "hero_main");
      if (data) {
        setHeroMain(data);
      } else {
        setHeroMain(FALLBACK_HERO);
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
      setHeroMain(FALLBACK_HERO);
    }
  }, []);

  useEffect(() => {
    fetchHeroContent();
  }, [fetchHeroContent]);

  const graffitiElements = useMemo(
    () => [
      { text: "FINANCE", top: "15%", left: "5%", size: "8rem", opacity: 0.03 },
      { text: "LEGAL", top: "70%", left: "8%", size: "10rem", opacity: 0.04 },
      { text: "GROWTH", top: "10%", right: "10%", size: "7rem", opacity: 0.03 },
      {
        text: "TAXATION",
        top: "40%",
        right: "5%",
        size: "6rem",
        opacity: 0.02,
      },
      { text: "MARK", top: "80%", right: "15%", size: "8rem", opacity: 0.03 },
      {
        text: "SUCCESS",
        bottom: "5%",
        left: "40%",
        size: "9rem",
        opacity: 0.05,
      },
    ],
    [],
  );

  const { scrollY } = useScroll();

  // Parallax offsets for different elements
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -80]);
  const y3 = useTransform(scrollY, [0, 500], [0, 50]);

  // Determine a 'division' for dynamic watermark text
  const [division, setDivision] = useState<string>("finance");

  useEffect(() => {
    const savedDivision = localStorage.getItem("user_division");
    if (savedDivision) setDivision(savedDivision);
  }, []);

  return (
    <section
      className="relative min-h-[75vh] flex items-center overflow-hidden bg-slate-50 pt-16 md:pt-12"
      id="home"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-100/60 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-emerald-50/80 blur-[100px] rounded-full -z-10" />

      {/* Background Watermarks with Scroll Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-10 -left-10 text-[15vw] font-black text-slate-900/[0.03] select-none leading-none"
        >
          {division?.toUpperCase() || "FINANCE"}
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 -right-20 text-[12vw] font-black text-slate-900/[0.02] select-none leading-none"
        >
          GROWTH
        </motion.div>
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-0 -left-10 text-[18vw] font-black text-slate-900/[0.03] select-none leading-none uppercase"
        >
          {division === "finance" ? "Capital" : "Legal"}
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-10 right-0 text-[15vw] font-black text-slate-900/[0.03] select-none leading-none"
        >
          MARK
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-6">
          {/* Left Content Side */}
          <div className="flex flex-col space-y-8">
            <MotionWrapper direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 font-semibold text-sm uppercase tracking-wider shadow-sm">
                <Plus className="w-4 h-4" />
                <span>{heroMain.tagline || "MARK GROUP"}</span>
              </div>
            </MotionWrapper>

            <HeroTitle text={heroMain.title || FALLBACK_HERO.title!} />

            <MotionWrapper direction="left" delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                {heroMain.description || FALLBACK_HERO.description}
              </p>
            </MotionWrapper>

            <MotionWrapper
              direction="left"
              delay={0.4}
              className="flex flex-wrap gap-6 items-center pt-4"
            >
              <Link href={heroMain.cta_primary?.link || "/appointment"}>
                <Button className="h-14 px-10 rounded-2xl bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-lg shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-95 group">
                  {heroMain.cta_primary?.text || "Get Started"}
                  <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>

              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100 text-blue-600"
                >
                  <Phone className="w-5 h-5" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">
                    {heroMain.phone?.help_text || "Need help?"}
                  </span>
                  <Link
                    href={`tel:${heroMain.phone?.number}`}
                    className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {heroMain.phone?.number || "+91 97120 67891"}
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          </div>

          {/* Right Image Side */}
          <MotionWrapper direction="right" delay={0.3}>
            <StaticHeroImage heroMain={heroMain} y3={y3} />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
};
