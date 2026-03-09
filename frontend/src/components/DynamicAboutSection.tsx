"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { contentService } from "@/lib/content-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  Shield,
  Layers,
} from "lucide-react";
import { MotionWrapper } from "@/components/MotionWrapper";
import ScrollWatermark from "@/components/ScrollWatermark";

interface AboutSectionData {
  tagline?: string;
  title?: string;
  description?: string;
  highlights?: string[];
  stats?: { label: string; value: string; icon?: string }[];
  cta?: { text: string; link: string };
}

const FALLBACK_ABOUT: AboutSectionData = {
  tagline: "About Us",
  title: "Your Trusted Financial Partner Since 2012",
  description:
    "Founded in Surat, Gujarat, MARK GROUP is dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.",
  highlights: [
    "Expert team with decades of experience",
    "Transparent and ethical practices",
    "Personalized financial solutions",
    "Trusted by 2500+ satisfied clients",
  ],
  stats: [
    { value: "12+", label: "Years Experience", icon: "Award" },
    { value: "2500+", label: "Happy Clients", icon: "Users" },
    { value: "5000+", label: "Projects Done", icon: "TrendingUp" },
    { value: "100%", label: "Client Satisfaction", icon: "Shield" },
  ],
  cta: { text: "Learn More", link: "/about" },
};

function useCountAnimation(endValue: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      // Easing function for smooth animation (easeOutExpo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(endValue * easeOutExpo));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(endValue);
    };
    requestAnimationFrame(animate);
  }, [endValue, duration, hasStarted]);

  useEffect(() => {
    if (!startOnView) { startAnimation(); return; }
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting && !hasStarted) startAnimation(); }); },
      { threshold: 0.3 }
    );
    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [startOnView, startAnimation, hasStarted]);

  return { count, elementRef };
}

function parseStatValue(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/);
  if (match) {
    return { number: parseFloat(match[2].replace(/,/g, "")) || 0, prefix: match[1] || "", suffix: match[3] || "" };
  }
  return { number: 0, prefix: "", suffix: value };
}

function formatNumber(num: number, hasDecimal: boolean = false): string {
  if (hasDecimal) return num.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return num.toLocaleString("en-US");
}

// Animated Stat Component
function AnimatedStat({ value, label, icon, index }: { value: string; label: string; icon?: string; index: number }) {
  const { number, prefix, suffix } = parseStatValue(value);
  const hasDecimal = value.includes(".");
  const { count, elementRef } = useCountAnimation(number, 2000);

  const getStatIcon = (iconName?: string, idx?: number) => {
    // Icons without hardcoded colors to allow parent control
    const iconMap: { [key: string]: JSX.Element } = {
      Award: <Award className="w-8 h-8" />,
      Users: <Users className="w-8 h-8" />,
      TrendingUp: <TrendingUp className="w-8 h-8" />,
      Shield: <Shield className="w-8 h-8" />,
    };
    const defaultIcons = [
      <Award key="award" className="w-8 h-8" />,
      <Users key="users" className="w-8 h-8" />,
      <TrendingUp key="trending" className="w-8 h-8" />,
      <Shield key="shield" className="w-8 h-8" />,
    ];
    const iconElement = iconName && iconMap[iconName] ? iconMap[iconName] : defaultIcons[(idx || 0) % defaultIcons.length];
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ type: "spring", stiffness: 200, delay: (idx || 0) * 0.1 }}
        variants={{
          hover: { rotate: [0, -10, 10, -5, 5, 0], scale: 1.1, transition: { duration: 0.5 } },
        }}
      >
        {iconElement}
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="relative bg-transparent group h-full flex flex-col justify-between transition-colors duration-300"
    >
      <motion.div variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-transparent pointer-events-none" />
      <motion.div variants={{ hover: { scaleX: 1, opacity: 1 } }} initial={{ scaleX: 0, opacity: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 origin-left" />

      <motion.div
        variants={{ hover: { y: -4, backgroundColor: "rgba(59,130,246,0.2)", color: "#60a5fa", boxShadow: "0 10px 25px -5px rgba(59,130,246,0.2)" } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-blue-600 bg-blue-50 border border-blue-100 relative z-10"
      >
        <div className="[&>svg]:w-7 [&>svg]:h-7">{getStatIcon(icon, index)}</div>
      </motion.div>

      <div className="relative z-10">
        <motion.div variants={{ hover: { y: -2 } }} transition={{ duration: 0.3 }} className="text-4xl font-black mb-2 tabular-nums tracking-tight text-slate-900">
          {prefix}{formatNumber(count, hasDecimal)}{suffix}
        </motion.div>
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-4 bg-blue-200 group-hover:w-8 group-hover:bg-blue-500 transition-all duration-300 mb-[2px]" />
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest group-hover:text-blue-600 transition-colors duration-300">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// This merges individual keys (highlight_1, stat_1_value) with existing arrays
const transformAboutData = (data: Record<string, unknown>): AboutSectionData => {
  if (!data) return {};

  // Start with existing highlights array or empty
  let highlights: string[] = Array.isArray(data.highlights) ? [...(data.highlights as string[])] : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 10; i++) {
    const key = `highlight_${i}`;
    if (data[key] !== undefined && data[key] !== "") {
      // Override position i-1 in the array
      highlights[i - 1] = data[key] as string;
    }
  }
  // Remove any empty/undefined entries but keep the order
  highlights = highlights.filter((h) => h !== undefined && h !== "");

  // Start with existing stats array or empty
  let stats: { value: string; label: string; icon?: string }[] = Array.isArray(data.stats)
    ? (data.stats as { value: string; label: string; icon?: string }[]).map((s) => ({ ...s }))
    : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 6; i++) {
    const valueKey = `stat_${i}_value`;
    const labelKey = `stat_${i}_label`;
    const iconKey = `stat_${i}_icon`;

    // If either value or label exists for this index, update that stat
    if (data[valueKey] !== undefined || data[labelKey] !== undefined) {
      // Ensure the array has enough elements
      while (stats.length < i) stats.push({ value: "", label: "" });
      // Update the stat at position i-1
      if (data[valueKey] !== undefined && data[valueKey] !== "") stats[i - 1].value = data[valueKey] as string;
      if (data[labelKey] !== undefined && data[labelKey] !== "") stats[i - 1].label = data[labelKey] as string;
      if (data[iconKey] !== undefined) stats[i - 1].icon = data[iconKey] as string;
    }
  }
  // Remove any stats with empty value and label
  stats = stats.filter((s) => s.value || s.label);

  // Transform CTA data - handle both 'link' and 'href' properties from CMS
  let ctaData: { text: string; link: string } | undefined = undefined;
  if (data.cta && typeof data.cta === "object") {
    const ctaObj = data.cta as Record<string, unknown>;
    const text = (ctaObj.text as string) || "";
    const link = (ctaObj.link as string) || (ctaObj.href as string) || "";
    if (text && link) ctaData = { text, link };
  }

  return {
    tagline: data.tagline as string | undefined,
    title: data.tagline as string | undefined,
    description: data.description as string | undefined,
    highlights: highlights.length > 0 ? highlights : undefined,
    stats: stats.length > 0 ? stats : undefined,
    cta: ctaData,
  };
};

export function DynamicAboutSection() {
  const [aboutSection, setAboutSection] = useState<AboutSectionData>(FALLBACK_ABOUT);

  const fetchContent = useCallback(async () => {
    try {
      const aboutContent = await contentService.getContentBySection("home", "about");
      if (aboutContent?.about_section) {
        const transformed = transformAboutData(aboutContent.about_section);
        setAboutSection(() => ({ ...FALLBACK_ABOUT, ...transformed }));
      }
    } catch (error) {
      console.error("Error loading about content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    const unsubscribe = contentService.onCacheInvalidated(() => { fetchContent(); });
    return () => { unsubscribe(); };
  }, [fetchContent]);

  const displayContent = useMemo(() => aboutSection, [aboutSection]);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Premium Light Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-blue-50 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-50 blur-[120px] rounded-full"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="relative">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }}>
              {displayContent.tagline && (
                <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{displayContent.tagline}</span>
                </div>
              )}

              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                {displayContent.title || "Your Trusted Financial Partner Since 2012"}
              </h2>

              <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium max-w-xl">
                {displayContent.description || "We are committed to providing exceptional financial services."}
              </p>

              {/* Highlights - Premium Light Theme */}
              {displayContent.highlights && (
                <div className="grid gap-6 mb-12">
                  {displayContent.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-lg text-slate-700 font-bold tracking-tight">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              {displayContent.cta && (
                <Link href={displayContent.cta?.link || "/about"}>
                  <button className="group relative h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-all duration-300 overflow-hidden shadow-xl">
                    <span className="relative z-10 flex items-center gap-2">
                      {displayContent.cta?.text || "Learn More"}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Right Stats Grid */}
          <div className="relative">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 text-[10vw] font-black text-slate-100 select-none pointer-events-none opacity-50"
            >
              2500+
            </motion.div>

            <div className="grid grid-cols-2 gap-6 relative">
              {displayContent.stats?.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.15 }}
                  className={`${index % 2 === 1 ? "mt-12" : ""} p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:border-blue-200 transition-all duration-500 group relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Layers className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <AnimatedStat value={stat.value} label={stat.label} icon={stat.icon} index={index} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent rotate-[35deg]" />
          </div>
        </div>
      </div>
    </section>
  );
}
