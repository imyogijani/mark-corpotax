"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";
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
  Briefcase,
  Layers,
} from "lucide-react";
import { MotionWrapper } from "@/components/MotionWrapper";

interface AboutSectionData {
  tagline?: string;
  title?: string;
  description?: string;
  highlights?: string[];
  stats?: {
    label: string;
    value: string;
    icon?: string;
  }[];
  cta?: {
    text: string;
    link: string;
  };
}

// Static fallback content - renders immediately
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

// Custom hook for counting animation
function useCountAnimation(
  endValue: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation (easeOutExpo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeOutExpo,
      );

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration, hasStarted]);

  useEffect(() => {
    if (!startOnView) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            startAnimation();
          }
        });
      },
      { threshold: 0.3 },
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [startOnView, startAnimation, hasStarted]);

  return { count, elementRef };
}

// Parse stat value to extract number and suffix
function parseStatValue(value: string): {
  number: number;
  prefix: string;
  suffix: string;
} {
  const match = value.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/);
  if (match) {
    const prefix = match[1] || "";
    const numStr = match[2].replace(/,/g, "");
    const suffix = match[3] || "";
    return {
      number: parseFloat(numStr) || 0,
      prefix,
      suffix,
    };
  }
  return { number: 0, prefix: "", suffix: value };
}

// Format number with commas
function formatNumber(num: number, hasDecimal: boolean = false): string {
  if (hasDecimal) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return num.toLocaleString("en-US");
}

// Animated Stat Component
function AnimatedStat({
  value,
  label,
  icon,
  index,
}: {
  value: string;
  label: string;
  icon?: string;
  index: number;
}) {
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

    const iconElement =
      iconName && iconMap[iconName]
        ? iconMap[iconName]
        : defaultIcons[(idx || 0) % defaultIcons.length];

    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ type: "spring", stiffness: 200, delay: (idx || 0) * 0.1 }}
        variants={{
          hover: {
            rotate: [0, -10, 10, -5, 5, 0],
            scale: 1.1,
            transition: { duration: 0.5 },
          },
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
      viewport={{ once: false, amount: 0.3 }} // Re-triggers animation on scroll up/down
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      className="relative bg-white rounded-2xl p-7 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 group h-full flex flex-col justify-between overflow-hidden transition-colors duration-300 hover:border-blue-100/50"
    >
      {/* 
         Minimal Glass/Glow Effect 
         - A subtle gradient that fades in from the corner
      */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent pointer-events-none"
      />

      {/* Clean Bottom Accent Line */}
      <motion.div
        variants={{ hover: { scaleX: 1, opacity: 1 } }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0b4c80] origin-left"
      />

      {/* Floating Icon Container */}
      <motion.div
        variants={{
          hover: {
            y: -4,
            backgroundColor: "#0b4c80",
            color: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(11, 76, 128, 0.25)",
          },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-[#0b4c80] bg-slate-50 relative z-10"
      >
        <div className="[&>svg]:w-7 [&>svg]:h-7">
          {getStatIcon(icon, index)}
        </div>
      </motion.div>

      <div className="relative z-10">
        <motion.div
          variants={{ hover: { y: -2 } }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold mb-2 tabular-nums tracking-tight text-slate-800"
        >
          {prefix}
          {formatNumber(count, hasDecimal)}
          {suffix}
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="h-[1px] w-4 bg-slate-200 group-hover:w-8 group-hover:bg-[#0b4c80] transition-all duration-300 mb-[2px]"></div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest group-hover:text-[#0b4c80] transition-colors duration-300">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper to transform flat highlight/stat keys into arrays
// This merges individual keys (highlight_1, stat_1_value) with existing arrays
const transformAboutData = (
  data: Record<string, unknown>,
): AboutSectionData => {
  if (!data) return {};

  // Start with existing highlights array or empty
  let highlights: string[] = Array.isArray(data.highlights)
    ? [...(data.highlights as string[])]
    : [];

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
  let stats: { value: string; label: string; icon?: string }[] = Array.isArray(
    data.stats,
  )
    ? (data.stats as { value: string; label: string; icon?: string }[]).map(
        (s) => ({ ...s }),
      )
    : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 6; i++) {
    const valueKey = `stat_${i}_value`;
    const labelKey = `stat_${i}_label`;
    const iconKey = `stat_${i}_icon`;

    // If either value or label exists for this index, update that stat
    if (data[valueKey] !== undefined || data[labelKey] !== undefined) {
      // Ensure the array has enough elements
      while (stats.length < i) {
        stats.push({ value: "", label: "" });
      }
      // Update the stat at position i-1
      if (data[valueKey] !== undefined && data[valueKey] !== "") {
        stats[i - 1].value = data[valueKey] as string;
      }
      if (data[labelKey] !== undefined && data[labelKey] !== "") {
        stats[i - 1].label = data[labelKey] as string;
      }
      if (data[iconKey] !== undefined) {
        stats[i - 1].icon = data[iconKey] as string;
      }
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
    if (text && link) {
      ctaData = { text, link };
    }
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
  const [aboutSection, setAboutSection] =
    useState<AboutSectionData>(FALLBACK_ABOUT);

  const fetchContent = useCallback(async () => {
    try {
      const aboutContent = await contentService.getContentBySection(
        "home",
        "about",
      );
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

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchContent]);

  // Memoize content
  const displayContent = useMemo(() => aboutSection, [aboutSection]);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-32 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Section Header with Watermark */}
        <div className="relative mb-20 md:mb-28 text-center max-w-5xl mx-auto">
          {/* Animated Watermark Text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] md:text-[10rem] lg:text-[12rem] font-bold text-slate-100/60 whitespace-nowrap select-none pointer-events-none z-0 tracking-tighter"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            EXCELLENCE
          </motion.div>

          <div className="relative z-10">
            {displayContent.tagline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                className="inline-flex items-center justify-center gap-3 mb-6"
              >
                <span className="w-8 h-[2px] bg-blue-600"></span>
                <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  {displayContent.tagline}
                </span>
                <span className="w-8 h-[2px] bg-blue-600"></span>
              </motion.div>
            )}

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {displayContent.title ||
                "Your Trusted Financial Partner Since 2012"}
            </motion.h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Content */}
          <MotionWrapper
            className="order-2 lg:order-1 relative pt-8"
            direction="right"
            delay={0.1}
          >
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              {displayContent.description ||
                "We are committed to providing exceptional financial services."}
            </p>

            {/* Highlights */}
            {displayContent.highlights &&
              displayContent.highlights.length > 0 && (
                <div className="space-y-5 mb-10">
                  {displayContent.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="mt-1 bg-blue-50 p-1 rounded-full text-blue-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-slate-700 font-medium text-lg border-b border-transparent hover:border-blue-100 transition-colors">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

            {/* CTA Button */}
            {displayContent.cta && (
              <Link href={displayContent.cta.link || "/about"}>
                <Button
                  size="lg"
                  className="group px-8 h-14 rounded-full text-base font-semibold shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20"
                  style={{ backgroundColor: "#0b4c80" }}
                >
                  {displayContent.cta.text || "Learn More"}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </MotionWrapper>

          {/* Right Stats Grid */}
          <MotionWrapper
            className="order-1 lg:order-2"
            direction="left"
            delay={0.2}
          >
            {displayContent.stats && displayContent.stats.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 relative">
                {/* 
                    Connecting Lines Illustration 
                    We use an SVG overlay to draw dashed lines connecting the 'steps' or cards.
                    Percentages are approximate centers based on the staggered grid layout.
                 */}
                <svg
                  className="absolute inset-0 w-full h-full -z-10 pointer-events-none hidden md:block"
                  style={{ overflow: "visible" }}
                >
                  {/* Define Gradient for the active line look */}
                  <defs>
                    <linearGradient
                      id="connectGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.2" />
                      <stop
                        offset="50%"
                        stopColor="#3b82f6"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="100%"
                        stopColor="#e2e8f0"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>

                  {/* 
                       Path connecting: 
                       Top-Left (25% 25%) -> Top-Right (75% 35%) -> Bottom-Right (75% 85%) -> Bottom-Left (25% 75%) -> Close 
                       Adjusted Y values account for the lg:translate-y-12 stagger
                    */}
                  <motion.path
                    d="M 25% 20% L 75% 30% L 75% 80% L 25% 70% Z"
                    fill="none"
                    stroke="url(#connectGradient)"
                    strokeWidth="3"
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />

                  {/* Diagonal Cross Connectors for 'weaved' look */}
                  <motion.path
                    d="M 25% 20% L 75% 80%"
                    fill="none"
                    stroke="#slate-200"
                    strokeWidth="1"
                    className="text-slate-200"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </svg>

                {/* Decorative background for the grid */}
                <div className="absolute -inset-4 bg-slate-50 rounded-[2rem] -z-10 rotate-3 scale-95 opacity-50"></div>

                {displayContent.stats.map((stat, index) => (
                  <div
                    key={index}
                    className={index % 2 === 1 ? "lg:translate-y-12" : ""}
                  >
                    <AnimatedStat
                      value={stat.value}
                      label={stat.label}
                      icon={stat.icon}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="relative rounded-3xl overflow-hidden h-96 lg:h-[500px] shadow-2xl"
                style={{ backgroundColor: "#0b4c80" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Award className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Excellence in Finance
                  </h3>
                  <p className="text-white/80">
                    Providing top-tier solutions for over a decade.
                  </p>
                </div>
                {/* Abstract patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              </div>
            )}
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
