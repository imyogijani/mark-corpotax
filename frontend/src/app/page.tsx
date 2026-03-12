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
  const [layoutComponents, setLayoutComponents] = useState<any[]>([]);
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

      {isLoadingLayout ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-24 h-24 mb-6"
          >
            <div className="absolute inset-0 rounded-full border-2 border-[#0b4c80]/10 scale-125 animate-pulse" />
            <div className="flex items-center justify-center w-full h-full">
              <Logo className="w-16 h-16 object-contain" />
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0b4c80] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#0b4c80] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#0b4c80] animate-bounce" />
          </div>
          <p className="mt-6 text-xs font-medium text-slate-400 uppercase tracking-widest">
            Loading Experience
          </p>
        </div>
      ) : (
        <ComponentRenderer components={layoutComponents} />
      )}

    </div>
  );
}
