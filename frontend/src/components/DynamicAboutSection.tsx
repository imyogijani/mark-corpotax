"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
} from "lucide-react";

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
  startOnView: boolean = true
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
        startValue + (endValue - startValue) * easeOutExpo
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
      { threshold: 0.3 }
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
    const iconMap: { [key: string]: JSX.Element } = {
      Award: <Award className="w-8 h-8" style={{ color: "#0d9488" }} />,
      Users: <Users className="w-8 h-8" style={{ color: "#0d9488" }} />,
      TrendingUp: (
        <TrendingUp className="w-8 h-8" style={{ color: "#0d9488" }} />
      ),
      Shield: <Shield className="w-8 h-8" style={{ color: "#0d9488" }} />,
    };
    const defaultIcons = [
      <Award key="award" className="w-8 h-8" style={{ color: "#0d9488" }} />,
      <Users key="users" className="w-8 h-8" style={{ color: "#0d9488" }} />,
      <TrendingUp
        key="trending"
        className="w-8 h-8"
        style={{ color: "#0d9488" }}
      />,
      <Shield key="shield" className="w-8 h-8" style={{ color: "#0d9488" }} />,
    ];
    return iconName && iconMap[iconName]
      ? iconMap[iconName]
      : defaultIcons[(idx || 0) % defaultIcons.length];
  };

  return (
    <div
      ref={elementRef}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: "#0d948815" }}
      >
        {getStatIcon(icon, index)}
      </div>
      <div
        className="text-3xl md:text-4xl font-bold mb-2 tabular-nums"
        style={{ color: "#0d9488" }}
      >
        {prefix}
        {formatNumber(count, hasDecimal)}
        {suffix}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </div>
  );
}

// Helper to transform flat highlight/stat keys into arrays
// This merges individual keys (highlight_1, stat_1_value) with existing arrays
const transformAboutData = (
  data: Record<string, unknown>
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
    data.stats
  )
    ? (data.stats as { value: string; label: string; icon?: string }[]).map(
        (s) => ({ ...s })
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
        "about"
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {displayContent.tagline && (
              <span
                className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full"
                style={{ backgroundColor: "#0d948815", color: "#0d9488" }}
              >
                {displayContent.tagline}
              </span>
            )}

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {displayContent.title || "About Our Company"}
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {displayContent.description ||
                "We are committed to providing exceptional financial services."}
            </p>

            {/* Highlights */}
            {displayContent.highlights &&
              displayContent.highlights.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {displayContent.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-6 h-6 flex-shrink-0 mt-0.5"
                        style={{ color: "#0d9488" }}
                      />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

            {/* CTA Button */}
            {displayContent.cta && (
              <Link href={displayContent.cta.link || "/about"}>
                <Button
                  size="lg"
                  className="group"
                  style={{ backgroundColor: "#0d9488" }}
                >
                  {displayContent.cta.text || "Learn More"}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>

          {/* Right Stats Grid */}
          <div className="order-1 lg:order-2">
            {displayContent.stats && displayContent.stats.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {displayContent.stats.map((stat, index) => (
                  <AnimatedStat
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    icon={stat.icon}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div
                className="relative rounded-2xl overflow-hidden h-80 lg:h-96"
                style={{ backgroundColor: "#0d948815" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Award
                      className="w-20 h-20 mx-auto mb-4"
                      style={{ color: "#0d9488" }}
                    />
                    <p className="text-gray-600 font-medium">
                      Excellence in Financial Services
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
