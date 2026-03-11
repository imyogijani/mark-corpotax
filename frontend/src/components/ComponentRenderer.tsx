"use client";

import React from "react";
import { motion } from "framer-motion";
import { DynamicHeroSection } from "./DynamicHomeHero";
import { DynamicAboutSection } from "./DynamicAboutSection";
import { DynamicFeaturesSection } from "./DynamicFeaturesSection";
import { DynamicServicesSection } from "./DynamicServicesSection";
import { DynamicTestimonialsSection } from "./DynamicTestimonialsSection";
import { DynamicTeamSection } from "./DynamicTeamSection";
import { DynamicBlogSection } from "./DynamicBlogSection";
import HoneycombSection from "./HoneycombSection";

// Component Registry
const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
  HomeHero: DynamicHeroSection,
  About: DynamicAboutSection,
  Features: DynamicFeaturesSection,
  Services: DynamicServicesSection,
  Testimonials: DynamicTestimonialsSection,
  Team: DynamicTeamSection,
  Blog: DynamicBlogSection,
  Honeycomb: HoneycombSection,
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
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Component {...(comp.props || {})} />
          </motion.div>
        );
      })}
    </div>
  );
}
