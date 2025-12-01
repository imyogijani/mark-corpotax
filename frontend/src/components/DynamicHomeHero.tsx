"use client";

import { useState, useEffect, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, Phone } from "lucide-react";

interface HeroMainData {
  tagline?: string;
  title?: string;
  description?: string;
  cta_primary?: {
    text?: string;
    link?: string;
  };
  phone?: {
    number?: string;
    help_text?: string;
  };
  hero_images?: {
    image_1?: string;
    image_2?: string;
  };
  experience_badge?: {
    years?: string;
    text?: string;
  };
}

// Static fallback content - renders immediately without loading
const FALLBACK_HERO: HeroMainData = {
  tagline: "MARK GROUP",
  title: "Shaping Financial Success in the AI Era",
  description:
    "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012 with expert guidance and transparent communication.",
  cta_primary: { text: "Get Started", link: "/appointment" },
  phone: { number: "+91 97120 67891", help_text: "Need help?" },
  experience_badge: { years: "12", text: "Years Of experience" },
};

export function DynamicHeroSection() {
  const [content, setContent] = useState<HeroMainData>(FALLBACK_HERO);

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const heroContent = await contentService.getContentBySection(
          "home",
          "hero_main"
        );
        if (mounted && heroContent && Object.keys(heroContent).length > 0) {
          setContent(() => ({ ...FALLBACK_HERO, ...heroContent }));
        }
      } catch (error) {
        console.error("Error loading hero content:", error);
      }
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  // Memoize the hero content to prevent unnecessary re-renders
  const heroMain = useMemo(() => content, [content]);

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/30 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #0d948810)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-4 h-4 rounded-full opacity-60"
          style={{ backgroundColor: "#0d9488" }}
        ></div>
        <div
          className="absolute top-32 left-20 w-2 h-2 rounded-full opacity-40"
          style={{ backgroundColor: "#0d9488" }}
        ></div>
        <div
          className="absolute top-40 left-32 w-3 h-3 rounded-full opacity-50"
          style={{ backgroundColor: "#0d9488" }}
        ></div>
        <div
          className="absolute bottom-40 left-16 w-5 h-5 rounded-full opacity-30"
          style={{ backgroundColor: "#0d9488" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full opacity-70"
          style={{ backgroundColor: "#0d9488" }}
        ></div>

        {/* Decorative grid pattern */}
        <div className="absolute bottom-32 right-32 grid grid-cols-6 gap-1 opacity-20">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-400 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
              <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">
                {heroMain?.tagline || "MARK GROUP"}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-slate-800">
                  {heroMain?.title || "Shaping Financial Success in the AI Era"}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
              {heroMain?.description ||
                "Comprehensive financial and legal solutions for MSME financing, working capital, and taxation services. Trusted by 2500+ clients since 2012 with expert guidance and transparent communication."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-white rounded-full font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0d9488" }}
              >
                <Link
                  href={heroMain?.cta_primary?.link || "/appointment"}
                  className="inline-flex items-center gap-2"
                >
                  {heroMain?.cta_primary?.text || "Get Started"}
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>

              {/* Contact Info */}
              <div className="flex items-center gap-3 px-2">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{ backgroundColor: "#0d948820" }}
                >
                  <Phone className="w-5 h-5" style={{ color: "#0d9488" }} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">
                    {heroMain?.phone?.help_text || "Need help?"}
                  </div>
                  <div className="font-semibold text-slate-800">
                    {heroMain?.phone?.number || "+91 97120 67891"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className="relative lg:pl-8">
            {/* Main image container */}
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl opacity-80"></div>

              {/* Decorative stars */}
              <div
                className="absolute -top-8 right-12"
                style={{ color: "#0d9488" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div
                className="absolute -top-4 right-24"
                style={{ color: "#0d9488", opacity: 0.8 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div
                className="absolute top-4 -right-4"
                style={{ color: "#0d9488", opacity: 0.6 }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              {/* Main content area with actual image */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* Financial professional image */}
                <div className="h-80 md:h-96 relative">
                  <Image
                    src={
                      heroMain?.hero_images?.image_1 ||
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
                    }
                    alt="Professional financial advisor team discussing investment strategies"
                    fill
                    className="object-cover rounded-3xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
              </div>

              {/* Experience badge with proper design */}
              <div className="absolute bottom-6 left-6">
                <div className="relative w-28 h-28">
                  {/* Main circular badge */}
                  <div
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border-4 border-white"
                    style={{ backgroundColor: "#1e293b" }}
                  >
                    {/* Static dashed circle around the edge */}
                    <div className="absolute inset-1">
                      <svg className="w-full h-full" viewBox="0 0 104 104">
                        <circle
                          cx="52"
                          cy="52"
                          r="50"
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="3"
                          strokeDasharray="10 4"
                          opacity="0.9"
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        {heroMain?.experience_badge?.years || "12"}
                      </div>
                      <div className="text-xs text-white/90 font-medium leading-tight">
                        {heroMain?.experience_badge?.text ||
                          "Years Of experience"}
                      </div>
                    </div>
                  </div>

                  {/* Subtle outer glow */}
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-md -z-10"
                    style={{ backgroundColor: "#0d9488" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
