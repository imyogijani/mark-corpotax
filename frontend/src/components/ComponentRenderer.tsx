"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Component Registry with Lazy Loading
const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
  HomeHero: dynamic(() => import("./DynamicHomeHero").then(m => m.DynamicHeroSection), { ssr: true }),
  About: dynamic(() => import("./DynamicAboutSection").then(m => m.DynamicAboutSection), { ssr: false }),
  Features: dynamic(() => import("./DynamicFeaturesSection").then(m => m.DynamicFeaturesSection), { ssr: false }),
  Services: dynamic(() => import("./DynamicServicesSection").then(m => m.DynamicServicesSection), { ssr: false }),
  Testimonials: dynamic(() => import("./DynamicTestimonialsSection").then(m => m.DynamicTestimonialsSection), { ssr: false }),
  Team: dynamic(() => import("./DynamicTeamSection").then(m => m.DynamicTeamSection), { ssr: false }),
  Blog: dynamic(() => import("./DynamicBlogSection").then(m => m.DynamicBlogSection), { ssr: false }),
  Honeycomb: dynamic(() => import("./HoneycombSection"), { ssr: false }),
  ExpertHelp: dynamic(() => import("./AskExpertSection").then(m => m.AskExpertSection), { ssr: false }),
  CTA: dynamic(() => import("./DynamicCTASection").then(m => m.DynamicCTASection), { ssr: false }),
};

interface ComponentData {
  id: string;
  type: string;
  props?: any;
}

interface ComponentRendererProps {
  components: ComponentData[];
}

export function ComponentRenderer({ components }: ComponentRendererProps) {
  if (!components || components.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400">
        No components to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {components.map((comp, index) => {
        const Component = COMPONENT_MAP[comp.type];
        if (!Component) {
          console.warn(`Component type "${comp.type}" not found in registry.`);
          return null;
        }

        return (
          <div key={comp.id}>
            <Component {...(comp.props || {})} />
          </div>
        );
      })}
    </div>
  );
}
