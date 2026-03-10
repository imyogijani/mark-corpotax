"use client";

import { useEffect, useState } from "react";
import { contentService } from "@/lib/content-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  FileText,
  BarChart2,
  PieChart,
  DollarSign,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { DynamicCTASection } from "@/components/DynamicCTASection";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import { MotionWrapper } from "@/components/MotionWrapper";
import { AskExpertSection } from "@/components/AskExpertSection";

interface BlogPost {
  id: string;
  _id?: string;
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  category: string;
  createdAt: string;
  featuredImage?: string;
}

// Icon mapping for blog posts
const categoryIcons: Record<string, React.ReactNode> = {
  Business: <BarChart2 className="w-full h-full text-blue-100 p-8" />,
  Analytics: <TrendingUp className="w-full h-full text-blue-100 p-8" />,
  Finance: <DollarSign className="w-full h-full text-blue-100 p-8" />,
  Strategy: <PieChart className="w-full h-full text-blue-100 p-8" />,
  Default: <FileText className="w-full h-full text-blue-100 p-8" />,
};

const defaultCategories = [
  { name: "Business", count: 12 },
  { name: "Finance", count: 8 },
  { name: "Tax Planning", count: 15 },
];

const defaultTags = [
  "Finance",
  "Business",
  "Tax Planning",
  "Loans",
  "Investment",
  "MSME",
];

export default function BlogPage() {
  const [heroContent, setHeroContent] = useState<Record<string, any>>({});
  const [statsContent, setStatsContent] = useState<Record<string, any>>({});
  const [sidebarContent, setSidebarContent] = useState<Record<string, any>>({});
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [tags, setTags] = useState(defaultTags);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch page content
        const data = await contentService.getPageContent("blog");

        if (data.hero) setHeroContent(data.hero);
        if (data.stats) setStatsContent(data.stats);
        if (data.sidebar) setSidebarContent(data.sidebar);

        // Transform categories from flat keys
        if (data.categories) {
          const transformedCategories = [];
          for (let i = 1; i <= 5; i++) {
            const cat = {
              name: data.categories[`category_${i}_name`],
              count: parseInt(data.categories[`category_${i}_count`]) || 0,
            };
            if (cat.name) transformedCategories.push(cat);
          }
          if (transformedCategories.length > 0)
            setCategories(transformedCategories);
        }

        // Transform tags from flat keys
        if (data.tags) {
          const transformedTags = [];
          for (let i = 1; i <= 8; i++) {
            const tag = data.tags[`tag_${i}`];
            if (tag) transformedTags.push(tag);
          }
          if (transformedTags.length > 0) setTags(transformedTags);
        }

        // Fetch actual blog posts from backend
        try {
          const API_BASE =
            typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
              ? process.env.NEXT_PUBLIC_API_URL
              : "http://localhost:5000/api";
          const response = await fetch(`${API_BASE}/blog?status=published`);
          if (response.ok) {
            const blogData = await response.json();
            // Backend returns { data: { blogs: [...], pagination: {...} } }
            const blogs = blogData.data?.blogs || blogData.data || [];
            if (Array.isArray(blogs)) {
              const mappedBlogs = blogs.map((b: any) => ({
                ...b,
                id: b.id || b._id, // Ensure id is present
              }));
              setBlogPosts(mappedBlogs.slice(0, 6)); // Show max 6 posts
            }
          }
        } catch (blogError) {
          console.error("Error fetching blog posts:", blogError);
        }
      } catch (error) {
        console.error("Error fetching blog content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Get recent posts (last 3)
  const recentPosts = blogPosts.slice(0, 3);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page-wrapper overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/30"
        style={{
          background:
            "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #eff6ff)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingGraffiti />
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center pt-20 pb-20">
          <MotionWrapper direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-blue-600 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Insights & Updates</span>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900">
              {heroContent.title || "Blog & Insights"}
            </h1>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.3}>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              {heroContent.subtitle ||
                "Stay updated with the latest insights, trends, and news in the world of finance and business."}
            </p>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.4}>
            <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center max-w-4xl mx-auto mt-12">
              <div className="flex flex-1 items-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 gap-4 border border-slate-100 hover:-translate-y-1 transition-transform cursor-default w-full">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <FileText className="text-blue-600 w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-900">
                    {statsContent.stat_1_value || "50+"}
                  </span>
                  <span className="block text-slate-500 text-sm font-medium">
                    {statsContent.stat_1_label || "Articles Published"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 gap-4 border border-slate-100 hover:-translate-y-1 transition-transform cursor-default w-full">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <TrendingUp className="text-emerald-500 w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-900">
                    {statsContent.stat_2_value || "10K+"}
                  </span>
                  <span className="block text-slate-500 text-sm font-medium">
                    {statsContent.stat_2_label || "Monthly Readers"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 gap-4 border border-slate-100 hover:-translate-y-1 transition-transform cursor-default w-full">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BarChart2 className="text-purple-500 w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-slate-900">
                    {statsContent.stat_3_value || "Weekly"}
                  </span>
                  <span className="block text-slate-500 text-sm font-medium">
                    {statsContent.stat_3_label || "Fresh Content"}
                  </span>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Blog Posts */}
            <div className="lg:col-span-2 space-y-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post, index) => (
                  <MotionWrapper
                    key={post.id || post._id || index}
                    direction="up"
                    delay={0.1 * index}
                  >
                    <Card className="blog-post-card bg-white overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-slate-100 group">
                      <div className="relative h-64 w-full bg-slate-50 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                          {categoryIcons[post.category] ||
                            categoryIcons.Default}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            {post.category || "General"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-slate-700">
                              {post.author || "Admin"}
                            </span>
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          <Link href={`/blog/${post.slug || post.id || post._id}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <Button
                          asChild
                          variant="ghost"
                          className="p-0 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent font-semibold group/btn"
                        >
                          <Link
                            href={`/blog/${post.slug || post.id || post._id}`}
                            className="flex items-center gap-2"
                          >
                            Read Article{" "}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    No Posts Yet
                  </h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    We are crafting amazing content for you. Check back soon for
                    new articles and insights.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <MotionWrapper direction="left" delay={0.2}>
                <Card className="bg-white border-slate-100 shadow-sm">
                  <CardHeader className="pb-4 border-b border-slate-50">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      {sidebarContent.categories_title || "Categories"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-4">
                    {categories.map((category, index) => (
                      <div
                        key={`${category.name}-${index}`}
                        className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
                      >
                        <span className="text-slate-600 group-hover:text-blue-600 font-medium transition-colors">
                          {category.name}
                        </span>
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </MotionWrapper>

              {/* Recent Posts */}
              <MotionWrapper direction="left" delay={0.3}>
                <Card className="bg-white border-slate-100 shadow-sm">
                  <CardHeader className="pb-4 border-b border-slate-50">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      {sidebarContent.recent_posts_title || "Recent Posts"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <div
                          key={post._id}
                          className="flex gap-4 group cursor-pointer"
                        >
                          <div className="flex-shrink-0 w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {/* Placeholder or Image */}
                            <DollarSign className="w-8 h-8 text-blue-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/blog/${post._id}`}>
                              <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                {post.title}
                              </h4>
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic text-center py-4">
                        No recent posts available.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </MotionWrapper>

              {/* Work with us CTA */}
              <MotionWrapper direction="left" delay={0.4}>
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative border-none shadow-xl shadow-blue-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-16 -mb-16"></div>

                  <CardContent className="p-8 text-center relative z-10">
                    <h3 className="text-2xl font-bold mb-3">
                      {sidebarContent.cta_title || "Work with us"}
                    </h3>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                      {sidebarContent.cta_description ||
                        "All your business solutions and consulting needs in one convenient, accessible place"}
                    </p>
                    <Button
                      size="lg"
                      asChild
                      className="bg-white text-blue-600 hover:bg-blue-50 border-none font-bold shadow-lg shadow-black/10 w-full"
                    >
                      <Link href="/contact">
                        {sidebarContent.cta_button || "Contact us"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </MotionWrapper>

              {/* Tags */}
              <MotionWrapper direction="left" delay={0.5}>
                <Card className="bg-white border-slate-100 shadow-sm">
                  <CardHeader className="pb-4 border-b border-slate-50">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      {sidebarContent.tags_title || "Tags"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Button
                          key={`${tag}-${index}`}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all rounded-lg"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <AskExpertSection />
      </div>

      {/* CTA Section */}
      <DynamicCTASection />
    </div>
  );
}
