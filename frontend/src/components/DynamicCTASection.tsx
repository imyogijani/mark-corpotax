"use client";

import { useState, useEffect } from "react";
import { contentService } from "@/lib/content-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import Link from "next/link";

interface CTASectionData {
  title?: string;
  description?: string;
  buttonText?: string;
  logoText?: string;
  websiteUrl?: string;
}

// Static fallback content
const FALLBACK_CTA: CTASectionData = {
  title: "A financial partner you can trust",
  description: "www.markgroup.in",
  buttonText: "Subscribe",
  logoText: "MARK GROUP",
};

export function DynamicCTASection() {
  const [ctaSection, setCtaSection] = useState<CTASectionData>(FALLBACK_CTA);

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const ctaContent = await contentService.getContentBySection(
          "home",
          "cta"
        );
        if (mounted && ctaContent?.cta_section) {
          setCtaSection(() => ({ ...FALLBACK_CTA, ...ctaContent.cta_section }));
        }
      } catch (error) {
        console.error("Error loading CTA content:", error);
      }
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="subscribe-cta-section py-16 md:py-20"
      style={{ backgroundColor: "#fbfbfc" }}
    >
      <div className="container mx-auto px-4 text-center text-gray-900">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Logo className="h-10 w-10 text-teal-600" />
          <span className="text-2xl font-bold">
            {ctaSection?.logoText || "MARK GROUP"}
          </span>
        </Link>
        <h2 className="text-3xl md:text-4xl font-bold">
          {ctaSection?.title || "A financial partner you can trust"}
        </h2>
        <p className="mt-2 text-lg opacity-70">
          {ctaSection?.description ||
            ctaSection?.websiteUrl ||
            "www.markgroup.in"}
        </p>

        <form className="mt-8 max-w-lg mx-auto flex items-center gap-4 p-2 bg-white border border-gray-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 transition-shadow">
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          />
          <Button
            type="submit"
            size="lg"
            className="rounded-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 font-medium transition-colors"
          >
            {ctaSection?.buttonText || "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
