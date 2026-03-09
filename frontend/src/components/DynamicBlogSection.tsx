"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart2, PieChart, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  category: string;
  title: string;
}

interface BlogSectionData {
  tagline?: string;
  title?: string;
  blog_posts?: BlogPost[];
}

// Static fallback content
const FALLBACK_BLOG: BlogSectionData = {
  tagline: "Latest Articles",
  title: "Financial Insights & Updates",
  blog_posts: [
    { category: "Finance", title: "Understanding MSME Loan Benefits" },
    { category: "Taxation", title: "GST Filing Made Simple" },
    { category: "Investment", title: "Growing Your Business Capital" },
  ],
};

export function DynamicBlogSection() {
  const [blogSection, setBlogSection] =
    useState<BlogSectionData>(FALLBACK_BLOG);

  const fetchContent = useCallback(async () => {
    try {
      const blogContent = await contentService.getContentBySection(
        "home",
        "blog",
      );
      if (blogContent?.blog_section) {
        setBlogSection(() => ({
          ...FALLBACK_BLOG,
          ...blogContent.blog_section,
        }));
      }
    } catch (error) {
      console.error("Error loading blog content:", error);
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

  const getIcon = (index: number) => {
    const icons = [
      <motion.div
        key="bar"
        whileHover={{ scale: 1.05, translateY: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <BarChart2
          className="w-full h-32"
          style={{ color: "#0b4c80", opacity: 0.6 }}
        />
      </motion.div>,
      <motion.div
        key="pie"
        whileHover={{ rotate: 90, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <PieChart
          className="w-full h-32"
          style={{ color: "#0b4c80", opacity: 0.6 }}
        />
      </motion.div>,
      <motion.div
        key="trend"
        whileHover={{ scale: 1.1, translateX: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <TrendingUp
          className="w-full h-32"
          style={{ color: "#0b4c80", opacity: 0.6 }}
        />
      </motion.div>,
    ];
    return icons[index % icons.length];
  };

  // Memoize blog posts
  const blogPosts = useMemo(() => blogSection?.blog_posts || [], [blogSection]);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background flair - Light Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/50 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark - Light Theme */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black text-slate-200 opacity-[0.08] select-none pointer-events-none tracking-tighter uppercase"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.15, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            INSIGHTS
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                Knowledge Hub
              </span>
              <span className="w-8 h-[2px] bg-blue-600"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-black mb-8 text-slate-900 tracking-tighter uppercase"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {blogSection?.title || "Financial Insights"}
            </motion.h2>

            <motion.p
              className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              {blogSection?.tagline ||
                "Stay updated with our latest thoughts and industry trends"}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut"
              }}
            >
              <Card className="group relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] h-full flex flex-col transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_45px_100px_rgba(37,99,235,0.1)] hover:border-blue-100 hover:-translate-y-4">
                <div className="h-64 relative overflow-hidden bg-slate-50 flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-6">
                    {getIcon(index)}
                  </div>
                </div>

                <CardContent className="p-10 flex-1 flex flex-col">
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                    {post?.category}
                  </div>
                  <h3 className="text-2xl font-black mb-6 text-slate-800 leading-tight group-hover:text-blue-600 transition-colors tracking-tight uppercase">
                    {post?.title}
                  </h3>
                  <div className="mt-auto">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-all duration-300">
                      Read Details
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href="/blog">
            <button className="h-16 px-12 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-blue-600 transition-all duration-300 shadow-xl group active:scale-95 uppercase tracking-widest">
              <span className="flex items-center gap-3">
                Explore All Articles
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
