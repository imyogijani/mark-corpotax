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
      fetchLayout(); // Fetch global if no division
    }
  }, [fetchLayout]);

  const handleChoice = (choice: "finance" | "taxation") => {
    localStorage.setItem("user_division", choice);
    setShowTransition(true);
    setDivision(choice);
    fetchLayout(choice);
  };

  if (!isMounted) return null;

  if (!division) {
    return <LandingChoice onChoice={handleChoice} />;
  }

  return (
    <div className="home-page relative">
      {showTransition && (
        <CurtainTransition onComplete={() => setShowTransition(false)} />
      )}

      {isLoadingLayout ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-24 h-24 mb-6"
          >
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-125 animate-pulse" />
            <div className="flex items-center justify-center w-full h-full">
              <Logo className="w-16 h-16 object-contain brightness-0 invert opacity-50" />
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      ) : (
        <ComponentRenderer components={layoutComponents} />
      )}

      {/* Reset Choice Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <ChangeDivisionButton />
      </div>
    </div>
  );
}
