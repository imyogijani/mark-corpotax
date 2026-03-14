"use client";

import { useState, useEffect, useCallback } from "react";
import LandingChoice from "@/components/LandingChoice";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import CurtainTransition from "@/components/CurtainTransition";
import { apiClient } from "@/lib/api-client";
import { ChangeDivisionButton } from "@/components/ChangeDivisionButton";
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
        setLayoutComponents(response.data.components);
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
    } else {
      // Default to finance if no choice is made
      setDivision("finance");
      localStorage.setItem("user_division", "finance");
      fetchLayout("finance");
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
      <ComponentRenderer components={layoutComponents} />
    </div>
  );
}
