"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { MotionWrapper } from "@/components/MotionWrapper";

interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessSectionData {
  tagline?: string;
  title?: string;
  process_steps?: ProcessStep[];
}

// Static fallback content
const FALLBACK_PROCESS: ProcessSectionData = {
  tagline:
    "We provide comprehensive financial solutions tailored to your unique needs",
  title: "Why Choose MARK GROUP?",
  process_steps: [
    {
      title: "Consultation",
      description: "Initial meeting to understand your needs",
      icon: "FileText",
    },
    {
      title: "Analysis",
      description: "Detailed review of your financial situation",
      icon: "Briefcase",
    },
    {
      title: "Strategy",
      description: "Custom solution tailored for you",
      icon: "CheckCircle",
    },
    {
      title: "Execution",
      description: "Seamless implementation and support",
      icon: "Users",
    },
  ],
};

// Transform flat keys from database into the expected structure
// This merges individual keys (step_1_title) with existing arrays
function transformProcessData(
  data: Record<string, unknown>,
): ProcessSectionData {
  const processSection = (data.process_section || {}) as Record<
    string,
    unknown
  >;

  // Start with existing process_steps array or empty
  let steps: ProcessStep[] = Array.isArray(processSection.process_steps)
    ? processSection.process_steps.map((s: ProcessStep) => ({ ...s }))
    : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 10; i++) {
    const title = processSection[`step_${i}_title`] as string;
    const description = processSection[`step_${i}_description`] as string;
    const icon = processSection[`step_${i}_icon`] as string;

    if (title !== undefined || description !== undefined) {
      // Ensure the array has enough elements
      while (steps.length < i) {
        steps.push({ title: "", description: "" });
      }
      // Update the step at position i-1
      if (title !== undefined && title !== "") {
        steps[i - 1].title = title;
      }
      if (description !== undefined && description !== "") {
        steps[i - 1].description = description;
      }
      if (icon !== undefined) {
        steps[i - 1].icon = icon;
      }
    }
  }

  // Remove any steps with empty title and description
  steps = steps.filter((s) => s.title || s.description);

  return {
    tagline: (processSection.tagline as string) || undefined,
    title: (processSection.title as string) || undefined,
    process_steps: steps.length > 0 ? steps : undefined,
  };
}

export function DynamicFeaturesSection() {
  const [processSection, setProcessSection] =
    useState<ProcessSectionData>(FALLBACK_PROCESS);
  const [division, setDivision] = useState<string>("finance");

  const fetchContent = useCallback(async () => {
    try {
      const savedDivision = localStorage.getItem("user_division");
      if (savedDivision) setDivision(savedDivision);

      const processContent = await contentService.getContentBySection(
        "home",
        "process",
      );
      if (processContent?.process_section) {
        const transformed = transformProcessData(processContent);
        setProcessSection(() => ({ ...FALLBACK_PROCESS, ...transformed }));
      }
    } catch (error) {
      console.error("Error loading features content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    window.addEventListener("storage", fetchContent);
    window.addEventListener("division-change", fetchContent);

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      window.removeEventListener("storage", fetchContent);
      window.removeEventListener("division-change", fetchContent);
      unsubscribe();
    };
  }, [fetchContent]);

  const getIcon = (iconName: string, index: number) => {
    const iconMap: { [key: string]: JSX.Element } = {
      FileText: <FileText />,
      Briefcase: <Briefcase />,
      CheckCircle: <CheckCircle />,
      Users: <Users />,
    };
    const defaultIcons = [
      <FileText key="ft" />,
      <Briefcase key="bf" />,
      <CheckCircle key="cc" />,
      <Users key="us" />,
    ];

    const iconElement =
      iconMap[iconName] || defaultIcons[index % defaultIcons.length];

    return (
      <motion.div
        initial={{ scale: 0.8, rotate: -20, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, type: "spring" }}
        whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.2 } }}
      >
        {iconElement}
      </motion.div>
    );
  };

  // Memoize features
  const features = useMemo(
    () => processSection?.process_steps || [],
    [processSection],
  );

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Background Elements - Light Theme */}
      <div className="absolute top-1/2 left-0 w-full h-[600px] bg-blue-50/20 -skew-y-3 -z-10 translate-y-[-50%]"></div>

      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark - Light Theme */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6rem] md:text-[10rem] opacity-5 font-black text-slate-200 whitespace-nowrap select-none pointer-events-none tracking-tighter uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            PRECISION
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className={`w-10 h-[2px] ${division === 'taxation' ? 'bg-emerald-600' : 'bg-blue-600'}`}></span>
              <span className={`text-[11px] font-black uppercase tracking-[0.5em] ${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`}>
                Our Strategy
              </span>
              <span className={`w-10 h-[2px] ${division === 'taxation' ? 'bg-emerald-600' : 'bg-blue-600'}`}></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black mb-8 text-slate-900 uppercase tracking-tighter leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {division === "taxation" ? "Expert Advisory" : (processSection?.title || "Why Choose MARK GROUP?")}
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              {division === "taxation"
                ? "Navigating complex tax laws with precision and strategic legal insight."
                : (processSection?.tagline || "We provide comprehensive financial solutions tailored to your unique needs")}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.21, 1.11, 0.81, 0.99]
              }}
            >
              <div className="relative group h-full">
                {/* Card Glow Effect - Light Theme */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-0 group-hover:opacity-10 transition duration-1000" />

                <Card className={`relative h-full text-center p-10 md:p-14 border bg-white shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-700 rounded-[3rem] overflow-hidden group-hover:-translate-y-6 ${division === 'taxation' ? 'border-slate-100 group-hover:shadow-[0_40px_80px_rgba(16,185,129,0.12)] group-hover:border-emerald-100' : 'border-slate-100 group-hover:shadow-[0_40px_80px_rgba(37,99,235,0.12)] group-hover:border-blue-100'}`}>
                  {/* Icon Container */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                    className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-inner border ${division === 'taxation' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100'}`}
                  >
                    <div className="[&>svg]:w-12 [&>svg]:h-12 transition-transform duration-500 group-hover:scale-110">
                      {getIcon(feature.icon || "", index)}
                    </div>
                  </motion.div>

                  <h3 className={`text-xl md:text-2xl font-black mb-6 text-slate-900 tracking-tight transition-colors uppercase leading-tight ${division === 'taxation' ? 'group-hover:text-emerald-600' : 'group-hover:text-blue-600'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-base opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>

                  {/* Corner Accent */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-current to-transparent opacity-5 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`} />
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
