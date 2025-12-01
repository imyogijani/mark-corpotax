"use client";

import { useState, useEffect, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase, CheckCircle, Users } from "lucide-react";

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
  data: Record<string, unknown>
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

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const processContent = await contentService.getContentBySection(
          "home",
          "process"
        );
        if (mounted && processContent?.process_section) {
          const transformed = transformProcessData(processContent);
          setProcessSection(() => ({ ...FALLBACK_PROCESS, ...transformed }));
        }
      } catch (error) {
        console.error("Error loading features content:", error);
      }
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  const getIcon = (iconName: string, index: number) => {
    const iconMap: { [key: string]: JSX.Element } = {
      FileText: <FileText className="h-8 w-8" style={{ color: "#0d9488" }} />,
      Briefcase: <Briefcase className="h-8 w-8" style={{ color: "#0d9488" }} />,
      CheckCircle: (
        <CheckCircle className="h-8 w-8" style={{ color: "#0d9488" }} />
      ),
      Users: <Users className="h-8 w-8" style={{ color: "#0d9488" }} />,
    };
    const defaultIcons = [
      <FileText key="ft" className="h-8 w-8" style={{ color: "#0d9488" }} />,
      <Briefcase key="bf" className="h-8 w-8" style={{ color: "#0d9488" }} />,
      <CheckCircle key="cc" className="h-8 w-8" style={{ color: "#0d9488" }} />,
      <Users key="us" className="h-8 w-8" style={{ color: "#0d9488" }} />,
    ];
    return iconMap[iconName] || defaultIcons[index % defaultIcons.length];
  };

  // Memoize features
  const features = useMemo(
    () => processSection?.process_steps || [],
    [processSection]
  );

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#0d9488" }}
          >
            {processSection?.title || "Why Choose MARK GROUP?"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {processSection?.tagline ||
              "We provide comprehensive financial solutions tailored to your unique needs"}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#0d948820" }}
              >
                {getIcon(feature.icon || "", index)}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
