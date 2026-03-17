"use client";

import { useState, useEffect, useCallback } from "react";
import LandingChoice from "@/components/LandingChoice";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import CurtainTransition from "@/components/CurtainTransition";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo-image";

// Default fallback components if layout fetch fails
const FALLBACK_COMPONENTS = [
  { id: "hero-1", type: "HomeHero", props: {} },
  { id: "honeycomb-1", type: "Honeycomb", props: {} },
  { id: "about-1", type: "About", props: {} },
  { id: "features-1", type: "Features", props: {} },
  { id: "services-1", type: "Services", props: {} },
  { id: "testimonials-1", type: "Testimonials", props: {} },
  { id: "team-1", type: "Team", props: {} },
  { id: "blog-1", type: "Blog", props: {} },
];

export default function Home() {
  const [division, setDivision] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [layoutComponents, setLayoutComponents] = useState<any[]>(FALLBACK_COMPONENTS);
  const [isLoadingLayout, setIsLoadingLayout] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Fetch page layout from backend
  const fetchLayout = useCallback(async (selectedDivision?: string) => {
    setIsLoadingLayout(true);
    try {
      const response = await apiClient.getPageLayout(
        "home",
        selectedDivision || undefined,
      );
      if (response.success && response.data?.components) {
        let components = [...response.data.components];
        
        // Find existing Blog and Team indices
        const teamIdx = components.findIndex(c => c.type === 'Team');
        const blogIdx = components.findIndex(c => c.type === 'Blog');

        // If Team is missing, add it
        if (teamIdx === -1) {
          // If Blog exists, insert Team before it, otherwise push to end
          if (blogIdx !== -1) {
            components.splice(blogIdx, 0, { id: 'team-auto', type: 'Team', props: {} });
          } else {
            components.push({ id: 'team-auto', type: 'Team', props: {} });
          }
        } else if (blogIdx !== -1 && blogIdx < teamIdx) {
          // If Blog is above Team, move it below Team
          const [blogComp] = components.splice(blogIdx, 1);
          // Find Team index again after splice
          const newTeamIdx = components.findIndex(c => c.type === 'Team');
          components.splice(newTeamIdx + 1, 0, blogComp);
        }

        setLayoutComponents(components);
      } else {
        console.warn(
          `No dynamic layout found for 'home' (${selectedDivision}), using fallback.`,
        );
        setLayoutComponents(FALLBACK_COMPONENTS);
      }
    } catch (error) {
      console.error("Error fetching page layout:", error);
      setLayoutComponents(FALLBACK_COMPONENTS);
    } finally {
      setIsLoadingLayout(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const savedDivision = localStorage.getItem("user_division");
    if (savedDivision) {
      setDivision(savedDivision);
      fetchLayout(savedDivision);
    }
  }, [fetchLayout]);

  const handleChoice = (choice: "finance" | "taxation") => {
    localStorage.setItem("user_division", choice);
    window.dispatchEvent(new Event("division-change"));
    setShowTransition(true);
    setDivision(choice);
    fetchLayout(choice);
  };

  if (!isMounted) return null;

  return (
    <div className="home-page relative">
      {showTransition && (
        <CurtainTransition onComplete={() => setShowTransition(false)} />
      )}
      {!division ? (
        <LandingChoice onChoice={handleChoice} />
      ) : (
        <ComponentRenderer components={layoutComponents} />
      )}
    </div>
  );
}
