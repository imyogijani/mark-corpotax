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
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[9rem] opacity-5 font-black text-slate-900 whitespace-nowrap select-none pointer-events-none tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.05, scale: 1 }}
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
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Latest Updates
              </span>
              <span className="w-8 h-[2px] bg-blue-600"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {blogSection?.title || "Financial Insights"}
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl h-full flex flex-col bg-white">
                <div className="h-56 relative overflow-hidden bg-blue-50/50 flex items-center justify-center">
                  <div className="transform transition-transform duration-700 group-hover:scale-110 opacity-60">
                    {getIcon(index)}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                    {post?.category}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                    {post?.title}
                  </h3>
                  <div className="mt-auto pt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-slate-500 group-hover:text-blue-600 transition-colors font-semibold"
                      asChild
                    >
                      <Link href="/blog" className="flex items-center gap-2">
                        Read Article{" "}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20"
            style={{ backgroundColor: "#0b4c80" }}
          >
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
