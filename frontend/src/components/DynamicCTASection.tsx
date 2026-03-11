"use client";

import { useState, useEffect, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo-image";
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
  description: "www.markcorpotax.com",
  buttonText: "Subscribe",
  logoText: "Mark Corpotax",
};

export function DynamicCTASection() {
  const [ctaSection, setCtaSection] = useState<CTASectionData>(FALLBACK_CTA);

  const fetchContent = useCallback(async () => {
    try {
      const ctaContent = await contentService.getContentBySection(
        "home",
        "cta",
      );
      if (ctaContent?.cta_section) {
        setCtaSection(() => ({ ...FALLBACK_CTA, ...ctaContent.cta_section }));
      }
    } catch (error) {
      console.error("Error loading CTA content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchContent]);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 text-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-4 mb-8 group"
        >
          <Logo width={48} height={48} className="transition-transform group-hover:scale-110" />
          <div className="text-left">
            <span className="text-2xl font-black text-slate-900 tracking-tight block leading-tight uppercase">
              {ctaSection?.logoText || "Mark Corpotax"}
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              Premium Excellence
            </span>
          </div>
        </Link>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
          {ctaSection?.title || "A financial partner you can trust"}
        </h2>
        <p className="mb-12 text-lg font-bold text-slate-400 uppercase tracking-widest max-w-2xl mx-auto">
          {ctaSection?.description ||
            ctaSection?.websiteUrl ||
            "www.markcorpotax.com"}
        </p>

        <form className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all">
          <Input
            type="email"
            placeholder="Enter your email for updates"
            className="flex-grow bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 pl-6 text-sm font-bold uppercase tracking-wider"
          />
          <Button
            type="submit"
            className="rounded-2xl h-14 bg-blue-600 hover:bg-slate-900 text-white px-10 font-black uppercase tracking-widest text-[11px] transition-all shadow-lg active:scale-95"
          >
            {ctaSection?.buttonText || "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
