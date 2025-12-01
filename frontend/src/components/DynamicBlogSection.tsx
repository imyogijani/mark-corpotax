"use client";

import { useState, useEffect, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart2, PieChart, TrendingUp, ArrowRight } from "lucide-react";

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

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const blogContent = await contentService.getContentBySection(
          "home",
          "blog"
        );
        if (mounted && blogContent?.blog_section) {
          setBlogSection(() => ({
            ...FALLBACK_BLOG,
            ...blogContent.blog_section,
          }));
        }
      } catch (error) {
        console.error("Error loading blog content:", error);
      }
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  const getIcon = (index: number) => {
    const icons = [
      <BarChart2
        key="bar"
        className="w-full h-32"
        style={{ color: "#0d9488", opacity: 0.6 }}
      />,
      <PieChart
        key="pie"
        className="w-full h-32"
        style={{ color: "#0d9488", opacity: 0.6 }}
      />,
      <TrendingUp
        key="trend"
        className="w-full h-32"
        style={{ color: "#0d9488", opacity: 0.6 }}
      />,
    ];
    return icons[index % icons.length];
  };

  // Memoize blog posts
  const blogPosts = useMemo(() => blogSection?.blog_posts || [], [blogSection]);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {blogSection?.title || "Latest Insights"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {blogSection?.tagline ||
              "Stay updated with our latest thoughts and industry insights"}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 flex items-center justify-center bg-secondary/20">
                {getIcon(index)}
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-primary font-medium mb-2">
                  {post?.category}
                </div>
                <h3 className="text-xl font-semibold mb-4">{post?.title}</h3>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 font-medium transition-colors"
                  asChild
                >
                  <Link href="/blog">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-3 h-12 font-medium transition-colors"
          >
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
