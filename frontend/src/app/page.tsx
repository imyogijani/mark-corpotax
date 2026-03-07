"use client";

import { useState, useEffect, useCallback } from "react";
import LandingChoice from "@/components/LandingChoice";
import { ComponentRenderer } from "@/components/ComponentRenderer";
import CurtainTransition from "@/components/CurtainTransition";
import { apiClient } from "@/lib/api-client";

// Default fallback components if layout fetch fails
const FALLBACK_COMPONENTS = [
  { id: "hero-1", type: "HomeHero", props: {} },
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ComponentRenderer components={layoutComponents} />
      )}

      {/* Reset Choice Button (Floating for Dev/Testing) */}
      <button
        onClick={() => {
          localStorage.removeItem("user_division");
          setDivision(null);
          setShowTransition(false);
        }}
        className="fixed bottom-4 right-4 z-50 p-2 bg-slate-800 text-white text-xs rounded-full opacity-50 hover:opacity-100 transition-opacity"
      >
        Reset Choice
      </button>
    </div>
  );
}
