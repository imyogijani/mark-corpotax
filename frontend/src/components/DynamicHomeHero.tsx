"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { contentService } from "@/lib/content-service";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, Phone, TrendingUp, PieChart, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/MotionWrapper";
import Counter from "@/components/Counter";
import FloatingGraffiti from "@/components/FloatingGraffiti";

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
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 70); // 70ms speed

    return () => clearInterval(interval);
  }, [text, trigger]);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-800">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="inline-block bg-blue-600 ml-1"
        style={{ width: "4px", height: "0.8em", verticalAlign: "baseline" }}
      ></motion.span>
    </h1>
  );
};

const InteractiveHeroImage = ({ heroMain }: { heroMain: HeroMainData }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 25 });

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    if (!currentTarget) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full flex items-center justify-center py-10"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Decorative Floating Elements */}
        {/* Chart Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 top-12 z-50 bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-50 hidden md:block"
          style={{ transform: "translateZ(50px)" }}
        >
          <PieChart className="w-8 h-8 text-blue-600" />
        </motion.div>

        {/* Trend Icon */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-8 bottom-40 z-50 bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-50 hidden md:block"
          style={{ transform: "translateZ(60px)" }}
        >
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </motion.div>

        {/* Shield Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute right-12 -top-12 z-20 bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-50 hidden md:block"
          style={{ transform: "translateZ(40px)" }}
        >
          <ShieldCheck className="w-8 h-8 text-orange-500" />
        </motion.div>

        {/* Existing Background Decorative Elements Refined */}
        <div
          className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[2rem] -z-10"
          style={{ transform: "translateZ(-20px)" }}
        ></div>

        {/* Main Image Card */}
        <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/50">
          <div className="h-[450px] relative">
            <Image
              src={
                heroMain?.hero_images?.image_1 ||
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
              }
              alt="Professional financial advisor team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* Experience Badge */}
        <div
          className="absolute -bottom-8 -left-8 z-30"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl relative overflow-hidden border-4 border-white bg-slate-800">
              <div className="absolute inset-2 border-2 border-dashed border-slate-600 rounded-full opacity-50 animate-[spin_50s_linear_infinite]"></div>

              <div className="relative z-10 text-center">
                <div className="text-3xl font-bold text-white mb-0.5">
                  <Counter
                    to={parseInt(heroMain?.experience_badge?.years || "12")}
                    duration={2.5}
                  />
                  <span>+</span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                  Years Exp.
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 rounded-full blur-xl -z-10"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function DynamicHeroSection() {
  const { isLoading } = useLoading();
  const [content, setContent] = useState<HeroMainData>(FALLBACK_HERO);

  const fetchContent = useCallback(async () => {
    try {
      const heroContent = await contentService.getContentBySection(
        "home",
        "hero_main",
      );
      if (heroContent && Object.keys(heroContent).length > 0) {
        setContent(() => ({ ...FALLBACK_HERO, ...heroContent }));
      }
    } catch (error) {
      console.error("Error loading hero content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchContent]);

  // Memoize the hero content to prevent unnecessary re-renders
  const heroMain = useMemo(() => content, [content]);

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/30 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #0b4c8010)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingGraffiti />
        <div
          className="absolute top-20 left-10 w-4 h-4 rounded-full opacity-60"
          style={{ backgroundColor: "#0b4c80" }}
        ></div>
        <div
          className="absolute top-32 left-20 w-2 h-2 rounded-full opacity-40"
          style={{ backgroundColor: "#0b4c80" }}
        ></div>
        <div
          className="absolute top-40 left-32 w-3 h-3 rounded-full opacity-50"
          style={{ backgroundColor: "#0b4c80" }}
        ></div>
        <div
          className="absolute bottom-40 left-16 w-5 h-5 rounded-full opacity-30"
          style={{ backgroundColor: "#0b4c80" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full opacity-70"
          style={{ backgroundColor: "#0b4c80" }}
        ></div>

        {/* Decorative grid pattern */}
        <div className="absolute bottom-32 right-32 grid grid-cols-6 gap-1 opacity-20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-400 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <MotionWrapper
            className="space-y-8"
            direction="left"
            delay={0.2}
            trigger={!isLoading}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">
                {heroMain?.tagline || "MARK GROUP"}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 py-2">
              <HeroTitle
                text={
                  heroMain?.title || "Shaping Financial Success in the AI Era"
                }
                trigger={!isLoading}
              />
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
              {heroMain?.description ||
                "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012 with expert guidance and transparent communication."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-16 px-10 text-white text-lg rounded-full font-semibold relative overflow-hidden group shadow-[0_0_20px_rgba(11,76,128,0.3)] hover:shadow-[0_0_30px_rgba(11,76,128,0.5)] transition-all duration-300 border border-white/10"
                  style={{
                    background:
                      "linear-gradient(135deg, #0b4c80 0%, #0d5ea0 100%)",
                  }}
                >
                  <Link
                    href={heroMain?.cta_primary?.link || "/appointment"}
                    className="inline-flex items-center gap-3"
                  >
                    <span className="relative z-10 tracking-wide">
                      {heroMain?.cta_primary?.text || "Get Started"}
                    </span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Plus className="w-5 h-5 relative z-10" />
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                      initial={{ x: "-150%" }}
                      whileHover={{ x: "150%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </Link>
                </Button>
              </motion.div>

              {/* Contact Info */}
              <Link href="tel:+919712067891" className="group">
                <div className="flex items-center gap-4 px-2 py-1 rounded-full hover:bg-slate-100/50 transition-colors duration-300 cursor-pointer">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md bg-white border border-slate-100">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <Phone className="w-6 h-6" style={{ color: "#0b4c80" }} />
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium group-hover:text-blue-600 transition-colors">
                      {heroMain?.phone?.help_text || "Need help?"}
                    </div>
                    <div className="font-bold text-slate-800 text-lg group-hover:text-[#0b4c80] transition-colors">
                      {heroMain?.phone?.number || "+91 97120 67891"}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </MotionWrapper>

          {/* Right Content - Image Section */}
          <MotionWrapper
            className="relative lg:pl-8 h-full flex items-center"
            direction="right"
            delay={0.4}
            trigger={!isLoading}
          >
            <InteractiveHeroImage heroMain={heroMain} />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
